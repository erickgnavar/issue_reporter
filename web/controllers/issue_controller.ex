defmodule IssueReporter.IssueController do
  use IssueReporter.Web, :controller

  plug :scrub_params, "issue" when action in [:create, :update]

  alias IssueReporter.Issue

  def index(conn, params) do
    issues = Issue
    # TODO: find a better way to make this query
    case params["fixed"] do
      "true" ->
        issues = issues |> Issue.fixed
      "false" ->
        issues = issues |> Issue.unfixed
      _ -> nil
    end
    issues = issues |> Repo.all
    render(conn, "index.json", issues: issues)
  end

  def create(conn, %{"issue" => issue_params}) do
    changeset = Issue.changeset(%Issue{}, issue_params)

    case Repo.insert(changeset) do
      {:ok, issue} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", issue_path(conn, :show, issue))
        |> render("show.json", issue: issue)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(IssueReporter.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    issue = Repo.get!(Issue, id)
    render(conn, "show.json", issue: issue)
  end

  def update(conn, %{"id" => id, "issue" => issue_params}) do
    issue = Repo.get!(Issue, id)
    changeset = Issue.changeset(issue, issue_params)

    case Repo.update(changeset) do
      {:ok, issue} ->
        render(conn, "show.json", issue: issue)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(IssueReporter.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    issue = Repo.get!(Issue, id)
    Repo.delete!(issue)
    send_resp(conn, :no_content, "")
  end
end
