# frozen_string_literal: true

require "test_helper"

class ContentOrderers::WeightedTest < ActiveSupport::TestCase
  test "duplicates content based on weight" do
    content1 = rich_texts(:html_richtext)
    content2 = graphics(:two)
    content3 = rich_texts(:active_ticker_text)

    # Create subscriptions with different weights
    sub_high = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:one),
      weight: 8
    )
    sub_low = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:two),
      weight: 2
    )
    sub_medium = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:one),
      weight: 4
    )

    items = [
      { content: content1, subscription: sub_high },
      { content: content2, subscription: sub_low },
      { content: content3, subscription: sub_medium }
    ]

    orderer = ContentOrderers::Weighted.new
    result = orderer.call(items)

    # All content should be present
    assert_includes result.map(&:id), content1.id
    assert_includes result.map(&:id), content2.id
    assert_includes result.map(&:id), content3.id

    # Higher weighted content should appear more frequently in the list
    # With weights 8, 4, 2, we expect content1 to appear most often
    content1_count = result.count { |c| c.id == content1.id }
    content2_count = result.count { |c| c.id == content2.id }
    content3_count = result.count { |c| c.id == content3.id }

    # Verify ordering: content1 (weight 8) >= content3 (weight 4) >= content2 (weight 2)
    assert content1_count >= content3_count, "Expected content1 (weight 8) to appear at least as often as content3 (weight 4)"
    assert content3_count >= content2_count, "Expected content3 (weight 4) to appear at least as often as content2 (weight 2)"
  end

  test "removes consecutive duplicates" do
    content = rich_texts(:html_richtext)
    subscription = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:one),
      weight: 5
    )

    items = [ { content: content, subscription: subscription } ]

    orderer = ContentOrderers::Weighted.new
    result = orderer.call(items)

    # Should only have one instance despite weight of 5
    assert_equal 1, result.length
    assert_equal content, result.first
  end

  test "handles empty array" do
    orderer = ContentOrderers::Weighted.new
    result = orderer.call([])

    assert_equal [], result
  end

  test "returns only content objects not hashes" do
    content = rich_texts(:html_richtext)
    subscription = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:one),
      weight: 3
    )

    items = [ { content: content, subscription: subscription } ]

    orderer = ContentOrderers::Weighted.new
    result = orderer.call(items)

    result.each do |item|
      assert item.is_a?(Content), "Expected Content instance, got #{item.class}"
    end
  end

  test "weight of 1 returns single instance" do
    content = rich_texts(:html_richtext)
    subscription = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:one),
      weight: 1
    )

    items = [ { content: content, subscription: subscription } ]

    orderer = ContentOrderers::Weighted.new
    result = orderer.call(items)

    assert_equal 1, result.length
  end

  test "multiple content items with different weights" do
    content1 = rich_texts(:html_richtext)
    content2 = graphics(:one)
    content3 = videos(:video_youtube)

    sub1 = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:one),
      weight: 5
    )
    sub2 = Subscription.new(
      screen: screens(:one),
      field: fields(:main),
      feed: feeds(:two),
      weight: 3
    )
    sub3 = Subscription.new(
      screen: screens(:one),
      field: fields(:sidebar),
      feed: feeds(:one),
      weight: 2
    )

    items = [
      { content: content1, subscription: sub1 },
      { content: content2, subscription: sub2 },
      { content: content3, subscription: sub3 }
    ]

    orderer = ContentOrderers::Weighted.new
    result = orderer.call(items)

    # All three should be present
    assert_includes result.map(&:id), content1.id
    assert_includes result.map(&:id), content2.id
    assert_includes result.map(&:id), content3.id
  end
end
