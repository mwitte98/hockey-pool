class Team < ApplicationRecord
  has_many :players, -> { order 'last_name, first_name' }

  def as_json(options = {})
    super(options.merge(include: :players))
  end
end
