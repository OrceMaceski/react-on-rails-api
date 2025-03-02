class ApplicationController < ActionController::API
  include JwtAuthentication
  include ActionController::MimeResponds
  respond_to :json
end

# class ApplicationController < ActionController::API
#   # include JwtAuthentication
#   include ActionController::MimeResponds
#   respond_to :json

#   before_action :authenticate_user_from_token!

#   rescue_from JWT::DecodeError, with: :handle_jwt_error
#   rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

#   private

#   def authenticate_user_from_token!
#     return unless request.headers["Authorization"].present?

#     jwt_payload = JWT.decode(
#       request.headers["Authorization"].split.last,
#       Rails.application.credentials.devise_jwt_secret_key!
#     ).first

#     @current_user = User.find(jwt_payload["sub"])
#   end

#   def current_user
#     @current_user
#   end

#   def authenticate_user!
#     render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
#   end

#   def handle_jwt_error(exception)
#     render json: { error: "Invalid token", details: exception.message }, status: :unauthorized
#   end

#   def handle_record_not_found
#     render json: { error: "User not found" }, status: :unauthorized
#   end
# end
