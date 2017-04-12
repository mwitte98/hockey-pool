class RemoveNhlIds < ActiveRecord::Migration[5.0]
  def change
    remove_column :players, :nhlID
    remove_column :teams, :nhlID
    add_column :teams, :abbr, :string
  end
end
