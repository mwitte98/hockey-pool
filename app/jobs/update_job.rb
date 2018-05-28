class UpdateJob
  include SuckerPunch::Job

  def perform
    teams = setup_teams
    agent = Mechanize.new
    agent.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=2018-04-11&endDate=2018-07-01&hydrate=linescore,scoringplays,decisions,game(seriesSummary)')
    response = JSON.parse(agent.page.body)
    response['dates'].each do |date|
      date['games'].each do |game|
        is_finals = game['gamePk'].digits[7] == 4
        game['scoringPlays'].each do |scoring_play|
          scoring_team = teams.find { |team| team['name'] == scoring_play['team']['name'] }
          scoring_play['players'].each do |player|
            player_type = player['playerType']
            next if player_type == 'Goalie'
            scoring_player = scoring_team['players'].find { |p| p['name'] == player['player']['fullName'] }
            next if scoring_player.nil?
            if player_type == 'Scorer'
              scoring_player['goals'] += 1
              scoring_player['gwg'] += 1 if scoring_play['result']['gameWinningGoal']
              scoring_player['shg'] += 1 if scoring_play['result']['strength']['code'] == 'SHG'
              scoring_player['otg'] += 1 if scoring_play['about']['period'] > 3
              if is_finals
                scoring_player['finals_goals'] += 1
                scoring_player['finals_gwg'] += 1 if scoring_play['result']['gameWinningGoal']
                scoring_player['finals_shg'] += 1 if scoring_play['result']['strength']['code'] == 'SHG'
                scoring_player['finals_otg'] += 1 if scoring_play['about']['period'] > 3
              end
            elsif player_type == 'Assist'
              scoring_player['assists'] += 1
              scoring_player['finals_assists'] += 1 if is_finals
            end
          end
        end
        next unless game['status']['detailedState'] == 'Final'
        if game['teams']['away']['score'] > game['teams']['home']['score']
          winning_team = teams.find { |team| team['name'] == game['teams']['away']['team']['name'] }
          losing_team = teams.find { |team| team['name'] == game['teams']['home']['team']['name'] }
        else
          winning_team = teams.find { |team| team['name'] == game['teams']['home']['team']['name'] }
          losing_team = teams.find { |team| team['name'] == game['teams']['away']['team']['name'] }
        end
        winner = winning_team['players'].find { |p| p['name'] == game['decisions']['winner']['fullName'] }
        winner['wins'] += 1 unless winner.nil?
        winner['finals_wins'] += 1 if !winner.nil? && is_finals
        winner['shutouts'] += 1 if !winner.nil? && (game['teams']['away']['score'].zero? || game['teams']['home']['score'].zero?)
        winner['finals_shutouts'] += 1 if !winner.nil? && (game['teams']['away']['score'].zero? || game['teams']['home']['score'].zero?) && is_finals
        loser = losing_team['players'].find { |p| p['name'] == game['decisions']['loser']['fullName'] }
        loser['otl'] += 1 if !loser.nil? && game['linescore']['periods'].count > 3
        loser['finals_otl'] += 1 if !loser.nil? && game['linescore']['periods'].count > 3 && is_finals
      end
    end
    teams.each do |team|
      team['players'].each do |player|
        player['points'] = (player['goals'] * 2) + player['assists'] + player['gwg'] + (player['shg'] * 3) + (player['otg'] * 2) + (player['wins'] * 2) + player['otl'] + (player['shutouts'] * 4) + (player['finals_goals'] * 2) + player['finals_assists'] + player['finals_gwg'] + (player['finals_shg'] * 3) + (player['finals_otg'] * 2) + (player['finals_wins'] * 2) + player['finals_otl'] + (player['finals_shutouts'] * 4)
        Player.update(player['id'], player.except!('name'))
      end
    end
  end

  private

  def setup_teams
    teams = Team.includes(:players).all.as_json(
      only: %i[id name],
      include: { players: { only: %i[id first_name last_name] } }
    )
    stats = %w[goals assists gwg shg wins shutouts otl points otg finals_goals finals_assists
               finals_gwg finals_shg finals_otg finals_wins finals_otl finals_shutouts]
    teams.each do |team|
      team['players'].each do |player|
        player['name'] = "#{player['first_name']} #{player['last_name']}"
        player.except! 'first_name', 'last_name'
        stats.each { |stat| player[stat] = 0 }
      end
    end
  end
end
