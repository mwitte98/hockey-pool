Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static#base'

  scope '/api' do
    scope '/auth' do
      match '/login' => 'auth#login', via: [:post]
      match '/logout' => 'auth#logout', via: [:post]
      match '/signed_in' => 'auth#signed_in', via: [:get]
    end

    match '/user' => 'users#create', via: [:post]

    resources :teams, only: [:index, :create, :show, :update, :destroy] do
      resources :players, shallow: true, only: [:index, :create, :show, :update, :destroy]
    end

    resources :entries, only: [:index, :create, :show, :update, :destroy]

    match '/update_player_stats', to: 'entries#update_player_stats', via: 'get'
  end

  get '*path' => 'static#base'
end
