class AddIsEliminatedToTeams < ActiveRecord::Migration[5.1]
  def change
    add_column :teams, :is_eliminated, :boolean, default: false
  end
end
