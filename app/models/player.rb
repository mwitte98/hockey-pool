class Player
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  belongs_to :team
  has_and_belongs_to_many :entries

  index({ team_id: 1 })

  def as_json(options = {})
    player = super(options.merge(except: %i[entry_ids created_at updated_at]))
    IdHelper.to_s player
    PlayerHelper.set_points player, options[:setting]
    player
  end
end
