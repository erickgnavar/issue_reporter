defmodule IssueReporter.Router do
  use IssueReporter.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug IssueReporter.Plugs.Locale
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", IssueReporter do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/set-lang/:lang_code/", LocaleController, :set_lang
  end

  # Other scopes may use custom stacks.
  scope "/api", IssueReporter do
    pipe_through :api

    get "/issues/", IssueController, :index
    post "/issues/", IssueController, :create
    get "/issues/:id/", IssueController, :show
    put "/issues/:id/", IssueController, :update
    delete "/issues/:id/", IssueController, :delete
  end
end
