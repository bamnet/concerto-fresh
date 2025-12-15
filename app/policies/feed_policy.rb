class FeedPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    # All users (including anonymous) can see all feeds
    def resolve
      scope.all
    end
  end

  def index?
    # Everyone can view the list
    true
  end

  def show?
    # Everyone can view individual feeds
    true
  end

  def new?
    super || can_create_new_feed?
  end

  def create?
    # Once Feed has group_id, this will check group admin permissions
    super || can_create_new_feed?
  end

  def edit?
    # Once Feed has group_id, this will check group member permissions
    super
  end

  def update?
    # Once Feed has group_id, this will check group member permissions
    super
  end

  def destroy?
    # Once Feed has group_id, this will check group admin permissions
    super
  end

  def refresh?
    # Refresh requires update permissions
    update?
  end

  def cleanup?
    # Cleanup requires update permissions
    update?
  end

  private

  # Feeds can be created by any admin of any group
  def can_create_new_feed?
    return false unless user
    user.admin_groups.any?
  end

  public

  def permitted_attributes
    # System admins can edit all attributes
    # Once Feed has group_id, non-admins will have restricted permissions
    if can_edit_group?
      [ :name, :description, :type, :config, :group_id ]
    else
      [ :name, :description, :type, :config ]
    end
  end

  # Helper method to determine if the user can edit the group which owns a screen.
  #
  # This is used both in the policy and in the view to disable UI elements.
  def can_edit_group?
    return true if user&.system_admin?
    return false unless user
    record.new_record? || record.group.admin?(user)
  end
end
