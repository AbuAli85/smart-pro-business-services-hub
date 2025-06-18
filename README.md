# SmartPRO Business Services Hub

A comprehensive platform for managing business services, clients, bookings, and contracts.

## Features

- User authentication and management
- Dashboard with analytics
- Booking management system
- Contract handling
- Messaging system
- Availability management
- Profile management
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication, Database)
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ (npm is used as the package manager)
- Supabase account

### Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/smartpro-business-hub.git
cd smartpro-business-hub
\`\`\`

2. Install dependencies using npm:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

4. Set up the database:

- Create a new Supabase project
- Run the SQL script in `database-setup.sql` in the Supabase SQL editor

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy on Vercel

The easiest way to deploy the app is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add the environment variables
4. Deploy

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and Supabase client
- `/public` - Static assets

## Authentication Flow

1. User signs up or logs in
2. Supabase handles authentication
3. On successful authentication, user is redirected to the dashboard
4. Protected routes check for authentication status

## Database Schema

The database includes the following tables:

- `profiles` - User profiles
- `services` - Available services
- `bookings` - User bookings
- `contracts` - User contracts
- `messages` - User messages
- `availability` - User availability
- `date_exceptions` - Specific date exceptions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's add a deployment configuration file:
