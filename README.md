This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
now  dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploying

You can deploy to a staging url by running the following commands:

```bash
now
```

This will stage your app at: `https://show-me-the-music-saratankard.vercel.app/`

To deploy to production, you can deploy using two methods:

1. pushing to the `master` branch
2. running the command

```bash
now --prod
```

## Configuration
You can see the various eslint and prettify configutation in the next.config.ts.
The app is configured to prettify on commit
