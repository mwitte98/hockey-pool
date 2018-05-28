class AddFinalsColumnsToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :finals_goals, :integer, default: 0
    add_column :players, :finals_assists, :integer, default: 0
    add_column :players, :finals_gwg, :integer, default: 0
    add_column :players, :finals_shg, :integer, default: 0
    add_column :players, :finals_otg, :integer, default: 0
    add_column :players, :finals_wins, :integer, default: 0
    add_column :players, :finals_otl, :integer, default: 0
    add_column :players, :finals_shutouts, :integer, default: 0
  end
end
