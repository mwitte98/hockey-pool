class Entry < ApplicationRecord
  has_and_belongs_to_many :players, -> { order 'id ASC' }

  def as_json(options = {})
    super(options.merge(include: [players: { include: :team }]))
  end
end
