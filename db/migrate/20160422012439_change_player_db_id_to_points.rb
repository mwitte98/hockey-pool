class ChangePlayerDbIdToPoints < ActiveRecord::Migration
  def change
    remove_column :players, :hockeydbID
    add_column :players, :points, :integer
  end
end
