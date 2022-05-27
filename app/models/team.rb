class Team < ApplicationRecord
  has_many :players, -> { order 'last_name, first_name' }

  def as_json(options = {})
    team = super(options.merge(except: %i[created_at updated_at]))
    team['players']&.each { |player| PlayerHelper.set_points player, options[:setting] }
    team
  end
end
