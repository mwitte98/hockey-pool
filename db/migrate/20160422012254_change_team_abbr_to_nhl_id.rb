class ChangeTeamAbbrToNhlId < ActiveRecord::Migration
  def change
    remove_column :teams, :abbr
    add_column :teams, :nhlID, :integer
  end
end
