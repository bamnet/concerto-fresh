# frozen_string_literal: true

module ContentOrderers
  class Random < Base
    def call(content_items)
      content_items.shuffle.map { |item| item[:content] }
    end
  end
end
