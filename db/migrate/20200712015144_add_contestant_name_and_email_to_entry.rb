class AddContestantNameAndEmailToEntry < ActiveRecord::Migration[6.0]
  def change
    add_column :entries, :contestant_name, :string
    add_column :entries, :email, :string
  end
end
