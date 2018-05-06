class Entry < ApplicationRecord
  has_and_belongs_to_many :players

  def as_json(options = {})
    entry = super(options.merge(
      except: %i[created_at updated_at]
    ))
    entry['player_ids'] = player_ids
    entry
  end
end
