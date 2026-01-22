class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: %i[ show edit update destroy ]
  after_action :verify_authorized

  # GET /users/1 or /users/1.json
  def show
    authorize @user
    @memberships = @user.memberships.includes(:group).order("groups.name")
  end

  # GET /users/1/edit
  def edit
    authorize @user
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    authorize @user
    if @user.update(user_params)
      redirect_to @user, notice: "Profile was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    authorize @user
    is_self_deletion = @user == current_user
    if @user.destroy
      sign_out if is_self_deletion
      redirect_to root_path, notice: "Account was successfully deleted."
    else
      redirect_to @user, alert: @user.errors.full_messages.join(", ")
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params.expect(:id))
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(policy(@user).permitted_attributes)
  end
end
