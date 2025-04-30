class Api::V1::Admin::AdminBaseController < ApplicationController
  include Authenticatable
  before_action :ensure_admin

  private

  def ensure_admin
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user.admin?
  end
end
