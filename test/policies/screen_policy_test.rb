require "test_helper"

class ScreenPolicyTest < ActiveSupport::TestCase
  setup do
    @group_admin_user = users(:admin)
    @group_regular_user = users(:regular)
    @non_group_user = users(:non_member)
    @screen = screens(:one)
  end

  test "group admin has full control of screen" do
    assert ScreenPolicy.new(@group_admin_user, @screen).create?
    assert ScreenPolicy.new(@group_admin_user, @screen).edit?
    assert ScreenPolicy.new(@group_admin_user, @screen).destroy?
  end

  test "regular group member can only edit screen" do
    refute ScreenPolicy.new(@group_regular_user, @screen).create?
    assert ScreenPolicy.new(@group_regular_user, @screen).edit?
    refute ScreenPolicy.new(@group_regular_user, @screen).destroy?
  end

  test "non-group member has no permissions on screen" do
    refute ScreenPolicy.new(@non_group_user, @screen).create?
    refute ScreenPolicy.new(@non_group_user, @screen).edit?
    refute ScreenPolicy.new(@non_group_user, @screen).destroy?
  end
end
