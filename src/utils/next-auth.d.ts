import type { Profile } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      profile?: Profile;
    };
  }
}
