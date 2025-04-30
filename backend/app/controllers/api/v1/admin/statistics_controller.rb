class Api::V1::Admin::StatisticsController < Api::V1::Admin::AdminBaseController
  def creators_earning
    earnings = User
            .left_outer_joins(:role, :orders)
            .where(roles: { name: 'creator' })
            .group('users.id')
            .select('users.id AS creator_id, COALESCE(SUM(orders.total_amount), 0) AS total_earnings')
            .map { |creator| { creator_id: creator.creator_id, total_earnings: creator.total_earnings.to_f } }

    earnings.each do |creator|
      creator[:total_earnings] /= 100
    end

    render json: { data: earnings }, status: :ok
  end
end
