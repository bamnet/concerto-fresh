# frozen_string_literal: true

module ContentOrderers
  class Base
    # @param content_items [Array<Hash>] Array of { content:, subscription: } hashes
    # @return [Array<Content>] Ordered content items
    def call(content_items)
      content_items.map { |item| item[:content] }
    end
  end
end
