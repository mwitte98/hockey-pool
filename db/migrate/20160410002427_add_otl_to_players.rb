class AddOtlToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :otl, :integer
  end
end
