class CreateSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :settings do |t|
      t.boolean :is_playoffs_started

      t.integer :min_centers
      t.integer :max_centers
      t.integer :min_wingers
      t.integer :max_wingers
      t.integer :min_defensemen
      t.integer :max_defensemen
      t.integer :min_goalies
      t.integer :max_goalies

      t.integer :points_goals
      t.integer :points_assists
      t.integer :points_gwg
      t.integer :points_shg
      t.integer :points_otg
      t.integer :points_wins
      t.integer :points_otl
      t.integer :points_shutouts
      t.integer :points_finals_goals
      t.integer :points_finals_assists
      t.integer :points_finals_gwg
      t.integer :points_finals_shg
      t.integer :points_finals_otg
      t.integer :points_finals_wins
      t.integer :points_finals_otl
      t.integer :points_finals_shutouts

      t.timestamps null: false
    end
  end
end
