class Frontend::PwaController < ApplicationController
  before_action :set_screen

  def manifest
    respond_to do |format|
      format.json { render template: "frontend/pwa/manifest", layout: false }
    end
  end

  private
  def set_screen
    @screen = Screen.find(params[:screen_id])
  end
end
