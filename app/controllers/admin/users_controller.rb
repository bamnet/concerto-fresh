module Admin
  class UsersController < ApplicationController
    before_action :authenticate_user!
    before_action :set_user, only: %i[edit update destroy]
    after_action :verify_authorized

    # GET /admin/users/new
    def new
      @user = User.new
      authorize @user, :admin_create?
    end

    # POST /admin/users
    def create
      @user = User.new(user_params)
      authorize @user, :admin_create?

      if @user.save
        redirect_to user_url(@user), notice: "User was successfully created."
      else
        render :new, status: :unprocessable_entity
      end
    end

    # GET /admin/users/:id/edit
    def edit
      authorize @user
    end

    # PATCH/PUT /admin/users/:id
    def update
      authorize @user

      if password_provided?
        update_with_password
      else
        update_without_password
      end
    end

    # DELETE /admin/users/:id
    def destroy
      authorize @user

      if last_system_admin?(@user)
        redirect_to user_url(@user), alert: "Cannot delete the last system administrator."
        return
      end

      @user.destroy!
      redirect_to users_url, notice: "User was successfully deleted."
    end

    private

    def set_user
      @user = User.find(params.expect(:id))
    end

    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end

    def password_provided?
      params[:user][:password].present?
    end

    def update_with_password
      if @user.update(user_params)
        redirect_to user_url(@user), notice: "User was successfully updated."
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def update_without_password
      if @user.update_without_password(user_params.except(:password, :password_confirmation))
        redirect_to user_url(@user), notice: "User was successfully updated."
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def last_system_admin?(user)
      return false unless user.system_admin?
      Group.system_admins_group&.users&.count <= 1
    end
  end
end
