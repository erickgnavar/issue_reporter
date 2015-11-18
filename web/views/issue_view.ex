defmodule IssueReporter.IssueView do
  use IssueReporter.Web, :view

  def render("index.json", %{issues: issues}) do
    %{data: render_many(issues, IssueReporter.IssueView, "issue.json")}
  end

  def render("show.json", %{issue: issue}) do
    %{data: render_one(issue, IssueReporter.IssueView, "issue.json")}
  end

  def render("issue.json", %{issue: issue}) do
    %{
      id: issue.id,
      type: issue.type,
      latitude: issue.latitude,
      longitude: issue.longitude,
      fixed: issue.fixed,
      message: issue.message
    }
  end
end
