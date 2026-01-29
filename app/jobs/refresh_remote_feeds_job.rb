DEFAULT_REMOTE_REFRESH_INTERVAL = 1.hour

class RefreshRemoteFeedsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    RemoteFeed.all.each do |feed|
      interval = feed.refresh_interval ? feed.refresh_interval.seconds : DEFAULT_REMOTE_REFRESH_INTERVAL

      if feed.last_refreshed.nil? || Time.now >= (feed.last_refreshed + interval)
        Rails.logger.debug "Refreshing #{feed.name}..."
        feed.refresh
      else
        Rails.logger.debug "Skipping refresh of #{feed.name}, next refresh at #{feed.last_refreshed + interval}"
      end
    end
  end
end
