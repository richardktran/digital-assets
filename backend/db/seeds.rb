# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


# Clear existing data
AssetFile.destroy_all
Asset.destroy_all
User.destroy_all
Role.destroy_all

# Create roles
creator_role = Role.create!(name: 'creator')
admin_role = Role.create!(name: 'admin')

# Create admin
User.create!(
  email: 'admin@gg.com',
  password: 'test123',
  first_name: 'Admin',
  last_name: 'Admin',
  role: admin_role
)

# Create creators
creator1 = User.create!(
  email: 'creator1@gg.com',
  password: 'test123',
  first_name: 'Creator',
  last_name: 'One',
  role: creator_role
)

creator2 = User.create!(
  email: 'creator2@gg.com',
  password: 'test123',
  first_name: 'Creator',
  last_name: 'Two',
  role: creator_role
)

# Create assets for creator1
asset1 = Asset.create!(
  title: 'Digital Artwork 1',
  description: 'A beautiful digital painting.',
  price: 19.99,
  creator: creator1
)
AssetFile.create!(
  asset: asset1,
  file_url: 'https://example.com/files/artwork1.png'
)

asset2 = Asset.create!(
  title: 'Music Track 1',
  description: 'An original music composition.',
  price: 9.99,
  creator: creator1
)
AssetFile.create!(
  asset: asset2,
  file_url: 'https://example.com/files/track1.mp3'
)

# Create assets for creator2
asset3 = Asset.create!(
  title: '3D Model 1',
  description: 'A detailed 3D model for games.',
  price: 29.99,
  creator: creator2
)
AssetFile.create!(
  asset: asset3,
  file_url: 'https://example.com/files/model1.obj'
)

asset4 = Asset.create!(
  title: 'Video Tutorial 1',
  description: 'A comprehensive video tutorial.',
  price: 14.99,
  creator: creator2
)
AssetFile.create!(
  asset: asset4,
  file_url: 'https://example.com/files/tutorial1.mp4'
)

puts "Seeded #{Role.count} roles, #{User.count} users, #{Asset.count} assets, and #{AssetFile.count} asset files."
