class SettingsController < ApplicationController
  before_action :signed_in?, only: :update

  def index
    render json: Setting.first
  end

  def update
    setting = Setting.find(params[:id])
    render json: setting.update(setting_params)
  end

  private

  def setting_params
    params.permit(:is_playoffs_started, :min_centers, :max_centers, :min_wingers, :max_wingers, :min_defensemen,
                  :max_defensemen, :min_goalies, :max_goalies, :points_goals, :points_assists, :points_gwg, :points_shg,
                  :points_otg, :points_wins, :points_otl, :points_shutouts, round_multipliers: [])
  end
end
