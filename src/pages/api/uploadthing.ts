import { chirpFileRouter } from "@/server/uploadthing";
import { createNextPageApiHandler } from "uploadthing/next-legacy";

const handler = createNextPageApiHandler({
  router: chirpFileRouter,
});

export default handler;
