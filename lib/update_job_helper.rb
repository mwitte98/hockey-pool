module UpdateJobHelper
  class << UpdateJobHelper
    def setup_teams
      teams = Team.includes(:players).all.as_json(
        only: %i[_id name],
        include: { players: { only: %i[_id first_name last_name] } }
      )
      teams.each do |team|
        team['players'].each do |player|
          player['name'] = "#{player['first_name']} #{player['last_name']}"
          player['stats'] = []
          player.except! 'first_name', 'last_name', 'points'
        end
      end
    end

    def update_players(teams)
      teams.each do |team|
        team['players'].each do |player|
          Player.find(player['id']).update(player.except!('name'))
        end
      end
    end
  end
end
