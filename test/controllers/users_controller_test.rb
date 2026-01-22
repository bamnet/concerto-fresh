require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:regular)
    @other_user = users(:admin)
    @system_admin = users(:system_admin)
  end

  # Show action authorization tests
  test "users can view any user profile" do
    sign_in @user
    get user_url(@other_user)
    assert_response :success
  end

  test "system admins can view any user profile" do
    sign_in @system_admin
    get user_url(@user)
    assert_response :success
  end

  test "unauthenticated users cannot view user profiles" do
    get user_url(@user)
    assert_redirected_to new_user_session_path
  end

  # Edit action authorization tests
  test "users can edit their own profile" do
    sign_in @user
    get edit_user_url(@user)
    assert_response :success
  end

  test "system admins can edit any user profile" do
    sign_in @system_admin
    get edit_user_url(@user)
    assert_response :success
  end

  test "users cannot edit other user profiles" do
    sign_in @user
    get edit_user_url(@other_user)
    assert_redirected_to root_path
    assert_equal "You are not authorized to perform this action.", flash[:alert]
  end

  # Update action tests
  test "users can update their own profile" do
    sign_in @user
    patch user_url(@user), params: { user: { first_name: "Updated", last_name: "Name" } }
    assert_redirected_to user_url(@user)
    assert_equal "Profile was successfully updated.", flash[:notice]
    @user.reload
    assert_equal "Updated", @user.first_name
    assert_equal "Name", @user.last_name
  end

  test "system admins can update any user profile" do
    sign_in @system_admin
    patch user_url(@user), params: { user: { first_name: "AdminUpdated" } }
    assert_redirected_to user_url(@user)
    assert_equal "Profile was successfully updated.", flash[:notice]
    @user.reload
    assert_equal "AdminUpdated", @user.first_name
  end

  test "regular users cannot set is_system_user on themselves" do
    sign_in @user
    patch user_url(@user), params: { user: { is_system_user: true } }
    @user.reload
    refute @user.is_system_user
  end

  test "system admins can set is_system_user on other users" do
    sign_in @system_admin
    patch user_url(@user), params: { user: { is_system_user: true } }
    @user.reload
    assert @user.is_system_user
  end

  test "users cannot update other user profiles" do
    sign_in @user
    patch user_url(@other_user), params: { user: { first_name: "Hacked" } }
    assert_redirected_to root_path
    assert_equal "You are not authorized to perform this action.", flash[:alert]
  end

  # Destroy action tests
  test "users can destroy their own account" do
    sign_in @user
    assert_difference("User.count", -1) do
      delete user_url(@user)
    end
    assert_redirected_to root_path
    assert_equal "Account was successfully deleted.", flash[:notice]
  end

  test "system admins can destroy any user account" do
    sign_in @system_admin
    assert_difference("User.count", -1) do
      delete user_url(@user)
    end
    assert_redirected_to root_path
    assert_equal "Account was successfully deleted.", flash[:notice]
  end

  test "users cannot destroy other user accounts" do
    sign_in @user
    assert_no_difference("User.count") do
      delete user_url(@other_user)
    end
    assert_redirected_to root_path
    assert_equal "You are not authorized to perform this action.", flash[:alert]
  end

  # Display tests
  test "should show user profile with display name" do
    sign_in @user
    get user_url(@user)
    assert_response :success
    assert_select "h1", text: "#{@user.display_name}"
  end

  test "should show groups section" do
    sign_in @user
    get user_url(@user)
    assert_response :success
    assert_select "h3", text: "Group Memberships"
  end

  test "should show message when user has no content" do
    sign_in @user
    get user_url(@user)
    assert_response :success
    assert_select "h3", text: "No content yet"
  end

  test "should show edit button for user viewing their own profile" do
    sign_in @user
    get user_url(@user)
    assert_response :success
    assert_select "a[href=?]", edit_user_path(@user), text: "Edit Profile"
  end

  test "should show delete button for user viewing their own profile" do
    sign_in @user
    get user_url(@user)
    assert_response :success
    assert_select "form[action=?][method=post]", user_path(@user) do
      assert_select "input[name=_method][value=delete]", count: 1
    end
  end
end
