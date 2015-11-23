defmodule IssueReporter.PageControllerTest do
  use IssueReporter.ConnCase

  test "GET /" do
    conn = get conn(), "/"
    assert html_response(conn, 200) =~ "Yo reporto"
  end
end
