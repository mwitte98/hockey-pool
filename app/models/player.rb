class Player < ApplicationRecord
  belongs_to :team
  has_and_belongs_to_many :entries

  def as_json(options = {})
    except_array = %i[created_at updated_at]
    super(options.merge(except: except_array))
  end
end
