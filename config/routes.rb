Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  root 'application#angular'
  
  resources :teams, defaults: { format: 'json' }, only: [:index, :create, :show, :update, :destroy] do
    resources :players, shallow: true, only: [:index, :create, :show, :update, :destroy]
  end
  
  resources :entries, defaults: { format: 'json' }, only: [:index, :create, :show, :update, :destroy]
  
  devise_for :users, defaults: { format: 'json' }
  
  match '/update_player_stats', to: 'entries#update_player_stats', via: 'get', defaults: { format: 'json' }
  
  get '*path' => 'application#angular'
end
