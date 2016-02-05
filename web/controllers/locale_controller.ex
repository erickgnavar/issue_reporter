defmodule IssueReporter.LocaleController do
  use IssueReporter.Web, :controller

  def set_lang(conn, %{"lang_code" => lang_code}) do
    conn = put_session(conn, :lang_code, lang_code)
    redirect conn, to: get_url(conn)
  end

  defp get_url(conn) do
    case get_req_header(conn, "referer") do
      [referer] when is_binary(referer) ->
        [host] = get_req_header(conn, "host")
        referer |> String.replace("#{conn.scheme}://#{host}", "")
      _ ->
        "/"
    end
  end
end
