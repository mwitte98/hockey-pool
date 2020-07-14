class Player < ApplicationRecord
  belongs_to :team
  has_and_belongs_to_many :entries

  def as_json(options = {})
    except_array = %i[created_at updated_at]
    player = super(options.merge(except: except_array))
    player['points'] = PlayerHelper.calculate_points self, options[:setting]
    player
  end
end
