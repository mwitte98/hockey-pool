class Team
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  has_many :players

  # filter on made_playoffs with is_eliminated/conference/rank sort
  # filter on made_playoffs with conference/rank sort

  index({ made_playoffs: 1, is_eliminated: 1, conference: 1, rank: 1 })

  def as_json(options = {})
    team = super(options.merge(except: %i[created_at updated_at]))
    IdHelper.to_s team
    team['players']&.each do |player|
      PlayerHelper.set_points player, options[:setting]
      IdHelper.to_s player
    end
    team
  end
end
