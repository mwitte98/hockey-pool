class AddOtgToPlayers < ActiveRecord::Migration[5.0]
  def change
    add_column :players, :otg, :integer
  end
end
