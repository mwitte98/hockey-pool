class AddAttributesToTeams < ActiveRecord::Migration[6.0]
  def change
    add_column :teams, :nhl_id, :integer
    add_column :teams, :rank, :integer
    add_column :teams, :conference, :string
    add_column :teams, :made_playoffs, :boolean
  end
end
