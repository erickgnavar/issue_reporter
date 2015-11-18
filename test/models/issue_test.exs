defmodule IssueReporter.IssueTest do
  use IssueReporter.ModelCase

  alias IssueReporter.Issue

  @valid_attrs %{fixed: true, latitude: "120.5", longitude: "120.5", type: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Issue.changeset(%Issue{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Issue.changeset(%Issue{}, @invalid_attrs)
    refute changeset.valid?
  end
end
