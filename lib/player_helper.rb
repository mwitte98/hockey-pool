module PlayerHelper
  class << PlayerHelper
    def calculate_points(player, setting)
      stats = %w[goals assists gwg shg otg wins otl shutouts finals_goals finals_assists
                 finals_gwg finals_shg finals_otg finals_wins finals_otl finals_shutouts]
      total_points = 0
      stats.each do |stat|
        total_points += player[stat] * setting["points_#{stat}"] unless player[stat].nil?
      end
      total_points
    end
  end
end
