class Player < ApplicationRecord
  belongs_to :team
  has_and_belongs_to_many :entries

  def as_json(options = {})
    except_array = if team.is_eliminated
                     %i[finals_goals finals_assists finals_gwg finals_shg finals_otg
                        finals_wins finals_otl finals_shutouts created_at updated_at]
                   else
                     %i[created_at updated_at]
                   end
    super(options.merge(except: except_array))
  end
end
