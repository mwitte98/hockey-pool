class UpdateJob
  include SuckerPunch::Job

  def perform
    agent = Mechanize.new
    goalies_data = get_data(agent, 'http://www.nhl.com/stats/rest/goalies?reportType=goalie_basic&reportName=goaliesummary&cayenneExp=seasonId=20172018%20and%20gameTypeId=3')
    skaters_data = get_data(agent, 'http://www.nhl.com/stats/rest/skaters?reportType=basic&reportName=skatersummary&cayenneExp=seasonId=20172018%20and%20gameTypeId=3')

    update_players goalies_data, skaters_data
  end

  private

  def get_data(agent, url)
    agent.get(url)
    JSON.parse(agent.page.body)['data']
  end

  def update_players(goalies_data, skaters_data)
    teams = Team.includes(:players).all
    teams.each do |team|
      team.players.each do |player|
        if player.position == 'Goalie'
          update_goalie player, team, goalies_data
        else
          update_skater player, team, skaters_data
        end
      end
    end
  end

  def find_player(player, abbr, players_data)
    players_data.find do |data|
      data['playerLastName'] == player.last_name &&
        data['playerFirstName'] == player.first_name &&
        data['playerTeamsPlayedFor'] == abbr
    end
  end

  def update_goalie(player, team, goalies_data)
    goalie_data = find_player player, team.abbr, goalies_data
    update_goalie_in_db player, goalie_data if goalie_data
  end

  def update_skater(player, team, skaters_data)
    skater_data = find_player player, team.abbr, skaters_data
    update_skater_in_db player, skater_data if skater_data
  end

  def update_goalie_in_db(player, player_data)
    goals = player_data['goals'] || player.goals
    assists = player_data['assists'] || player.assists
    wins = player_data['wins'] || player.wins
    otl = player_data['otLosses'] || player.otl
    shutouts = player_data['shutouts'] || player.shutouts
    points = (goals * 2) + assists + (wins * 2) + otl + (shutouts * 4)
    player.update(goals: goals, assists: assists, wins: wins,
                  otl: otl, shutouts: shutouts, points: points)
  end

  def update_skater_in_db(player, player_data)
    goals = player_data['goals'] || player.goals
    assists = player_data['assists'] || player.assists
    gwg = player_data['gameWinningGoals'] || player.gwg
    shg = player_data['shGoals'] || player.shg
    otg = player_data['otGoals'] || player.otg
    points = (goals * 2) + assists + gwg + (shg * 3) + (otg * 2)
    player.update(goals: goals, assists: assists, gwg: gwg,
                  shg: shg, otg: otg, points: points)
  end
end
