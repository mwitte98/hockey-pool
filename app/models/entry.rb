class Entry
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  has_and_belongs_to_many :players, inverse_of: nil

  index({ player_ids: 1 })

  def as_json(options = {})
    entry = super(options.merge(except: %i[created_at updated_at]))
    IdHelper.to_s entry
    entry['player_ids'] = player_ids.map(&:to_s)
    entry
  end
end
