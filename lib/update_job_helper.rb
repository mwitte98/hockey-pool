module UpdateJobHelper
  class << UpdateJobHelper
    def setup_teams
      teams = Team.includes(:players).all.as_json(
        only: %i[id name],
        include: { players: { only: %i[id first_name last_name] } }
      )
      teams.each do |team|
        team['players'].each { |player| setup_player_hash player }
      end
    end

    def setup_player_hash(player)
      stats = %w[goals assists gwg shg wins shutouts otl points otg finals_goals finals_assists
                 finals_gwg finals_shg finals_otg finals_wins finals_otl finals_shutouts]
      player['name'] = "#{player['first_name']} #{player['last_name']}"
      player.except! 'first_name', 'last_name'
      stats.each { |stat| player[stat] = 0 }
    end

    def update_players(teams)
      teams.each do |team|
        team['players'].each do |player|
          player['points'] = calculate_points player
          Player.update(player['id'], remove_name(player))
        end
      end
    end

    def calculate_points(player)
      points_hash = { 'goals': 2, 'assists': 1, 'gwg': 1, 'shg': 3, 'otg': 2, 'wins': 2, 'otl': 1, 'shutouts': 4,
                      'finals_goals': 2, 'finals_assists': 1, 'finals_gwg': 1, 'finals_shg': 3, 'finals_otg': 2,
                      'finals_wins': 2, 'finals_otl': 1, 'finals_shutouts': 4 }
      total_points = 0
      points_hash.each { |stat, points| total_points += player[stat.to_s] * points }
      total_points
    end

    def remove_name(player)
      player.except!('name')
    end
  end
end
