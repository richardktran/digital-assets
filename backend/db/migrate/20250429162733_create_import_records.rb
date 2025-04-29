class CreateImportRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :import_records do |t|
      t.references :import_job, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.string :file_url
      t.integer :price
      t.string :status, null: false, default: 'pending'
      t.text :error

      t.timestamps
    end
  end
end
