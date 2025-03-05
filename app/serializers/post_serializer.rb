class PostSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :body, :image, :user_id, :created_at, :updated_at, :image_url
end
