class UpdatePlayerStats < ActiveRecord::Migration[7.0]
  def change
    remove_column :players, :goals
    remove_column :players, :assists
    remove_column :players, :gwg
    remove_column :players, :shg
    remove_column :players, :wins
    remove_column :players, :shutouts
    remove_column :players, :otl
    remove_column :players, :otg
    remove_column :players, :finals_goals
    remove_column :players, :finals_assists
    remove_column :players, :finals_gwg
    remove_column :players, :finals_shg
    remove_column :players, :finals_wins
    remove_column :players, :finals_shutouts
    remove_column :players, :finals_otl
    remove_column :players, :finals_otg
    add_column :players, :stats, :json
  end
end
