# frozen_string_literal: true

module ContentOrderers
  class StrictPriority < Base
    def call(content_items)
      return [] if content_items.empty?

      max_weight = content_items.map { |item| item[:subscription].weight }.max

      content_items
        .select { |item| item[:subscription].weight == max_weight }
        .shuffle
        .map { |item| item[:content] }
    end
  end
end
