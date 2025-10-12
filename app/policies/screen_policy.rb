class ScreenPolicy < ApplicationPolicy
  # NOTE: Up to Pundit v2.3.1, the inheritance was declared as
  # `Scope < Scope` rather than `Scope < ApplicationPolicy::Scope`.
  # In most cases the behavior will be identical, but if updating existing
  # code, beware of possible changes to the ancestors:
  # https://gist.github.com/Burgestrand/4b4bc22f31c8a95c425fc0e30d7ef1f5

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end

  def create?
    # Screens can be created by any admin of the associated group.
    record.group.is_admin?(user)
  end

  def edit?
    # Screens can be edited by any member of the associated group.
    record.group.is_member?(user)
  end

  def update?
    return false unless edit?

    # If group_id is being changed, ensure user is admin of both
    # the current group and the new group.
    if record.group_id_changed? && record.group_id_was != record.group_id
      # First check the old (aka current) group.
      old_group = Group.find_by(id: record.group_id_was)
      return false unless old_group.is_admin?(user)

      # Then check the new / proposed group.
      new_group = Group.find_by(id: record.group_id)
      return false unless new_group.is_admin?(user)
    end

    true
  end

  def destroy?
    # Screens can be deleted by any admin of the associated group.
    record.group.is_admin?(user)
  end

  def permitted_attributes
    if can_edit_group?
      [ :name, :template_id, :group_id ]
    else
      [ :name, :template_id ]
    end
  end

  # Helper method to determine if the user can edit the group which owns a screen.
  #
  # This is used both in the policy and in the view to disable UI elements.
  def can_edit_group?
    record.new_record? || record.group.is_admin?(user)
  end
end
