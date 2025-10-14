class Subscription < ApplicationRecord
  belongs_to :screen
  belongs_to :field
  belongs_to :feed

  validates :screen, :field, :feed, presence: true
  validates :feed_id, uniqueness: { scope: [ :screen_id, :field_id ], message: "is already subscribed to this field on this screen" }

  def contents
    self.feed.content
  end

  # Scope to find subscriptions for a specific screen and field
  scope :for_screen_and_field, ->(screen_id, field_id) { where(screen_id: screen_id, field_id: field_id) }

  # Class method to get available feeds for a field on a screen
  def self.available_feeds_for_field(screen_id, field_id)
    subscribed_feed_ids = for_screen_and_field(screen_id, field_id).pluck(:feed_id)
    if subscribed_feed_ids.any?
      Feed.where.not(id: subscribed_feed_ids)
    else
      Feed.all
    end
  end
end
