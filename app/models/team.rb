class Team < ApplicationRecord
  has_many :players

  def as_json(options = {})
    super(options.merge(include: :players))
  end
end
