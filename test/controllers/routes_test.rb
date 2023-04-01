require 'test_helper'

class RoutesTest < ActionController::TestCase
  should route(:get, '/').to('static#base')

  should route(:post, '/api/auth/login').to('auth#login')
  should route(:delete, '/api/auth/logout').to('auth#logout')
  should route(:get, '/api/auth/signed_in').to('auth#signed_in')

  should route(:post, '/api/user').to('users#create')

  should route(:get, '/api/players').to('players#index')
  should route(:put, '/api/players/1').to('players#update', id: 1)
  should route(:get, '/api/teams').to('teams#index')
  should route(:put, '/api/teams/1').to('teams#update', id: 1)
  should route(:get, '/api/entries').to('entries#index')
  should route(:post, '/api/entries').to('entries#create')
  should route(:put, '/api/entries/1').to('entries#update', id: 1)

  should route(:get, '/api/settings').to('settings#index')
  should route(:put, '/api/settings/1').to('settings#update', id: 1)

  should route(:get, '/api/update_player_stats').to('entries#update_player_stats')

  should route(:get, '/a').to('static#base', path: 'a')
end
