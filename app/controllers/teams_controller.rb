class TeamsController < ApplicationController
  before_filter :authenticate_user!

  def index
    respond_with Team.all
  end
  
  def create
    respond_with Team.create(team_params)
  end
  
  def show
    respond_with Team.find(params[:id])
  end
  
  def update
    team = Team.find(params[:id])
    respond_with team.update_attributes(team_params)
  end
  
  def destroy
    respond_with Team.delete(params[:id])
  end
  
  private
    def team_params
      params.require(:team).permit(:name, :abbr)
    end
end
