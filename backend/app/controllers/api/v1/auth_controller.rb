class Api::V1::AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])
    authenticated_user = user&.authenticate(params[:password])

    if authenticated_user
      token = JsonWebToken.encode(user_id: user.id)
      expires_at = JsonWebToken.decode(token)[:exp]

      response_success({ token:, expires_at:, user: })
    else
      response_error("Invalid email or password", status: :unauthorized)
    end
  end
end
