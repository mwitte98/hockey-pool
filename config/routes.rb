Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'static#base'

  scope '/api' do
    scope '/auth' do
      match '/login' => 'auth#login', via: [:post]
      match '/logout' => 'auth#logout', via: [:delete]
      match '/signed_in' => 'auth#signed_in', via: [:get]
    end

    match '/user' => 'users#create', via: [:post]

    resources :teams, only: %i[index update]

    resources :players, only: %i[index update]

    resources :entries, only: %i[index create update]

    resources :settings, only: %i[index update]

    match '/bulk/teams', to: 'teams#bulk_create', via: 'post'

    match '/bulk/teams', to: 'teams#bulk_update', via: 'put'
  end

  get '*path' => 'static#base'
end
