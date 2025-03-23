class Post < ApplicationRecord
  belongs_to :user
  has_one_attached :image

  validates_length_of :title, minimum: 3, maximum: 3000
  validates_length_of :body, minimum: 5, maximum: 3000

  def image_url
    image.attached? ? Rails.application.routes.url_helpers.url_for(image) : nil
  end
end
