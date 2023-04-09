module UpdateTeamsPlayersHelper
  class << UpdateTeamsPlayersHelper
    def initialize
      @teams = nil
      @date = nil
      @game = nil
      @scoring_player = nil
    end

    def update
      setup_teams
      agent = Mechanize.new
      response = JSON.parse(agent.get('https://statsapi.web.nhl.com/api/v1/schedule?gameType=P&startDate=2022-01-31&endDate=2022-12-31&hydrate=linescore,scoringplays,decisions,game(seriesSummary)').body)
      response['dates'].each { |date| parse_date date }
      update_players
    end

    private

    def setup_teams
      query_teams
      @teams.each do |team|
        team['players'].each do |player|
          player['name'] = "#{player['first_name']} #{player['last_name']}"
          player['previous_stats'] = player['stats'].clone
          player['stats'] = []
          player.except! 'first_name', 'last_name', 'points'
        end
      end
    end

    def query_teams
      @teams = Team.includes(:players).where(made_playoffs: true).all.as_json(
        only: %i[_id name],
        include: { players: { only: %i[_id first_name last_name stats] } },
        setting: Setting.first,
        set_player_points: false
      )
    end

    def parse_date(date)
      @date = date['date']
      date['games'].each do |game|
        @game = game
        is_game_final = @game['status']['detailedState'] == 'Final'
        parse_scoring_plays
        next unless is_game_final

        game_teams, score_attr = check_goalie_date
        parse_goalie_stats game_teams, score_attr
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
        @scoring_player = find_player scoring_team, player['player']
        next unless @scoring_player

        player_type = player['playerType']
        update_offensive_stats scoring_play if player_type == 'Scorer'
        update_stat @scoring_player, 'assists' if player_type == 'Assist'
      end
    end

    def update_offensive_stats(scoring_play)
      result = scoring_play['result']
      update_stat @scoring_player, 'goals'
      update_stat @scoring_player, 'gwg' if result['gameWinningGoal']
      update_stat @scoring_player, 'shg' if result['strength']['code'] == 'SHG'
      update_stat @scoring_player, 'otg' if scoring_play['about']['period'] > 3
    end

    def check_goalie_date
      return [@game['teams'], 'score'] if @game.key? 'decisions'

      agent = Mechanize.new
      response = JSON.parse(agent.get("https://statsapi.web.nhl.com#{@game['link']}").body)
      @game = response['liveData']
      [@game['linescore']['teams'], 'goals']
    end

    def parse_goalie_stats(game_teams, score_attr)
      home_team, home_score = parse_teams game_teams, 'home', score_attr
      away_team, away_score = parse_teams game_teams, 'away', score_attr
      if home_score > away_score
        update_winning_goalie home_team, away_score
        update_losing_goalie away_team
      else
        update_winning_goalie away_team, home_score
        update_losing_goalie home_team
      end
    end

    def parse_teams(game_teams, location, score_attr)
      team = game_teams[location]
      score = team[score_attr]
      team_found = @teams.find { |t| t['name'] == team['team']['name'] }
      [team_found, score]
    end

    def update_winning_goalie(winning_team, opponent_score)
      winner = find_player winning_team, @game['decisions']['winner']
      return unless winner

      update_stat winner, 'wins'
      update_stat winner, 'shutouts' if opponent_score.zero?
    end

    def update_losing_goalie(losing_team)
      loser = find_player losing_team, @game['decisions']['loser']
      update_stat loser, 'otl' if loser && @game['linescore']['periods'].count > 3
    end

    def find_player(team, player_name)
      team['players'].find { |player| player['name'] == player_name['fullName'] }
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

    def update_players
      @teams.each do |team|
        team['players'].each do |player|
          next if player['previous_stats'] == player['stats']

          Player.where(id: player['id']).update(player.except!('name', 'previous_stats'))
        end
      end
    end
  end
end
