module IdHelper
  class << IdHelper
    def to_s(object)
      object['id'] = object['_id'] if object['_id']
      object.delete('_id')
    end
  end
end
