class PlayersController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    render json: Player.where(team_id: params[:team_id]).as_json(setting: Setting.first)
  end

  def create
    team = Team.find(params[:team_id])
    player = team.players.create(player_params)
    render json: player.as_json(setting: Setting.first)
  end

  def show
    render json: Player.find(params[:id]).as_json(setting: Setting.first)
  end

  def update
    player = Player.find(params[:id])
    render json: player.update(player_params).as_json(setting: Setting.first)
  end

  def destroy
    render json: Player.delete(params[:id]).as_json(setting: Setting.first)
  end

  private

  def player_params
    params.permit(:first_name, :last_name, :position)
  end
end
