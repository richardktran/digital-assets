class Api::V1::Admin::StatisticsController < Api::V1::Admin::AdminBaseController
  def creators_earning
    earnings = User
            .left_outer_joins(:role, :orders)
            .where(roles: { name: 'creator' })
            .group('users.id')
            .select('users.id AS creator_id, users.first_name, users.last_name, users.email, COALESCE(SUM(orders.total_amount), 0) AS total_earnings')
            .map do |creator| 
              { 
                creator: {
                  id: creator.creator_id,
                  first_name: creator.first_name,
                  last_name: creator.last_name, 
                  email: creator.email
                },
                total_earnings: creator.total_earnings.to_f / 100
              }
            end

    render json: { data: earnings }, status: :ok
  end
end
