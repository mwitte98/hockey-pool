module SeedTeamsPlayersHelper
  class << SeedTeamsPlayersHelper
    def seed
      agent = Mechanize.new
      standings = JSON.parse(agent.get('https://api-web.nhle.com/v1/standings/now').body)
      standings['standings'].each do |team_standing|
        team = create_team team_standing
        roster = JSON.parse(agent.get("https://api-web.nhle.com/v1/roster/#{team.abbr}/current").body)
        create_players team, roster
        create_team_goalie team, roster
      end
    end

    private

    def create_team(team_standing)
      qualified = team_standing['wildcardSequence'].to_i <= 2
      Team.create(
        name: team_standing['teamName']['default'], abbr: team_standing['teamAbbrev']['default'],
        conference: team_standing['conferenceName'], rank: team_standing['conferenceSequence'].to_i,
        is_eliminated: !qualified, made_playoffs: qualified
      )
    end

    def create_players(team, roster)
      players = roster['forwards'] + roster['defensemen']
      players.each do |player|
        team.players.create(
          player_id: player['id'], first_name: player['firstName']['default'], last_name: player['lastName']['default'],
          position: get_position(player['positionCode']), stats: []
        )
      end
    end

    def get_position(position_code)
      if position_code == 'C'
        'Center'
      elsif position_code == 'D'
        'Defenseman'
      else
        'Winger'
      end
    end

    def create_team_goalie(team, roster)
      team.players.create(
        player_ids: roster['goalies'].map { |goalie| goalie['id'] }, first_name: team.name, last_name: team.abbr,
        position: 'Goalie', stats: []
      )
    end
  end
end
