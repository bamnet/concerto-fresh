ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    include Devise::Test::IntegrationHelpers

    # Stub GitHub releases API so tests rendering the header don't make real HTTP calls.
    # Individual tests can override this with their own stub_request.
    setup do
      stub_request(:get, "https://api.github.com/repos/concerto/concerto/releases/latest")
        .to_return(status: 404, body: "Not Found")
    end

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

    # Add more helper methods to be used by all tests here...
  end
end
