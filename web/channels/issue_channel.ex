defmodule IssueReporter.IssueChannel do
  use IssueReporter.Web, :channel
  alias IssueReporter.Issue
  require Logger

  def join("issues:home", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("new_issue", %{"issue" => issue}, socket) do
    changeset = Issue.changeset(%Issue{}, issue)
    case Repo.insert(changeset) do
      {:ok, _issue} ->
        # TODO: make render with View function
        issue = Map.put(issue, "id", _issue.id)
        Logger.info "inserted"
        broadcast! socket, "new_issue", %{issue: issue}
      {:error, changeset} ->
        Logger.error(changeset)
    end
    {:noreply, socket}
  end

  def handle_out("new_issue", payload, socket) do
    push socket, "new_issue", payload
    {:noreply, socket}
  end
end
