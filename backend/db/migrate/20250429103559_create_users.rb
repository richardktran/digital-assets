class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :first_name
      t.string :last_name
      t.string :password_digest, null: false
      t.references :role, null: false, foreign_key: true

      t.timestamps
    end
  end
end
