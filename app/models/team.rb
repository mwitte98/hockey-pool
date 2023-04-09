class Team
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  has_many :players

  index({ made_playoffs: 1, is_eliminated: 1, conference: 1, rank: 1 })

  def as_json(options = {})
    team = super(options.merge(except: %i[created_at updated_at]))
    IdHelper.to_s team
    team['players']&.each do |player|
      PlayerHelper.set_points player, options[:setting] if options[:set_player_points] != false
      IdHelper.to_s player
    end
    team
  end
end
