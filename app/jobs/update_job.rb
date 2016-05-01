class UpdateJob
  include SuckerPunch::Job

  def perform
    agent = Mechanize.new
    agent.get('http://www.nhl.com/stats/rest/grouped/goalies/season/goaliesummary?cayenneExp=seasonId=20152016%20and%20gameTypeId=3%20and%20playerPositionCode=%22G%22')
    goalieJson = JSON.parse agent.page.body
    goalieData = goalieJson['data']
    
    teams = Team.all
    teams.each do |team|
      agent.get('http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=seasonId%3D20152016%20and%20gameTypeId%3D3%20and%20teamId%3D' + team.nhlID.to_s)
      teamJson = JSON.parse agent.page.body
      data = teamJson['data']
      
      team.players.each do |player|
        if player.position == 'Goalie'
          goalieData.each do |goalie|
            if player.nhlID == goalie['playerId']
              points = (goalie['goals'] * 2) + goalie['assists'] + (goalie['wins'] * 2) + goalie['otLosses'] + (goalie['shutouts'] * 4)
              player.update(goals: goalie['goals'], assists: goalie['assists'], wins: goalie['wins'], otl: goalie['otLosses'], shutouts: goalie['shutouts'], points: points)
              break
            end
          end
        else
          data.each do |skater|
            if player.nhlID == skater['playerId']
              points = (skater['goals'] * 2) + skater['assists'] + skater['gameWinningGoals'] + (skater['shGoals'] * 3)
              player.update(goals: skater['goals'], assists: skater['assists'], gwg: skater['gameWinningGoals'], shg: skater['shGoals'], points: points)
              break
            end
          end
        end
      end
    end
  end

  private
  
    
end