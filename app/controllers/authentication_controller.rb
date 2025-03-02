class AuthenticationController < ApplicationController
  before_action :authenticate_user!

  def validate_token
    if current_user
      render json: { valid: true }, status: :ok
    else
      render json: { valid: false }, status: :unauthorized
    end
  end
end
