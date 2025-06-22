class ApplicationController < ActionController::API
  include JwtAuthentication
  include ActionController::MimeResponds
  respond_to :json
end
