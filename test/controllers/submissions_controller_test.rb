require "test_helper"

class SubmissionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @submission = submissions(:one)
  end

  test "should get index" do
    get submissions_url
    assert_response :success
  end

  test "should get new" do
    get new_submission_url
    assert_response :success
  end

  test "should create submission" do
    assert_difference("Submission.count") do
      post submissions_url, params: { submission: { content_id: @submission.content_id, feed_id: @submission.feed_id } }
    end

    assert_redirected_to submission_url(Submission.last)
  end

  test "should show submission" do
    get submission_url(@submission)
    assert_response :success
  end

  test "should get edit" do
    get edit_submission_url(@submission)
    assert_response :success
  end

  test "should update submission" do
    patch submission_url(@submission), params: { submission: { content_id: @submission.content_id, feed_id: @submission.feed_id } }
    assert_redirected_to submission_url(@submission)
  end

  test "should destroy submission" do
    assert_difference("Submission.count", -1) do
      delete submission_url(@submission)
    end

    assert_redirected_to submissions_url
  end

  # Authorization tests
  test "should allow content owner to create submission" do
    sign_in users(:admin)
    content = rich_texts(:plain_richtext)  # owned by admin
    feed = feeds(:one)

    assert_difference("Submission.count") do
      post submissions_url, params: { submission: { content_id: content.id, feed_id: feed.id } }
    end
    assert_redirected_to submission_url(Submission.last)
  end

  test "should not allow non-owner to create submission for others content" do
    sign_in users(:non_member)
    content = rich_texts(:plain_richtext)  # owned by admin
    feed = feeds(:one)

    assert_no_difference("Submission.count") do
      post submissions_url, params: { submission: { content_id: content.id, feed_id: feed.id } }
    end
    assert_redirected_to root_url
    assert_equal "You are not authorized to perform this action.", flash[:alert]
  end

  test "should allow content owner to destroy their submission" do
    sign_in users(:admin)
    submission = submissions(:three)  # content owned by admin

    assert_difference("Submission.count", -1) do
      delete submission_url(submission)
    end
    assert_redirected_to submissions_url
  end

  test "should not allow non-owner to destroy others submission" do
    sign_in users(:non_member)
    submission = submissions(:three)  # content owned by admin

    assert_no_difference("Submission.count") do
      delete submission_url(submission)
    end
    assert_redirected_to root_url
    assert_equal "You are not authorized to perform this action.", flash[:alert]
  end
end
