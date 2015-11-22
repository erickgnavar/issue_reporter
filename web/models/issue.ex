defmodule IssueReporter.Issue do
  use IssueReporter.Web, :model

  schema "issues" do
    field :type, :string
    field :latitude, :float
    field :longitude, :float
    field :fixed, :boolean, default: false
    field :message, :string

    timestamps
  end

  @required_fields ~w(type latitude longitude fixed)
  @optional_fields ~w(message)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def unfixed(query) do
    from i in query,
    where: i.fixed == false
  end

  def fixed(query) do
    from i in query,
    where: i.fixed == true
  end
end
