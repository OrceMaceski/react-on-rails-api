require "pagy/extras/metadata"
class PostsController < ApplicationController
  include Pagy::Backend

  before_action :authenticate_user!
  before_action :set_post, only: %i[ show update destroy ]

  # GET /posts
  def index
    user_posts = current_user.posts
    @pagy, @posts = pagy(user_posts, limit: 4)

    render json: { data: @posts, pagy: pagy_metadata(@pagy) }
  end

  # GET /posts/1
  def show
    render json: PostSerializer.new(@post).serializable_hash[:data][:attributes]
  end

  # POST /posts
  def create
    @post = Post.new(post_params)
    @post.user = current_user
    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    # Handle image removal if requested
    if params.dig(:post, :remove_image) == "true" && @post.image.attached?
      @post.image.purge
    end

    if @post.update(post_params.except(:remove_image))
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.expect(post: [ :title, :body, :image, :remove_image ])
    end
end
