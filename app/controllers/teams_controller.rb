class TeamsController < ApplicationController
  before_action :signed_in?, only: [:create, :update, :destroy]

  def index
    render json: Team.includes(:players).all.order(:is_eliminated, :id)
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
