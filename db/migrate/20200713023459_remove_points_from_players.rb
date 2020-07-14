class RemovePointsFromPlayers < ActiveRecord::Migration[6.0]
  def change
    remove_column :players, :points
  end
end
