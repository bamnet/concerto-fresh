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
    super || can_create_feed?
  end

  def edit?
    super || can_edit_feed?
  end

  def update?
    super || can_update_feed?
  end

  def destroy?
    super || can_destroy_feed?
  end

  private

  # Feeds can be created by any admin of any group
  def can_create_new_feed?
    return false unless user
    user.admin_groups.any?
  end

  # Feeds can be created by any admin of the associated group
  # NOTE: This assumes Feed will have a group association in the future
  def can_create_feed?
    return false unless user
    return false unless record.respond_to?(:group) && record.group.present?
    record.group.admin?(user)
  end

  # Feeds can be edited by any member of the associated group
  # NOTE: This assumes Feed will have a group association in the future
  def can_edit_feed?
    return false unless user
    return false unless record.respond_to?(:group) && record.group.present?
    record.group.member?(user)
  end

  # Feeds can be updated by members of the group, but group changes
  # require admin permissions on both the old and new groups
  # NOTE: This assumes Feed will have a group association in the future
  def can_update_feed?
    return false unless can_edit_feed?

    # If group_id is being changed, ensure user is admin of both
    # the current group and the new group
    if record.respond_to?(:group_id_changed?) && record.group_id_changed?
      # Check permissions on the old group, if it existed
      if record.group_id_was.present?
        old_group = Group.find_by(id: record.group_id_was)
        return false unless old_group&.admin?(user)
      end

      # Check permissions on the new group
      return false unless record.group&.admin?(user)
    end

    true
  end

  # Feeds can be deleted by any admin of the associated group
  # NOTE: This assumes Feed will have a group association in the future
  def can_destroy_feed?
    return false unless user
    return false unless record.respond_to?(:group) && record.group.present?
    record.group.admin?(user)
  end

  public

  def permitted_attributes
    if can_edit_group?
      [ :name, :description, :type, :config, :group_id ]
    else
      [ :name, :description, :type, :config ]
    end
  end

  # Helper method to determine if the user can edit the group which owns a feed
  def can_edit_group?
    return true if user&.system_admin?
    return false unless user
    return false unless record.respond_to?(:group) && record.group.present?
    record.new_record? || record.group.admin?(user)
  end
end
