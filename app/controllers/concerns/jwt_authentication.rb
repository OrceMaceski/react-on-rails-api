module JwtAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user_from_token!
    rescue_from JWT::DecodeError, with: :handle_jwt_error
    rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found
  end

  private

  def authenticate_user_from_token!
    return unless request.headers["Authorization"].present?

    token = request.headers["Authorization"].split.last
    unless valid_token_format?(token)
      render json: { error: "Invalid token format" }, status: :unauthorized
      return
    end

    begin
      jwt_payload, _ = JWT.decode(
        token,
        Rails.application.credentials.devise_jwt_secret_key!,
        true,
        { algorithm: "HS256" }
      )

      if jwt_payload["exp"] && Time.at(jwt_payload["exp"]) < Time.current
        render json: { error: "Token has expired" }, status: :unauthorized
        return
      end

      @current_user = User.find(jwt_payload["sub"])
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!
    render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
  end

  def valid_token_format?(token)
    token.split(".").length == 3
  end

  def handle_jwt_error(exception)
    render json: { error: "Invalid token", details: exception.message }, status: :unauthorized
  end

  def handle_record_not_found
    render json: { error: "User not found" }, status: :unauthorized
  end
end
