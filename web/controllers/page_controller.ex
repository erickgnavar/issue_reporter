defmodule IssueReporter.PageController do
  use IssueReporter.Web, :controller

  def index(conn, _params) do
    issue_types = [
      %{key: "broken semaphore", value: "Broken Semaphore"},
      %{key: "broken lamp post", value: "Broken Lamp post"},
    ]
    render conn, "index.html",  issue_types: issue_types
  end
end
