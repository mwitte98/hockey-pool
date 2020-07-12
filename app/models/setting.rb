class Setting < ApplicationRecord
  def as_json(options = {})
    except_array = %i[created_at updated_at]
    super(options.merge(except: except_array))
  end
end
