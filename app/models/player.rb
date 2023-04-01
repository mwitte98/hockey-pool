class Player < ApplicationRecord
  belongs_to :team
  has_and_belongs_to_many :entries

  def as_json(options = {})
    player = super(options.merge(except: %i[created_at updated_at]))
    PlayerHelper.set_points player, options[:setting]
    player
  end
end
