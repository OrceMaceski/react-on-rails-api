class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  respond_to :json

  before_action :authenticate_user_from_token!

  private

  def authenticate_user_from_token!
    return unless request.headers["Authorization"].present?

    begin
      jwt_payload = JWT.decode(
        request.headers["Authorization"].split.last,
        Rails.application.credentials.devise_jwt_secret_key!
      ).first

      @current_user = User.find(jwt_payload["sub"])
    rescue JWT::DecodeError => e
      render json: { error: "Invalid token", details: e.message  }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { error: "User not found" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!
    render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
  end
end
