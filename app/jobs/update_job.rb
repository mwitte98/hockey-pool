class UpdateJob
  include SuckerPunch::Job

  def perform
    agent = Mechanize.new
    agent.get('http://www.nhl.com/stats/rest/grouped/goalies/season/goaliesummary?cayenneExp=seasonId=20152016%20and%20gameTypeId=3%20and%20playerPositionCode=%22G%22')
    goalie_json = JSON.parse agent.page.body
    goalie_data = goalie_json['data']

    teams = Team.all
    teams.each do |team|
      agent.get('http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=' \
      'seasonId%3D20152016%20and%20gameTypeId%3D3%20and%20teamId%3D' + team.nhlID.to_s)
      team_json = JSON.parse agent.page.body
      data = team_json['data']

      team.players.each do |player|
        nhl_id = player.nhlID
        if player.position == 'Goalie'
          goalie_data.each do |goalie|
            next unless nhl_id == goalie['playerId']
            goals = goalie['goals']
            assists = goalie['assists']
            wins = goalie['wins']
            otl = goalie['otLosses']
            shutouts = goalie['shutouts']
            points = (goals * 2) + assists + (wins * 2) + otl + (shutouts * 4)
            player.update(goals: goals, assists: assists, wins: wins,
                          otl: otl, shutouts: shutouts, points: points)
            break
          end
        else
          data.each do |skater|
            next unless nhl_id == skater['playerId']
            goals = skater['goals']
            assists = skater['assists']
            gwg = skater['gameWinningGoals']
            shg = skater['shGoals']
            points = (goals * 2) + assists + gwg + (shg * 3)
            player.update(goals: goals, assists: assists, gwg: gwg, shg: shg, points: points)
            break
          end
        end
      end
    end
  end
end
