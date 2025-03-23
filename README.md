# YouTube Clone

A YouTube clone built with modern web technologies, featuring video search, playback, and comments.

## Tech Stack

- **Next.js 15** - React framework for server-side rendering and static site generation
- **TypeScript** - Type safety for better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **ShadCN UI** - Beautiful and customizable UI components
- **ESLint** - Code linting for maintaining quality
- **Prettier** - Code formatting for consistency
- **Jest** - Testing framework for unit and integration tests

## Features

- Search and display YouTube videos
- Fetch video details and comments
- Related videos section
- Pagination support for videos

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **npm** or **yarn**
- **Google API Key** (for fetching YouTube data)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/iampankajk/youtube-clone.git
   cd youtube-clone
   ```

2. Install dependencies:

   ```sh
   npm install  # or yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the project root
   - Add the following:
     ```env
     NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
     ```

### Running Locally

Start the development server:

```sh
npm run dev  # or yarn dev
```

Your app will be running at `http://localhost:3000`.

### Running Tests

Run unit tests using Jest:

```sh
npm run test  # or yarn test
```

Run tests in watch mode:

```sh
npm run test:watch  # or yarn test:watch
```

### Code Quality

To lint the code:

```sh
npm run lint  # or yarn lint
```

To format the code:

```sh
npm run format  # or yarn format
```
