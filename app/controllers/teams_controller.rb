class TeamsController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    teams = query_teams
    teams = flatten_stats teams if params[:field_groups] == 'home'
    players_set_selected teams if params[:field_groups] == 'player_stats'
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

  def bulk_create
    SeedTeamsPlayersHelper.seed
    render json: ''
  end

  def bulk_update
    case params[:days_to_update]
    when 'today'
      UpdateTeamsPlayersHelper.update_today
    when 'all'
      UpdateTeamsPlayersHelper.update_all_days
    end
    render json: ''
  end

  def destroy
    render json: Team.delete(params[:id])
  end

  private

  def team_params
    params.permit(:name, :abbr, :is_eliminated, :made_playoffs, :conference, :rank)
  end

  def query_teams
    case params[:field_groups]
    when 'home'
      query_home
    when 'player_stats'
      query_player_stats
    when 'upsert_entry'
      query_upsert_entry
    else
      query_else
    end
  end

  def query_home
    Team.includes(:players).where(made_playoffs: true).order(is_eliminated: 1, conference: 1, rank: 1).as_json(
      only: %i[name abbr is_eliminated],
      include: { players: { except: %i[team_id entry_ids created_at updated_at] } },
      setting: Setting.first
    )
  end

  def query_player_stats
    Team.includes(:players).where(made_playoffs: true).as_json(
      only: %i[abbr is_eliminated], include: { players: { except: %i[team_id entry_ids created_at updated_at] } },
      setting: Setting.first
    )
  end

  def query_upsert_entry
    Team.includes(:players).where(made_playoffs: true).order(is_eliminated: 1, conference: 1, rank: 1).as_json(
      only: %i[name abbr], include: { players: { only: %i[_id first_name last_name position] } }
    )
  end

  def query_else
    Team.includes(:players).all.order(is_eliminated: 1, conference: 1, rank: 1).as_json(
      include: { players: { except: %i[team_id entry_ids stats created_at updated_at] } }, setting: Setting.first
    )
  end

  def players_set_selected(teams)
    selected_player_ids = Entry.distinct(:player_ids).map(&:to_s)
    teams.each do |team|
      team['players'].each do |player|
        player['is_selected'] = true if !selected_player_ids.empty? && selected_player_ids.include?(player['id'])
        player.delete 'id'
      end
    end
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
