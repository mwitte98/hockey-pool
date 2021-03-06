class TeamsController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    teams = Team.includes(:players).all.order(:is_eliminated, :conference, :rank).as_json(
      include: { players: { except: %i[team_id created_at updated_at] } }, setting: Setting.first
    )
    teams = remove_finals_attrs teams
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

  def remove_finals_attrs(teams)
    num_teams_remaining = calc_num_teams_remaining teams
    teams.each { |team| remove_attrs team if team['is_eliminated'] || num_teams_remaining != 2 }
  end

  def calc_num_teams_remaining(teams)
    teams.select { |team| team['is_eliminated'] == false }.length
  end

  def remove_attrs(team)
    team['players'].each do |player|
      player.except! 'finals_goals', 'finals_assists', 'finals_gwg', 'finals_shg', 'finals_otg',
                     'finals_wins', 'finals_otl', 'finals_shutouts'
    end
  end
end
