class TeamsController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    teams = query_teams
    selected_player_ids = []
    if params[:field_groups] == 'player_stats'
      query = 'select distinct(player_id) from entries_players'
      selected_player_ids = ActiveRecord::Base.connection.exec_query(query).rows.flatten
    end
    teams = flatten_stats teams if params[:field_groups] == 'home'
    set_selected_players teams, selected_player_ids if params[:field_groups] != 'home'
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
    when 'home'
      query_home
    when 'player_stats'
      query_player_stats
    when 'upsert_entry'
      query_upsert_entry
    when 'historical'
      query_historical
    else
      query_else
    end
  end

  def query_home
    Team.includes(:players).where(made_playoffs: true).order(:is_eliminated, :conference, :rank).as_json(
      only: %i[id name abbr is_eliminated nhl_id], include: { players: { except: %i[team_id created_at updated_at] } },
      setting: Setting.first
    )
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

  def query_historical
    Team.includes(:players).where(made_playoffs: true).as_json(
      only: [], include: { players: { only: %i[id position stats] } },
      setting: Setting.first
    )
  end

  def query_else
    Team.includes(:players).all.order(:is_eliminated, :conference, :rank).as_json(
      include: { players: { except: %i[team_id stats created_at updated_at] } }, setting: Setting.first
    )
  end

  def flatten_stats(teams)
    teams.each do |team|
      team['players'].each do |player|
        player['stats']&.each do |date_stat|
          flatten_player_stats player, date_stat
        end
        player.delete 'stats'
      end
    end
  end

  def set_selected_players(teams, selected_player_ids)
    teams.each do |team|
      team['players'].each do |player|
        player['is_selected'] = true if !selected_player_ids.empty? && selected_player_ids.include?(player['id'])
      end
    end
  end

  def flatten_player_stats(player, date_stat)
    date_stat.each do |key, value|
      next unless %w[goals points].include?(key)

      update_player_stat player, key, value
    end
  end

  def update_player_stat(player, stat, value)
    if player[stat].nil?
      player[stat] = value
    else
      player[stat] += value
    end
  end
end
