class FieldConfig < ApplicationRecord
  belongs_to :screen
  belongs_to :field
  belongs_to :pinned_content, class_name: "Content", optional: true

  validates :screen_id, uniqueness: { scope: :field_id, message: "already has a config for this field" }
end
