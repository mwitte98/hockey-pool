class AddOtlToPlayers < ActiveRecord::Migration[4.2]
  def change
    add_column :players, :otl, :integer
  end
end
