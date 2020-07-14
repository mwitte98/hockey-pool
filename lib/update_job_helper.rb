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
      stats = %w[goals assists gwg shg wins shutouts otl otg finals_goals finals_assists
                 finals_gwg finals_shg finals_otg finals_wins finals_otl finals_shutouts]
      player['name'] = "#{player['first_name']} #{player['last_name']}"
      player.except! 'first_name', 'last_name'
      stats.each { |stat| player[stat] = 0 }
    end

    def update_players(teams)
      teams.each do |team|
        team['players'].each do |player|
          Player.update(player['id'], remove_name(player))
        end
      end
    end

    def remove_name(player)
      player.except!('name')
    end
  end
end
