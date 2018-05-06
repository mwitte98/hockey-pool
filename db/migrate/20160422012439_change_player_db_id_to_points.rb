class ChangePlayerDbIdToPoints < ActiveRecord::Migration[4.2]
  def change
    remove_column :players, :hockeydbID
    add_column :players, :points, :integer
  end
end
