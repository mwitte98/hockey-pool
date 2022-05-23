class EntriesController < ApplicationController
  before_action :signed_in?, only: %i[update destroy]

  def index
    entries = Entry.includes(:players).all
    case params[:field_groups]
    when 'player_ids'
      render json: entries.as_json(only: :player_ids).map { |e| e['player_ids'] }
    when 'display'
      render json: entries.as_json(only: %i[name player_ids])
    else
      render json: entries
    end
  end

  def create
    entry = Entry.create(entry_params)
    render json: entry
  end

  def show
    render json: Entry.find(params[:id])
  end

  def update
    entry = Entry.find(params[:id])
    entry.update(entry_params)
    render json: entry
  end

  def destroy
    entry = Entry.find(params[:id])
    entry.players.clear
    render json: entry.delete
  end

  def update_player_stats
    UpdateJob.perform_async
    render json: ''
  end

  private

  def entry_params
    params.permit(:name, :contestant_name, :email, player_ids: [])
  end

  def query_teams_and_players
    teams = Team.where(made_playoffs: true).order(:is_eliminated, :conference, :rank)
    players = Player.all.as_json(setting: Setting.first)
    players = filter_players_and_attrs teams, players
    [teams, players]
  end

  def filter_players_and_attrs(teams, players)
    remaining_teams = get_teams_remaining teams
    players.select do |player|
      team = teams.find { |t| t.id == player['team_id'] }
      if team.nil?
        false
      else
        remove_attrs player if team['is_eliminated'] || remaining_teams.length != 2
        true
      end
    end
  end

  def get_teams_remaining(teams)
    teams.select { |team| team['is_eliminated'] == false }.map(&:id)
  end

  def remove_attrs(player)
    player.except! 'finals_goals', 'finals_assists', 'finals_gwg', 'finals_shg', 'finals_otg',
                   'finals_wins', 'finals_otl', 'finals_shutouts'
  end
end
