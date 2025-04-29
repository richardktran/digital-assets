module Api
  module V1
    class AuthController < ApplicationController
      def login
        user = User.find_by(email: params[:email])
        authenticated_user = user&.authenticate(params[:password])

        if authenticated_user
          token = JsonWebToken.encode(user_id: user.id)
          expires_at = JsonWebToken.decode(token)[:exp]

          render json: { token:, expires_at: }, status: :ok
        else
          render json: { error: "unauthorized" }, status: :unauthorized
        end
      end
    end
  end
end