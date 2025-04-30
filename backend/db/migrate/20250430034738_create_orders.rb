class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.string :idempotency_key, null: false, index: { unique: true }
      t.integer :total_amount, null: false
      t.string :status, null: false, default: 'pending'

      t.references :user, null: false, foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end
