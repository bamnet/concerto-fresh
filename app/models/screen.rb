class Screen < ApplicationRecord
  belongs_to :template
  belongs_to :group

  has_many :subscriptions, dependent: :destroy
  has_many :field_configs, dependent: :destroy

  accepts_nested_attributes_for :field_configs, allow_destroy: true, reject_if: :all_blank

  validates :name, presence: true
end
