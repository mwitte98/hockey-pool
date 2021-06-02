class UpdateJob
  include SuckerPunch::Job

  def initialize
    @teams = nil
    @game = nil
    @is_finals = false
    @scoring_player = nil
  end

  def perform
    @teams = UpdateJobHelper.setup_teams
    agent = Mechanize.new
    response = JSON.parse(agent.get('https://statsapi.web.nhl.com/api/v1/schedule?gameType=P&startDate=2021-05-01&endDate=2021-08-01&hydrate=linescore,scoringplays,decisions,game(seriesSummary)').body)
    response['dates'].each { |date| parse_date date }
    UpdateJobHelper.update_players @teams
  end

  private

  def parse_date(date)
    date['games'].each do |game|
      @game = game
      is_finals = @game['gamePk'].digits[2] == 4
      parse_game false
      @game = game
      parse_game true if is_finals
    end
  end

  def parse_game(is_finals)
    @is_finals = is_finals
    is_game_final = @game['status']['detailedState'] == 'Final'
    parse_scoring_plays
    return unless is_game_final

    game_teams, score_attr = check_goalie_date
    parse_goalie_stats game_teams, score_attr
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
      update_player_stats player, scoring_play if @scoring_player
    end
  end

  def update_player_stats(player, scoring_play)
    player_type = player['playerType']
    update_offensive_stats scoring_play if player_type == 'Scorer'
    update_stat @scoring_player, 'assists' if player_type == 'Assist'
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
    team_found = find_team team
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

  def find_team(team_to_find_details)
    @teams.find { |team| team['name'] == team_to_find_details['team']['name'] }
  end

  def find_player(team, player_name)
    team['players'].find { |player| player['name'] == player_name['fullName'] }
  end

  def update_stat(player, stat)
    stat = "finals_#{stat}" if @is_finals
    player[stat] += 1
  end
end
