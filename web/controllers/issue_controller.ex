defmodule IssueReporter.IssueController do
  use IssueReporter.Web, :controller

  alias IssueReporter.Issue

  def index(conn, _params) do
    issues = Repo.all(Issue)
    render(conn, "index.json", issues: issues)
  end
end
