require "test_helper"

class Frontend::ContentControllerPinnedTest < ActionDispatch::IntegrationTest
  setup do
    @screen = screens(:one)
    @field = fields(:main)
    @position = positions(:one)

    # Cleanup existing data to avoid fixture interference
    Subscription.where(screen: @screen, field: @field).destroy_all
    FieldConfig.where(screen: @screen, field: @field).destroy_all

    # Setup common subscription content
    @feed = Feed.create!(name: "Test Feed", group: groups(:feed_one_owners))
    @active_subscription_content = RichText.create!(
      name: "Subscription Content",
      text: "Subscription Content " * 20,
      user: users(:admin),
      duration: 10,
      config: { render_as: "plaintext" }
    )
    Submission.create!(content: @active_subscription_content, feed: @feed)
    Subscription.create!(screen: @screen, field: @field, feed: @feed)
  end

  test "should prefer active pinned content over subscriptions" do
    # Create active pinned content
    active_pinned_content = RichText.create!(
      name: "Pinned Content",
      text: "Pinned Content " * 20,
      user: users(:admin),
      duration: 10,
      config: { render_as: "plaintext" }
    )
    # Create FieldConfig
    FieldConfig.create!(screen: @screen, field: @field, pinned_content: active_pinned_content)

    get frontend_content_url(screen_id: @screen.id, field_id: @field.id, position_id: @position.id)
    assert_response :success

    data = response.parsed_body
    # Should only contain pinned content
    assert_equal 1, data.length
    assert_equal active_pinned_content.id, data.first["id"]
  end

  test "should fallback to subscriptions if pinned content is expired" do
    # Create expired pinned content
    expired_pinned_content = RichText.create!(
      name: "Expired Pinned Content",
      text: "Expired Pinned Content " * 20,
      user: users(:admin),
      duration: 10,
      end_time: 1.day.ago,
      config: { render_as: "plaintext" }
    )

    FieldConfig.create!(screen: @screen, field: @field, pinned_content: expired_pinned_content)

    get frontend_content_url(screen_id: @screen.id, field_id: @field.id, position_id: @position.id)
    assert_response :success

    data = response.parsed_body
    # Should contain subscription content
    assert data.any? { |c| c["id"] == @active_subscription_content.id }
    # Should NOT contain pinned content (it's expired)
    assert_not data.any? { |c| c["id"] == expired_pinned_content.id }
  end
end
