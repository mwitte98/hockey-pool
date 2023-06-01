module UpdateTeamsPlayersHelper
  class << UpdateTeamsPlayersHelper
    def initialize
      @teams = nil
      @date = nil
      @game = nil
    end

    def update
      agent = Mechanize.new
      roster_response = JSON.parse(agent.get('http://statsapi.web.nhl.com/api/v1/teams?hydrate=roster&season=20222023').body)
      setup_teams roster_response
      response = JSON.parse(agent.get('https://statsapi.web.nhl.com/api/v1/schedule?gameType=P&startDate=2023-01-01&endDate=2023-12-31&hydrate=linescore,scoringplays,decisions,game(seriesSummary)').body)
      response['dates'].each { |date| parse_date date }
      update_stats
    end

    private

    def setup_teams(roster_response)
      query_teams
      @teams.each do |team|
        update_goalie_names team, roster_response
        team['players'].each do |player|
          player['name'] = "#{player['first_name']} #{player['last_name']}"
          player['previous_stats'] = player['stats'].clone
          player['stats'] = []
          player.except! 'first_name', 'last_name'
        end
      end
    end

    def query_teams
      @teams = Team.includes(:players).where(made_playoffs: true).all.as_json(
        only: %i[_id name abbr stats], include: { players: { only: %i[_id first_name last_name stats] } },
        set_player_points: false
      )
    end

    def update_goalie_names(team, roster_response)
      team['goalie_names'] = roster_response['teams']
                             .find { |team_roster| team_roster['name'] == team['name'] }['roster']['roster']
                             .find_all { |roster_player| roster_player['position']['name'] == 'Goalie' }
                             .map { |goalie| goalie['person']['fullName'] }
    end

    def parse_date(date)
      @date = date['date']
      date['games'].each do |game|
        @game = game
        is_game_final = @game['status']['detailedState'] == 'Final'
        parse_scoring_plays
        parse_goalie_stats if is_game_final
      end
    end

    def parse_scoring_plays
      scoring_plays = @game['scoringPlays']
      return unless scoring_plays

      scoring_plays.each do |scoring_play|
        next if scoring_play['about']['periodType'] == 'SHOOTOUT'

        scoring_team = @teams.find { |team| team['name'] == scoring_play['team']['name'] }
        parse_scoring_play_players scoring_play, scoring_team
      end
    end

    def parse_scoring_play_players(scoring_play, scoring_team)
      scoring_play['players'].each do |player|
        scoring_player = if scoring_team['goalie_names'].include? player['player']['fullName']
                           find_team_goalie scoring_team
                         else
                           find_player scoring_team, player['player']
                         end
        next unless scoring_player

        player_type = player['playerType']
        update_offensive_stats scoring_play, scoring_player if player_type == 'Scorer'
        update_stat scoring_player, 'assists' if player_type == 'Assist'
      end
    end

    def update_offensive_stats(scoring_play, scoring_player)
      result = scoring_play['result']
      update_stat scoring_player, 'goals'
      update_stat scoring_player, 'gwg' if result['gameWinningGoal']
      update_stat scoring_player, 'shg' if result['strength']['code'] == 'SHG'
      update_stat scoring_player, 'otg' if scoring_play['about']['period'] > 3
    end

    def parse_goalie_stats
      home_team, home_score = parse_teams 'home'
      away_team, away_score = parse_teams 'away'
      if home_score > away_score
        update_winning_goalie home_team, away_score
        update_losing_goalie away_team
      else
        update_winning_goalie away_team, home_score
        update_losing_goalie home_team
      end
    end

    def parse_teams(location)
      team = @game['teams'][location]
      team_found = @teams.find { |t| t['name'] == team['team']['name'] }
      [team_found, team['score']]
    end

    def update_winning_goalie(winning_team, opponent_score)
      team_goalie = find_team_goalie winning_team
      update_stat team_goalie, 'wins'
      update_stat team_goalie, 'shutouts' if opponent_score.zero?
    end

    def update_losing_goalie(losing_team)
      team_goalie = find_team_goalie losing_team
      update_stat team_goalie, 'otl' if @game['linescore']['periods'].count > 3
    end

    def find_player(team, player_name)
      team['players'].find { |player| player['name'] == player_name['fullName'] }
    end

    def find_team_goalie(team)
      team_goalie_name = "#{team['name']} #{team['abbr']}"
      team['players'].find { |player| player['name'] == team_goalie_name }
    end

    def update_stat(player, stat)
      date_stats = player['stats'].find { |date_stat| date_stat['date'] == @date }
      if date_stats.nil?
        date_stat = { date: @date, round: @game['gamePk'].digits[2], stat => 1 }.stringify_keys!
        player['stats'] << date_stat
      elsif date_stats[stat].nil?
        date_stats[stat] = 1
      else
        date_stats[stat] += 1
      end
    end

    def update_stats
      @teams.each do |team|
        team['players'].each do |player|
          next if player['previous_stats'] == player['stats']

          Player.where(id: player['id']).update(stats: player['stats'])
        end
      end
    end
  end
end
