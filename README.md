# Chirp (2.0)

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### [🦆 Visit Here!](https://example.com)

Twitter clone built with dark magic and ran by ducks.

## Features

- [x] Create, edit, and delete posts
- [x] Like and unlike posts
- [x] User authentication and profiles
- [x] Follow and unfollow users
- [x] View posts from followed users
- [ ] ✨ Recommendation algorithm 💰
- [ ] Search for users and posts
- [ ] Notifications
- [ ] Direct messages
- [ ] User analytics
- [ ] Chirp Purple

## The Stack

- [Next.js](https://nextjs.org/) - Fullstack React framework 🚀💪
- [Prisma](https://www.prisma.io/) - Database without the tears 😭
- [tRPC](https://trpc.io/) - Typescript RPC framework 🦉
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework 🎨
- [Redis](https://redis.io/) - In-memory data structure store 🗄️
- [MySQL](https://www.mysql.com/) - Database 🗃️

## Hosted on

- [Vercel](https://vercel.com/) - Frontend hosting ▲ (they're awesome ~~for sponsoring TechCodes~~)
- [PlanetScale](https://planetscale.com/) - [Vitess](https://vitess.io/) MySQL Database hosting 🗄️ (they're awesome too)

## Running in Development

### The Easy Way

Literally just use the [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) config I set up in VSCode lol

### The Harder Way

Required tools (these are my versions, the app may or may not work on other versions):

- `node v19.9.0`
- `yarn 1.22.19`
- `docker 20.10.24`

### Steps:

1. Create a `.env.local` file with the appropriate environment variables (see `.env.example`)
2. Install dependencies: `yarn`
3. Start redis and MySQL service: `docker compose up`
4. Set up the database: `yarn prisma db push`
5. Start the app: `yarn dev`
6. If everything went right, you should be able to access the app at `http://localhost:3000`

## License

Distributed under the MIT License. See `LICENSE` for more information.
