class TeamsController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    teams = query_teams
    selected_player_ids = []
    if params[:field_groups] == 'player_stats'
      query = 'select distinct(player_id) from entries_players'
      selected_player_ids = ActiveRecord::Base.connection.exec_query(query).rows.flatten
    end
    update_in_finals teams
    teams = remove_attrs teams, selected_player_ids
    render json: teams
  end

  def create
    render json: Team.create(team_params)
  end

  def show
    render json: Team.find(params[:id])
  end

  def update
    team = Team.find(params[:id])
    render json: team.update(team_params)
  end

  def destroy
    render json: Team.delete(params[:id])
  end

  private

  def team_params
    params.permit(:name, :abbr, :is_eliminated, :made_playoffs, :conference, :rank, :nhl_id)
  end

  def query_teams
    case params[:field_groups]
    when 'player_stats'
      query_player_stats
    when 'upsert_entry'
      query_upsert_entry
    else
      query_else
    end
  end

  def query_player_stats
    Team.includes(:players).where(made_playoffs: true).as_json(
      only: %i[abbr is_eliminated], include: { players: { except: %i[team_id created_at updated_at] } },
      setting: Setting.first
    )
  end

  def query_upsert_entry
    Team.includes(:players).where(made_playoffs: true).order(:conference, :rank).as_json(
      only: %i[name], include: { players: { only: %i[id first_name last_name position] } }
    )
  end

  def query_else
    Team.includes(:players).all.order(:is_eliminated, :conference, :rank).as_json(
      include: { players: { except: %i[team_id created_at updated_at] } }, setting: Setting.first
    )
  end

  def update_in_finals(teams)
    num_teams_remaining = teams.select { |team| team['is_eliminated'] == false }.length
    return unless num_teams_remaining == 2

    teams.each { |team| team['in_finals'] = true if team['is_eliminated'] == false }
  end

  def remove_attrs(teams, selected_player_ids)
    teams.each do |team|
      team['players'].each do |player|
        player.delete_if { |_, value| value.is_a?(Numeric) && value.zero? }
        player['is_selected'] = true if !selected_player_ids.empty? && selected_player_ids.include?(player['id'])
      end
    end
  end
end
