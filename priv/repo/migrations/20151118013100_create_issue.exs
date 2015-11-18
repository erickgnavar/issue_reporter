defmodule IssueReporter.Repo.Migrations.CreateIssue do
  use Ecto.Migration

  def change do
    create table(:issues) do
      add :type, :string
      add :latitude, :float
      add :longitude, :float
      add :fixed, :boolean, default: false
      add :message, :text

      timestamps
    end

  end
end
