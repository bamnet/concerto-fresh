class UserPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    # All signed-in users can see all users
    def resolve
      return scope.none unless user
      scope.all
    end
  end

  def index?
    # Everyone who's signed in can view the list of users
    user.present?
  end

  def show?
    # Only signed-in users can view user profiles
    user.present?
  end

  def new?
    # Defer to Devise for user creation
    true
  end

  def create?
    # Defer to Devise for user creation
    true
  end

  def edit?
    super || can_edit_user?
  end

  def update?
    super || can_edit_user?
  end

  def destroy?
    super || can_edit_user?
  end

  def permitted_attributes
    # Users can only update their own basic profile information
    # System admins can update any user fields
    if user&.system_admin?
      [ :first_name, :last_name, :email, :is_system_user ]
    else
      [ :first_name, :last_name, :email ]
    end
  end

  private

  # A user may only update/destroy themselves (system admins can manage anyone via super)
  def can_edit_user?
    return false unless user
    user.id == record.id
  end
end
