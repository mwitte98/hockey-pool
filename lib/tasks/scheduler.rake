desc 'This task is called by the Heroku scheduler add-on'
task update_information: :environment do
  puts 'Updating info...'
  UpdateJob.new.perform
  puts 'done.'
end

task seed_teams_players: :environment do
  puts 'Updating teams and players...'
  SeedTeamsPlayersJob.new.perform
  puts 'done.'
end
