class Team < ApplicationRecord
  has_many :players, -> { order 'last_name, first_name' }

  def as_json(options = {})
    super(options.merge(except: %i[created_at updated_at]))
  end
end
