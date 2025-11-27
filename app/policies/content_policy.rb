class ContentPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    # All users (including anonymous) can see all content
    def resolve
      scope.all
    end
  end

  def index?
    # Everyone can view the list
    true
  end

  def show?
    # Everyone can view individual content items
    true
  end

  def new?
    super || can_create_content?
  end

  def create?
    super || can_create_content?
  end

  def edit?
    super || can_edit_content?
  end

  def update?
    super || can_update_content?
  end

  def destroy?
    super || can_destroy_content?
  end

  private

  # All signed-in users can create content
  def can_create_content?
    user.present?
  end

  # Content can only be updated by the owner
  def can_edit_content?
    return false unless user
    record.user_id == user.id
  end

  # Content can only be updated by the owner
  def can_update_content?
    can_edit_content?
  end

  # Content can only be destroyed by the owner
  def can_destroy_content?
    return false unless user
    record.user_id == user.id
  end
end
