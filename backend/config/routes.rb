Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      post "auth", to: "auth#login"

      resources :assets, only: %i[index show update destroy] do
        collection do
          post :import
          get "jobs/:id", to: "import_jobs#show"
        end
      end

      namespace :admin do
        resources :statistics, only: [] do
          collection do
            get "creators_earning", to: "statistics#creators_earning"
          end
        end
      end

      resources :orders, only: %i[index create show]
    end
  end
end
