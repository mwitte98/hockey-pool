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
    if num_teams_remaining == 2
      teams.each { |team| team['in_finals'] = true if team['is_eliminated'] == false }
    end
    remove_attrs(teams)
  end

  def calc_num_teams_remaining(teams)
    teams.select { |team| team['is_eliminated'] == false }.length
  end

  def remove_attrs(teams)
    teams.each do |team|
      team['players'].each do |player|
        player.delete_if { |_, value| value.is_a?(Numeric) && value.zero? }
      end
    end
  end
end
