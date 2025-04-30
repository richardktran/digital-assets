# Digital Assets Marketplace

A full-stack digital assets marketplace platform that allows users to buy and sell digital products, with features for asset management, order processing, and creator earnings tracking.

## Features

- Asset bulk Import and management
- Purchase and download assets
- Admin dashboard with creator earnings

## Tech Stack

- **Backend**: Ruby on Rails
- **Frontend**: Next.js
- **Database**: SQLite
- **Containerization**: Docker
- **Storage**: Local storage (S3 integration planned)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-assets.git
   cd digital-assets
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   cp frontend/env.example frontend/.env.local
   ```

3. Start the application using Docker:
   ```bash
   docker-compose up --build
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:8000

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 8000
```

### Assets file import example
```bash
data1.json
data2.json
```

### Account to test
```bash
- Admin: admin@gg.com
- Creator1: creator1@gg.com
- Creator2: creator2@gg.com
- Creator3: creator3@gg.com
- Creator4: creator4@gg.com
- password (For all accounts): test123
```

### Test Accounts
```bash
- Admin: admin@gg.com
- Creator1: creator1@gg.com
- Creator2: creator2@gg.com
- Creator3: creator3@gg.com
- Creator4: creator4@gg.com
- password (For all accounts): test123
```

### Test Case Description

| Feature | Test Case Description | Expected Result | Notes |
|---------|----------------------|-----------------|-------|
| **User Authentication** |
| Login | Attempt to login with valid credentials | Successfully logged in and redirected to dashboard | Use test accounts provided below |
| Login | Attempt to login with invalid credentials | Error message displayed, login failed | |
| **Asset Management** |
| Bulk Import | Import multiple assets via JSON file | All assets imported successfully | Use data1.json and data2.json |
| Bulk Import | Import with invalid JSON format | Error message displayed, import failed | |
| Bulk Import | Import with missing required fields | Error message displayed, import failed | Required fields: title, description, price, category |
| Update Asset | Modify existing asset details | Asset information updated successfully | Changes reflected immediately |
| Update Asset | Update asset with invalid data | Error message displayed, update failed | Validates all input fields |
| Delete Asset | Remove asset from system | Asset removed from listings | Confirmation prompt before deletion |
| Delete Asset | Attempt to delete non-existent asset | Error message displayed | Asset ID validation |
| **Asset Purchase** |
| Checkout | Complete purchase process | Order confirmed, download link provided | |
| Idempotency Check | Submit same purchase request multiple times | Only one purchase processed, duplicate requests ignored | Prevents double charges |
| **Admin Dashboard** |
| View Earnings | Access creator earnings report | Earnings data displayed correctly | Admin access required |
| **File Management** |
| Upload | Upload asset file | File stored successfully | Supported formats: JSON |
| Download | Download purchased asset | File downloaded successfully if asset has been purchased, otherwise access denied | Only purchased assets can be downloaded |
