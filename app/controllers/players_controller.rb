class PlayersController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    setting = Setting.first
    players = Team.includes(:players).where(made_playoffs: true).flat_map do |team|
      team.players.as_json(only: %i[_id position stats], setting:)
    end
    players.each do |player|
      player['stats'].each do |date_stat|
        date_stat.each do |key, _value|
          next if %w[date goals points].include?(key)

          date_stat.delete key
        end
      end
    end
    render json: players
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
