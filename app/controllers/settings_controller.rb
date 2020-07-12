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
    params.require(:setting).permit(:is_playoffs_started, :min_centers, :max_centers, :min_wingers, :max_wingers,
                                    :min_defensemen, :max_defensemen, :min_goalies, :max_goalies, :points_goals,
                                    :points_assists, :points_gwg, :points_shg, :points_otg, :points_wins, :points_otl,
                                    :points_shutouts, :points_finals_goals, :points_finals_assists, :points_finals_gwg,
                                    :points_finals_shg, :points_finals_otg, :points_finals_wins, :points_finals_otl,
                                    :points_finals_shutouts)
  end
end
