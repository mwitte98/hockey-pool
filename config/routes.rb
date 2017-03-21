Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static#base'

  resources :teams, only: [:index, :create, :show, :update, :destroy] do
    resources :players, shallow: true, only: [:index, :create, :show, :update, :destroy]
  end

  resources :entries, only: [:index, :create, :show, :update, :destroy]

  devise_for :users, defaults: { format: 'json' }

  match '/update_player_stats', to: 'entries#update_player_stats', via: 'get'

  get '*path' => 'static#base'
end
