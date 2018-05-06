class TeamsController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    teams = Team.includes(:players).all.order(:is_eliminated, :id)
    render json: teams.as_json(include: { players: { except: %i[team_id created_at updated_at] } })
  end

  def create
    render json: Team.create(team_params)
  end

  def show
    render json: Team.find(params[:id])
  end

  def update
    team = Team.find(params[:id])
    render json: team.update_attributes(team_params)
  end

  def destroy
    render json: Team.delete(params[:id])
  end

  private

  def team_params
    params.require(:team).permit(:name, :abbr, :is_eliminated)
  end
end
