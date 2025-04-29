class Api::V1::AssetsController < ApplicationController
  include Authenticatable
  before_action :set_asset, only: [ :show ]

  def index
    if params[:creator_id]
      assets = Asset.where(creator_id: params[:creator_id])
    else
      assets = Asset.all
    end

    render json: {
      data: assets
    }, status: :ok
  end

  def show
    render json: {
      data: @asset.as_json().merge(
        file: @asset.get_asset_file(current_user)
      )
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: {
      error: "Asset not found"
    }, status: :not_found
  end

  private

  def set_asset
    @asset = Asset.find(params[:id])
  end
end
