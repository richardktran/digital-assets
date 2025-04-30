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
OrderItem.destroy_all
Order.destroy_all
ImportRecord.destroy_all
ImportJob.destroy_all
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
User.create!(
  email: 'creator1@gg.com',
  password: 'test123',
  first_name: 'Creator',
  last_name: 'One',
  role: creator_role
)

User.create!(
  email: 'creator2@gg.com',
  password: 'test123',
  first_name: 'Creator',
  last_name: 'Two',
  role: creator_role
)

User.create!(
  email: 'creator3@gg.com',
  password: 'test123',
  first_name: 'Creator',
  last_name: 'Three',
  role: creator_role
)

User.create!(
  email: 'creator4@gg.com',
  password: 'test123',
  first_name: 'Creator',
  last_name: 'Four',
  role: creator_role
)

puts "Seeded #{Role.count} roles, #{User.count} users."
