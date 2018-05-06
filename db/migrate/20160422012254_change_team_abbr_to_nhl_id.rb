class ChangeTeamAbbrToNhlId < ActiveRecord::Migration[4.2]
  def change
    remove_column :teams, :abbr
    add_column :teams, :nhlID, :integer
  end
end
