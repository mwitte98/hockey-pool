class UpdateJob
  include SuckerPunch::Job

  def initialize
    @is_finals = false
    @scoring_player = nil
  end

  def perform
    teams = UpdateJobHelper.setup_teams
    agent = Mechanize.new
    response = JSON.parse(agent.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=2018-04-11&endDate=2018-07-01&hydrate=linescore,scoringplays,decisions,game(seriesSummary)').body)
    response['dates'].each { |date| parse_date date, teams }
    UpdateJobHelper.update_players teams
  end

  private

  def parse_date(date, teams)
    date['games'].each do |game|
      parse_game game, teams, false
      parse_game game, teams, true if game['gamePk'].digits[2] == 4
    end
  end

  def parse_game(game, teams, is_finals)
    @is_finals = is_finals
    is_game_final = game['status']['detailedState'] == 'Final'
    parse_scoring_plays game, teams
    parse_goalie_stats game, teams if is_game_final
  end

  def parse_scoring_plays(game, teams)
    game['scoringPlays'].each do |scoring_play|
      scoring_team = teams.find { |team| team['name'] == scoring_play['team']['name'] }
      parse_scoring_play_players scoring_play, scoring_team
    end
  end

  def parse_scoring_play_players(scoring_play, scoring_team)
    scoring_play['players'].each do |player|
      @scoring_player = find_player scoring_team, player['player']
      update_player_stats player, scoring_play if @scoring_player
    end
  end

  def update_player_stats(player, scoring_play)
    player_type = player['playerType']
    update_offensive_stats scoring_play if player_type == 'Scorer'
    update_stat @scoring_player, 'assists' if player_type == 'Assist'
  end

  def update_offensive_stats(scoring_play)
    update_stat @scoring_player, 'goals'
    update_stat @scoring_player, 'gwg' if scoring_play['result']['gameWinningGoal']
    update_shg_and_otg scoring_play
  end

  def update_shg_and_otg(scoring_play)
    update_stat @scoring_player, 'shg' if scoring_play['result']['strength']['code'] == 'SHG'
    update_stat @scoring_player, 'otg' if scoring_play['about']['period'] > 3
  end

  def parse_goalie_stats(game, teams)
    home_team, home_score = find_team_and_score teams, 'home', game
    away_team, away_score = find_team_and_score teams, 'away', game
    if home_score > away_score
      update_winning_goalie home_team, away_score, game
      update_losing_goalie away_team, game
    else
      update_winning_goalie away_team, home_score, game
      update_losing_goalie home_team, game
    end
  end

  def update_winning_goalie(winning_team, opponent_score, game)
    winner = find_player winning_team, game['decisions']['winner']
    return unless winner
    update_stat winner, 'wins'
    update_stat winner, 'shutouts' if opponent_score.zero?
  end

  def update_losing_goalie(losing_team, game)
    loser = find_player losing_team, game['decisions']['loser']
    update_stat loser, 'otl' if loser && game['linescore']['periods'].count > 3
  end

  def find_team_and_score(teams, team_to_find, game)
    game_teams = game['teams']
    team_to_find_details = game_teams[team_to_find]
    score = team_to_find_details['score']
    team_found = teams.find { |team| team['name'] == team_to_find_details['team']['name'] }
    [team_found, score]
  end

  def find_player(team, player_name)
    team['players'].find { |player| player['name'] == player_name['fullName'] }
  end

  def update_stat(player, stat)
    stat = 'finals_' + stat if @is_finals
    player[stat] += 1
  end
end
