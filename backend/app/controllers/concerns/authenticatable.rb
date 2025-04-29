module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate
  end

  private

  def authenticate
    token = request.headers['Authorization']&.split('Bearer ')&.last
    return render json: { error: 'Missing token' }, status: :unauthorized unless token

    begin
      payload = JWT.decode(token, Rails.application.credentials.secret_key_base).first
      @current_user = User.find(payload['user_id'])
    rescue JWT::ExpiredSignature
      render json: { error: 'Token expired' }, status: :unauthorized
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end