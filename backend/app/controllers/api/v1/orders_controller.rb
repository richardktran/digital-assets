class Api::V1::OrdersController < ApplicationController
  include Authenticatable
  before_action :set_order, only: [ :show ]

  def index
    orders = current_user.orders
    render json: { data: orders }, status: :ok
  end

  def show
    render json: { data: @order }, status: :ok
  end

  def create
    data = order_params
    idempotency_key = data[:idempotency_key]
    asset_ids = data[:asset_ids]&.uniq || []


    unless idempotency_key
      return render json: { error: "Idempotency key required" }, status: :bad_request
    end
    if asset_ids.empty?
      return render json: { error: "At least one asset required" }, status: :unprocessable_entity
    end

    existing_order = Order.find_by(idempotency_key: idempotency_key)
    if existing_order
      render json: { data: existing_order }, status: :ok
      return
    end

    Order.transaction do
      assets = Asset.where(id: asset_ids)
      if assets.count != asset_ids.size
        return render json: { error: "Some assets not found" }, status: :not_found
      end

      total_price = assets.sum do |asset|
        asset.accessible_by?(current_user) ? 0 : asset.price
      end

      order = Order.create!(
        idempotency_key: idempotency_key,
        total_amount: total_price,
        user: current_user,
        status: "pending"
      )

      if order.invalid?
        return render json: { error: order.errors.full_messages }, status: :unprocessable_entity
      end

      assets.each do |asset|
        asset_price = asset.price
        if asset.accessible_by?(current_user)
          asset_price = 0
        end
        order.order_items.create!(asset: asset, amount: asset_price)
      end

      # Simulate a payment success
      order.update!(status: "completed")

      render json: { data: order }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_order
    @order = Order.find_by(id: params[:id])
    unless @order
      render json: { error: "Order not found" }, status: :not_found
    end
  end

  def order_params
    params.require(:orders).permit(:idempotency_key, asset_ids: [])
  end
end
