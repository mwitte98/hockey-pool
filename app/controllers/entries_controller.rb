class EntriesController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    entries = Entry.includes(:players).all.as_json
    teams = Team.all.order(:is_eliminated, :id).as_json
    num_teams_remaining = teams.select { |team| team['is_eliminated'] == false }.length
    players = Player.includes(:team).all.as_json
    players = remove_finals_attrs players if num_teams_remaining != 2
    render json: { entries: entries, players: players, teams: teams }
  end

  def create
    entry = Entry.create(entry_params)
    entry.player_ids = params[:player_ids]
    render json: entry
  end

  def show
    render json: Entry.find(params[:id])
  end

  def update
    entry = Entry.find(params[:id])
    entry.update_attributes(entry_params)
    entry.player_ids = params[:player_ids]
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
    params.require(:entry).permit(:name)
  end

  def remove_finals_attrs(players)
    players.each do |player|
      player.except! 'finals_goals', 'finals_assists', 'finals_gwg', 'finals_shg', 'finals_otg',
                     'finals_wins', 'finals_otl', 'finals_shutouts'
    end
  end
end
