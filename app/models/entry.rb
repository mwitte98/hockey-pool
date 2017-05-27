class Entry < ApplicationRecord
  has_and_belongs_to_many :players

  def as_json(options = {})
    super(options.merge(include: [players: { include: :team }]))
  end
end
