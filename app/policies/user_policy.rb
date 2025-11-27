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
    # Everyone can view an individual user
    true
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
    super || can_update_user?
  end

  def destroy?
    super || can_destroy_user?
  end

  private

  # A user may only update themselves (system admins can update anyone via super)
  def can_edit_user?
    return false unless user
    user.id == record.id
  end

  def can_update_user?
    can_edit_user?
  end

  # A user may only destroy themselves (system admins can destroy anyone via super)
  def can_destroy_user?
    return false unless user
    user.id == record.id
  end
end
