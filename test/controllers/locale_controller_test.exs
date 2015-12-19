defmodule IssueReporter.LocaleControllerTest do
  use IssueReporter.ConnCase

  test "setup language code" do
    conn = get conn, locale_path(conn, :set_lang, "es")
    assert get_session(conn, :lang_code) == "es"
  end
end
