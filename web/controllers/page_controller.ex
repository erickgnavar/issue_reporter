defmodule IssueReporter.PageController do
  use IssueReporter.Web, :controller

  def index(conn, _params) do
    issue_types = [
      %{key: "broken semaphore", value: gettext("Broken semaphore")},
      %{key: "broken lamp post", value: gettext("Broken lamp post")},
    ]
    render conn, "index.html",  issue_types: issue_types
  end
end
