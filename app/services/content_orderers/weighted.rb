# frozen_string_literal: true

module ContentOrderers
  class Weighted < Base
    def call(content_items)
      weighted = content_items.flat_map do |item|
        Array.new(item[:subscription].weight, item[:content])
      end

      remove_consecutive_duplicates(weighted.shuffle)
    end

    private

    def remove_consecutive_duplicates(items)
      items.chunk_while { |a, b| a.id == b.id }.map(&:first)
    end
  end
end
