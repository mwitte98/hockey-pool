class Setting
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  def as_json(options = {})
    setting = super(options.merge(except: %i[created_at updated_at]))
    IdHelper.to_s setting
    setting
  end
end
