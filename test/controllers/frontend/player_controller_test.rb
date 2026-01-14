require "test_helper"

class Frontend::PlayerControllerTest < ActionDispatch::IntegrationTest
  setup do
    @screen = screens(:one)
  end

  test "should show screen" do
    get "/frontend/#{@screen.id}"
    assert_response :success
  end

  test "should show screen with supported browser Chrome 64" do
    get "/frontend/#{@screen.id}",
        headers: { "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36" }
    assert_response :success
  end

  test "should show screen with supported browser Firefox 69" do
    get "/frontend/#{@screen.id}",
        headers: { "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0" }
    assert_response :success
  end

  test "should show screen with supported browser Safari 13.1" do
    get "/frontend/#{@screen.id}",
        headers: { "User-Agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15" }
    assert_response :success
  end

  test "should show screen with supported LG Smart TV Chrome 79" do
    get "/frontend/#{@screen.id}",
        headers: { "User-Agent" => "Mozilla/5.0 (Linux; NetCast; U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 SmartTV/10.0 Colt/2.0" }
    assert_response :success
  end

  test "should reject unsupported browser Chrome 63" do
    get "/frontend/#{@screen.id}",
        headers: { "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36" }
    assert_response :not_acceptable
    assert_select "h1", "Browser Not Supported"
    assert_select "pre", /Chrome\/63\.0\.3239\.132/
  end
end
