class PlayersController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    render json: Player.where(team_id: params[:team_id])
  end

  def create
    team = Team.find(params[:team_id])
    player = team.players.create(player_params)
    render json: player
  end

  def show
    render json: Player.find(params[:id])
  end

  def update
    player = Player.find(params[:id])
    render json: player.update_attributes(player_params)
  end

  def destroy
    render json: Player.delete(params[:id])
  end

  private

  def player_params
    params.require(:player).permit(:first_name, :last_name, :position, :goals, :assists, :gwg, :shg, :otg, :wins, :otl,
                                   :shutouts, :finals_goals, :finals_assists, :finals_gwg, :finals_shg, :finals_otg,
                                   :finals_wins, :finals_otl, :finals_shutouts, :points)
  end
end
