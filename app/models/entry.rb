class Entry < ApplicationRecord
  has_and_belongs_to_many :players, -> { order 'team_id' }

  def as_json(options = {})
    super(options.merge(
      include: [
        { players: {
          include: [team: { except: %i[created_at updated_at] }],
          except: %i[team_id created_at updated_at]
        } }
      ],
      except: %i[created_at updated_at]
    ))
  end
end
