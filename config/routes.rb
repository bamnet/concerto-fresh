Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks"
  }
  namespace :frontend do
    resources :screens, only: [ :show ]
    get "/screens/:screen_id/fields/:field_id/content/", to: "content#index", as: "content"

    # The main landing page for the frontend player.
    get "/:id", to: "player#show", as: "player"
  end
  resources :screens do
    resources :subscriptions, only: [ :index, :create, :destroy ]
  end
  resources :templates
  resources :submissions
  resources :rss_feeds do
    get "refresh", on: :member
  end
  resources :feeds
  resources :contents, only: [ :index, :new ]

  resources :rich_texts, except: [ :index ]
  resources :graphics, except: [ :index ]
  resources :videos, except: [ :index ]

  # Admin routes
  get "/admin/settings", to: "admin#settings"
  patch "/admin/settings", to: "admin#update_settings"

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
