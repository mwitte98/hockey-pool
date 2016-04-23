class PlayersController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update, :destroy]

  def index
    respond_with Player.where(team_id: params[:team_id])
  end
  
  def create
    team = Team.find(params[:team_id])
    player = team.players.create(player_params)
    respond_with player
  end
  
  def show
    respond_with Player.find(params[:id])
  end
  
  def update
    player = Player.find(params[:id])
    respond_with player.update_attributes(player_params)
  end
  
  def destroy
    respond_with Player.delete(params[:id])
  end
  
  private
    def player_params
      params.require(:player).permit(:first_name, :last_name, :position, :goals, :assists, :gwg, :shg, :wins, :otl, :shutouts, :nhlID, :points)
    end
end
