defmodule IssueReporter.Plugs.Locale do
  import Plug.Conn
  import IssueReporter.Gettext

  def init(opts), do: opts

  def call(conn, _opts) do
    Gettext.put_locale IssueReporter.Gettext, get_code(conn)
    conn
  end

  defp get_code(conn) do
    case get_session(conn, :lang_code) do
      code when is_binary(code) ->
        code
      _ ->
        config = Mix.Config.read!("config/config.exs")
        code = config[:issue_reporter][IssueReporter.Gettext][:default_locale]
        put_session(conn, :lang_code, code)
        code
    end
  end
end
