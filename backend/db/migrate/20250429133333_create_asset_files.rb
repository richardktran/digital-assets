class CreateAssetFiles < ActiveRecord::Migration[8.0]
  def change
    create_table :asset_files do |t|
      t.string :file_url, null: false
      t.references :asset, null: false, foreign_key: { to_table: :assets }

      t.timestamps
    end
  end
end
