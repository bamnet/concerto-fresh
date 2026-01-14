class Frontend::PlayerController < ActionController::Base
  # Support older browsers for embedded devices (Smart TVs, kiosks, etc.)
  # Edge 79+ is Chromium-based; earlier versions used EdgeHTML which is incompatible
  allow_browser versions: {
    chrome: 64,
    firefox: 69,
    safari: 13.1,
    edge: 79
  }, block: -> {
    render "frontend/player/unacceptable_browser", status: :not_acceptable, layout: false
  }

  before_action :set_screen, only: %i[ show ]

  # GET /frontend/1
  def show
    render layout: false
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_screen
    @screen = Screen.find(params[:id])
  end
end
