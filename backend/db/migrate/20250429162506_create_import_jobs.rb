class CreateImportJobs < ActiveRecord::Migration[8.0]
  def change
    create_table :import_jobs do |t|
      t.references :creator, null: false, foreign_key: { to_table: :users }
      t.string :status, default: 'pending'
      t.text :error

      t.timestamps
    end
  end
end
