class Frontend::ContentController < Frontend::ApplicationController
  def index
    @screen = Screen.find(params[:screen_id])
    @field = Field.find(params[:field_id])
    @position = Position.find(params[:position_id])

    @content = fetch_pinned_content || fetch_subscription_content

    logger.debug "Found #{@content.count} content to render in #{@screen.name}'s #{@field.name} field"

    render json: @content
  end

  private

  def field_config
    @field_config ||= FieldConfig.find_by(screen: @screen, field: @field)
  end

  def fetch_pinned_content
    return nil unless field_config&.pinned_content_id

    pinned = Content.active.find_by(id: field_config.pinned_content_id)
    [ pinned ] if pinned
  end

  def fetch_subscription_content
    subscriptions = @screen.subscriptions.where(field_id: @field.id).includes(:feed)

    # Build content items with subscription metadata
    content_items = subscriptions.flat_map do |subscription|
      subscription.contents.active.map do |content|
        { content: content, subscription: subscription }
      end
    end

    # Apply ordering strategy
    strategy = field_config&.ordering_strategy || "random"
    orderer = ContentOrderers.for(strategy)
    ordered_content = orderer.call(content_items)

    # Filter by position compatibility
    ordered_content.select { |c| c.should_render_in?(@position) }
  end
end
