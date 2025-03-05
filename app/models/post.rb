class Post < ApplicationRecord
  belongs_to :user
  has_one_attached :image

  def image_url
    image.attached? ? Rails.application.routes.url_helpers.url_for(image) : nil
  end
end
