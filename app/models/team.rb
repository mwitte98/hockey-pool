class Team < ActiveRecord::Base
  has_many :players, -> { order "id ASC" }
  
  def as_json(options = {})
    super(options.merge(include: :players))
  end
end
