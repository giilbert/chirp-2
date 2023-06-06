<img src="https://github.com/giilbert/chirp-2/assets/40220369/4d1d7065-3441-4658-9d1d-be9555210031" width="100%" height="auto" />

# Chirp (2.0)

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## [🦆 Visit Here!](https://chirp-2.gilbertz.tech/)

From breaking news to shitposts, get the latest information from people all over the world with this next-generation blazingly-fast social media app!

## Features

- [x] Create, edit, and delete chirps (posts)
- [x] Like and unlike chirps
- [x] User authentication and profiles
- [x] Follow and unfollow users
- [x] View posts from followed users
- [x] Search for users and posts
- [x] Chirp Purple

## The Stack

- [Next.js](https://nextjs.org/) - Fullstack React framework 🚀💪
- [Prisma](https://www.prisma.io/) - Database without the tears 😭
- [tRPC](https://trpc.io/) - Typescript RPC framework 🦉
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework 🎨
- [MySQL](https://www.mysql.com/) - Database 🗃️

## Hosted on

- [Vercel](https://vercel.com/) - Frontend hosting ▲ (they're awesome ~~for sponsoring TechCodes~~)
- [PlanetScale](https://planetscale.com/) - [Vitess](https://vitess.io/) MySQL Database hosting 🗄️ (they're awesome too)

## Running in Development

### The Easy Way

1. Load the devcontainer defined in `.devcontainer/devcontainer.json`
2. Create a `.env.local` file with the appropriate environment variables (see `.env.example`)
3. Run the development task in VSCode

### The Harder Way

Required tools (these are my versions, the app may or may not work on other versions):

- `node v19.9.0`
- `yarn 1.22.19`
- `docker 20.10.24`

### Steps:

1. Create a `.env.local` file with the appropriate environment variables (see `.env.example`)
2. Install dependencies: `yarn`
3. Start MySQL service: `docker compose up`
4. Set up the database: `yarn prisma db push`
5. Start the app: `yarn dev`
6. If everything went right, you should be able to access the app at `http://localhost:3000`

## License

Distributed under the MIT License. See `LICENSE` for more information.
