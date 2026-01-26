ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "webmock/minitest"

# Allow localhost connections for system tests, block all other external requests
WebMock.disable_net_connect!(allow_localhost: true)

module ActiveSupport
  class TestCase
    include Devise::Test::IntegrationHelpers

    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Each parallel tests has it's own folder.
    parallelize_setup do |i|
      ActiveStorage::Blob.service.root = "#{ActiveStorage::Blob.service.root}-#{i}"
    end

    # Clean up fixture attachments.
    parallelize_teardown do |i|
      FileUtils.rm_rf(ActiveStorage::Blob.services.fetch(:test_fixtures).root)
    end

    # Stub external API requests globally
    setup do
      # oEmbed APIs
      stub_request(:get, /tiktok\.com\/oembed/)
        .to_return(
          status: 200,
          body: {
            "html" => '<blockquote data-video-id="6718335390845095173"></blockquote>',
            "thumbnail_url" => "https://example.com/tiktok-thumbnail.jpg"
          }.to_json,
          headers: { "Content-Type" => "application/json" }
        )

      stub_request(:get, /vimeo\.com\/api\/oembed\.json/)
        .to_return(
          status: 200,
          body: {
            "video_id" => 897211169,
            "thumbnail_url" => "https://example.com/vimeo-thumbnail.jpg"
          }.to_json,
          headers: { "Content-Type" => "application/json" }
        )

      # RSS feeds
      stub_request(:get, /news\.yahoo\.com\/rss/)
        .to_return(
          status: 200,
          body: File.read(Rails.root.join("test/support/basic_rss_feed.xml")),
          headers: { "Content-Type" => "application/rss+xml" }
        )
    end
  end
end
