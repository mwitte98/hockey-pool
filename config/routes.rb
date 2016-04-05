Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  root 'application#angular'
  
  devise_for :users, defaults: { format: 'json' }
  
  get '*path' => 'application#angular'
end
