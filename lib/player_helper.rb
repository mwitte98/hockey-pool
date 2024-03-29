module PlayerHelper
  class << PlayerHelper
    def set_points(player, setting)
      stats = %w[goals assists gwg shg otg wins otl shutouts]
      player['stats']&.each do |date_stat|
        total_points = 0
        stats.each do |stat|
          unless date_stat[stat].nil?
            total_points += date_stat[stat] * setting["points_#{stat}"] *
                            setting['round_multipliers'][date_stat['round'] - 1]
          end
        end
        date_stat['points'] = total_points
      end
    end
  end
end
