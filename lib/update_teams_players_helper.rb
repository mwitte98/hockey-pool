module UpdateTeamsPlayersHelper
  class << UpdateTeamsPlayersHelper
    def update
      agent = Mechanize.new
      setup_teams
      valid_months = %w[2024-04 2024-05 2024-06]
      @current_date = '2024-04-20'
      while valid_months.include? @current_date[0...7]
        response = JSON.parse(agent.get("https://api-web.nhle.com/v1/score/#{@current_date}").body)
        parse_date response
        @current_date = response['nextDate']
      end
      update_stats
    end

    private

    def setup_teams
      teams = Team.includes(:players).where(made_playoffs: true).all.as_json(
        only: %i[_id name abbr], include: { players: { only: %i[_id player_id player_ids position stats] } },
        set_player_points: false
      )
      teams.each { |team| setup_team team }
      @teams = teams.to_h { |team| [team['abbr'], team] }
    end

    def setup_team(team)
      players = team['players']
      players.each do |player|
        player['previous_stats'] = player['stats'].clone
        player['stats'] = []
      end
      players, goalies = players.partition { |player| player['position'] != 'Goalie' }
      team['players'] = players.to_h { |player| [player['player_id'], player] }
      team['goalie'] = goalies[0]
    end

    def parse_date(date)
      date['games'].each do |game|
        next if game['gameState'] == 'FUT'

        @game = game
        is_game_final = %w[OFF FINAL].include? @game['gameState']
        parse_goals
        parse_game_final_stats if is_game_final
      end
    end

    def parse_goals
      @game['goals'].each do |goal|
        scoring_team = @teams[goal['teamAbbrev']]
        parse_goal_players goal, scoring_team
      end
    end

    def parse_goal_players(goal, scoring_team)
      goal_scorer = find_player scoring_team, goal['playerId']
      update_offensive_stats goal, goal_scorer if goal_scorer

      goal['assists'].each do |assist|
        assist_scorer = find_player scoring_team, assist['playerId']
        update_stat assist_scorer, 'assists' if assist_scorer
      end
    end

    def find_player(scoring_team, player_id)
      if scoring_team['goalie']['player_ids'].include? player_id
        scoring_team['goalie']
      else
        scoring_team['players'][player_id]
      end
    end

    def update_offensive_stats(goal, goal_scorer)
      update_stat goal_scorer, 'goals'
      update_stat goal_scorer, 'shg' if goal['strength'] == 'sh'
      update_stat goal_scorer, 'otg' if goal['period'] > 3
    end

    def parse_game_final_stats
      home_team, home_score = parse_teams 'homeTeam'
      away_team, away_score = parse_teams 'awayTeam'
      home_goalie = home_team['goalie']
      away_goalie = away_team['goalie']
      if home_score > away_score
        update_game_winning_goal home_team, 'homeScore', away_score
        update_winning_goalie home_goalie, away_score
        update_losing_goalie away_goalie
      else
        update_game_winning_goal away_team, 'awayScore', home_score
        update_winning_goalie away_goalie, home_score
        update_losing_goalie home_goalie
      end
    end

    def parse_teams(location)
      team = @game[location]
      [@teams[team['abbrev']], team['score']]
    end

    def update_game_winning_goal(scoring_team, score_location, opponent_score)
      winning_goal = @game['goals'].find { |goal| goal[score_location] > opponent_score }
      winning_goal_scorer = find_player scoring_team, winning_goal['playerId']
      update_stat winning_goal_scorer, 'gwg'
    end

    def update_winning_goalie(winning_team_goalie, opponent_score)
      update_stat winning_team_goalie, 'wins'
      update_stat winning_team_goalie, 'shutouts' if opponent_score.zero?
    end

    def update_losing_goalie(losing_team_goalie)
      update_stat losing_team_goalie, 'otl' if @game['period'] > 3
    end

    def update_stat(player, stat)
      date_stats = player['stats'].find { |date_stat| date_stat['date'] == @current_date }
      if date_stats.nil?
        date_stat = { date: @current_date, round: @game['id'].digits.reverse[7], stat => 1 }.stringify_keys!
        player['stats'] << date_stat
      elsif date_stats[stat].nil?
        date_stats[stat] = 1
      else
        date_stats[stat] += 1
      end
    end

    def update_stats
      @teams.each_value do |team|
        team['players'].values.append(team['goalie']).each do |player|
          next if player['previous_stats'] == player['stats']

          Player.where(id: player['id']).update(stats: player['stats'])
        end
      end
    end
  end
end
