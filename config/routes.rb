Rails.application.routes.draw do
  get "validate_token", to: "authentication#validate_token"
  resources :posts
  devise_for :users, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"
  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  },
  defaults: { format: :json }

  get "up" => "rails/health#show", as: :rails_health_check
end
