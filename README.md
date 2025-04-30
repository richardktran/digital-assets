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

### Test Case Description


## Roadmap

- [ ] Implement S3 storage integration
- [ ] Integrate with Stripe for payments
- [ ] Implement soft delete functionality
- [ ] Enhance Docker configuration
- [ ] Add comprehensive testing suite
- [ ] Implement caching layer
- [ ] Add analytics dashboard
