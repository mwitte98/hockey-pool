class EntryToPlayer < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.belongs_to :team, index: true
      t.string :first_name
      t.string :last_name
      t.string :position
      t.integer :goals
      t.integer :assists
      t.integer :gwg
      t.integer :shg
      t.integer :wins
      t.integer :shutouts
      t.integer :nhlID
      t.integer :hockeydbID

      t.timestamps null: false
    end
    
    create_table :entries do |t|
      t.string :name

      t.timestamps null: false
    end
    
    create_table :entries_players, id: false do |t|
      t.belongs_to :entry, index: true
      t.belongs_to :player, index: true
    end
  end
end
