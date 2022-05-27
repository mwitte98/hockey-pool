class SeedTeamsPlayersJob
  include SuckerPunch::Job

  def perform
    agent = Mechanize.new
    standings = JSON.parse(agent.get('https://statsapi.web.nhl.com/api/v1/standings').body)
    rosters = JSON.parse(agent.get('http://statsapi.web.nhl.com/api/v1/teams?expand=team.roster').body)
    standings['records'].each do |record|
      record['teamRecords'].each do |team_record|
        update_teams_players rosters, team_record
      end
    end
  end

  private

  def update_teams_players(rosters, team_record)
    team_record_team = team_record['team']
    team_roster = find_roster rosters, team_record_team
    qualified = team_record['conferenceRank'].to_i <= 8
    team = Team.create(
      name: team_record_team['name'], abbr: team_roster['abbreviation'], nhl_id: team_record_team['id'],
      conference: team_roster['conference']['name'], rank: team_record['conferenceRank'].to_i,
      is_eliminated: !qualified, made_playoffs: qualified
    )
    create_players team, team_roster
  end

  def find_roster(rosters, team_record_team)
    rosters['teams'].find { |roster| roster['id'] == team_record_team['id'] }
  end

  def create_players(team, team_roster)
    team_roster['roster']['roster'].each do |player|
      name = player['person']['fullName'].split(' ', 2)
      position = player['position']['name']
      position = 'Winger' if ['Left Wing', 'Right Wing'].include? position
      team.players.create(first_name: name[0], last_name: name[1], position:, stats: [])
    end
  end
end
