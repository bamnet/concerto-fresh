class MembershipsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_group
  before_action :set_membership, only: [ :update, :destroy ]

  def create
    user = User.find(params[:user_id])
    role = params[:role] || "member"

    @membership = @group.memberships.build(user: user, role: role)

    if @membership.save
      redirect_to @group, notice: "#{user.full_name} has been added to the group."
    else
      redirect_to @group, alert: @membership.errors.full_messages.join(", ")
    end
  end

  def update
    if @membership.update(membership_params)
      redirect_to @group, notice: "#{@membership.user.full_name}'s role has been updated."
    else
      redirect_to @group, alert: @membership.errors.full_messages.join(", ")
    end
  end

  def destroy
    user_name = @membership.user.full_name

    if @membership.destroy
      redirect_to @group, notice: "#{user_name} has been removed from the group."
    else
      redirect_to @group, alert: @membership.errors.full_messages.join(", ")
    end
  end

  private

  def set_group
    @group = Group.find(params[:group_id])
  end

  def set_membership
    @membership = @group.memberships.find(params[:id])
  end

  def membership_params
    params.require(:membership).permit(:role)
  end
end
