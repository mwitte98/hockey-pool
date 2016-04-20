class UpdateJob
  include SuckerPunch::Job

  def perform
    agent = Mechanize.new
    teams = Team.all
    teams.each do |team|
      agent.get('http://nhlwc.cdnak.neulion.com/fs1/nhl/league/playerstatsline/20152016/3/' + team.abbr + '/iphone/playerstatsline.json')
      teamJson = JSON.parse agent.page.body
      skaterData = teamJson['skaterData']
      goalieData = teamJson['goalieData']
      team.players.each do |player|
        if player.position == 'Goalie'
          goalieData.each do |goalie|
            if player.nhlID == goalie['id']
              goalieStats = goalie['data'].split(',')
              player.update(wins: goalieStats[4], otl: goalieStats[6], shutouts: goalieStats[12])
              break
            end
          end
        else
          skaterData.each do |skater|
            if player.nhlID == skater['id']
              skaterStats = skater['data'].split(',')
              player.update(goals: skaterStats[4], assists: skaterStats[5], gwg: skaterStats[13], shg: skaterStats[12])
              break
            end
          end
        end
      end
    end
  end

  private
  
    
end