defmodule IssueReporter.PageController do
  use IssueReporter.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
