class RoundMultiplier < ActiveRecord::Migration[7.0]
  def change
    remove_column :settings, :points_finals_goals
    remove_column :settings, :points_finals_assists
    remove_column :settings, :points_finals_gwg
    remove_column :settings, :points_finals_shg
    remove_column :settings, :points_finals_otg
    remove_column :settings, :points_finals_wins
    remove_column :settings, :points_finals_otl
    remove_column :settings, :points_finals_shutouts
    add_column :settings, :round_multipliers, :json
  end
end
