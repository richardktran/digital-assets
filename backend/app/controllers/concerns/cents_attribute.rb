# app/models/concerns/cents_attribute.rb
module CentsAttribute
  extend ActiveSupport::Concern

  class_methods do
    def cents_accessor(*fields)
      fields.each do |field|
        define_method(field) do
          value = self[field]
          value ? value.to_f / 100 : nil
        end

        define_method("#{field}=") do |val|
          self[field] = (val.to_f * 100).round if val
        end
      end
    end
  end
end
