require "application_system_test_case"

class UsersTest < ApplicationSystemTestCase
  setup do
    @user = users(:regular)
    @other_user = users(:admin)
    @system_admin = users(:system_admin)
  end

  test "viewing own profile shows all sections" do
    sign_in @user
    visit user_url(@user)

    assert_selector "h1", text: @user.display_name
    assert_text @user.email
    assert_selector "h3", text: "Group Memberships"
    assert_selector "h3", text: "Uploaded Content"
    assert_link "Edit Profile"
    assert_button "Delete Account"
  end

  test "viewing own profile shows group memberships" do
    sign_in @user
    visit user_url(@user)

    @user.memberships.each do |membership|
      assert_text membership.group.name
      assert_text membership.role.humanize
    end
  end

  test "editing profile successfully" do
    sign_in @user
    visit user_url(@user)
    click_on "Edit Profile"

    assert_selector "h2", text: "Profile Information"

    fill_in "First Name", with: "NewFirst"
    fill_in "Last Name", with: "NewLast"
    fill_in "Email", with: "newemail@example.com"
    click_on "Save Profile"

    assert_text "Profile was successfully updated"
    assert_selector "h1", text: "NewFirst NewLast"
    assert_text "newemail@example.com"
  end

  test "canceling profile edit returns to profile" do
    sign_in @user
    visit edit_user_url(@user)

    click_on "Cancel"

    assert_current_path user_path(@user)
  end

  test "deleting account with confirmation" do
    sign_in @user
    visit user_url(@user)

    accept_confirm do
      click_on "Delete Account"
    end

    assert_text "Account was successfully deleted"
    assert_current_path root_path
  end

  test "can access other user's profile" do
    sign_in @user
    visit user_url(@other_user)

    assert_selector "h1", text: @other_user.display_name
    assert_text @other_user.email
  end

  test "system admin can view any user profile" do
    sign_in @system_admin
    visit user_url(@user)

    assert_selector "h1", text: @user.display_name
    assert_text @user.email
    assert_link "Edit Profile"
  end

  test "system admin can edit any user" do
    sign_in @system_admin
    visit user_url(@user)
    click_on "Edit Profile"

    fill_in "First Name", with: "AdminChanged"
    check "System Administrator"
    click_on "Save Profile"

    assert_text "Profile was successfully updated"
    @user.reload
    assert @user.is_system_user
  end

  test "regular user cannot set system admin on themselves" do
    sign_in @user
    visit edit_user_url(@user)

    # System admin checkbox should not be visible for regular users
    assert_no_field "System Administrator"
  end

  test "profile shows empty state when no content" do
    user_without_content = User.create!(
      first_name: "No",
      last_name: "Content",
      email: "nocontent@example.com",
      password: "password"
    )
    sign_in user_without_content
    visit user_url(user_without_content)

    assert_selector "h3", text: "No content yet"
    assert_text "This user has not uploaded any content"
  end

  test "profile displays group memberships table" do
    sign_in @user
    visit user_url(@user)

    # Check that the table is present (users are automatically added to All Users group)
    assert_selector "h3", text: "Group Memberships"
    assert_selector "table"
  end
end
