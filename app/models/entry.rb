class Entry < ActiveRecord::Base
  has_and_belongs_to_many :players
  
  def as_json(options = {})
    super(options.merge(include: [comments: {include: :team}]))
  end
end
