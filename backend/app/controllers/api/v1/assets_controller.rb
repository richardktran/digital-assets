class Api::V1::AssetsController < ApplicationController
  include Authenticatable
  before_action :set_asset, only: [ :show, :update, :destroy ]

  def index
    if params[:creator_id]
      assets = Asset.where(creator_id: params[:creator_id])
    else
      assets = Asset.where.not(creator_id: current_user.id)
    end

    render_assets(assets)
  end

  def my
    assets = Asset.where(creator_id: current_user.id)

    render_assets(assets)
  end

  def show
    render_assets(@asset)
  end

  def update
    if @asset.update(asset_params)
      if params[:asset_file]
        asset_file = @asset.asset_files
        asset_file.update(asset_file_params)
      end

      render_assets(@asset)
    else
      render json: {
        error: @asset.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @asset.destroy

    render json: {
      message: "Asset deleted successfully"
    }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: {
      error: "Failed to delete asset"
    }, status: :unprocessable_entity
  end

  private

  def set_asset
    @asset = Asset.includes(:asset_files).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      error: "Asset not found"
    }, status: :not_found
  end

  def asset_params
    params.require(:asset).permit(:title, :description, :price, :creator_id)
  end

  def asset_file_params
    params.require(:asset_file).permit(:file_url)
  end

  def render_assets(assets)
    render json: {
      data: assets.as_json(current_user: current_user)
    }, status: :ok
  end
end
