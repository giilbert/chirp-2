import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { authOptions } from "./auth";
import { prisma } from "./db";
import type { UploadedFile } from "uploadthing/server";
import { MediaType } from "@prisma/client";

const f = createUploadthing();

// TODO: support other forms of media
const getMediaType = (file: UploadedFile): MediaType => {
  return MediaType.IMAGE;
};

export const chirpFileRouter = {
  /**
   * Adds media to the most recent chirp
   */
  chirpAddMedia: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 4,
    },
  })
    .middleware(async (req, res) => {
      const session = await getServerSession(req, res, authOptions);
      if (!session) throw new Error("Unauthorized");

      const mostRecentChirpId = await prisma.chirp.findFirst({
        where: { authorId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (!mostRecentChirpId) throw new Error("No chirps found");

      return {
        user: session.user,
        chirpId: mostRecentChirpId.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.chirpMedia.create({
        data: {
          chirpId: metadata.chirpId,
          mediaType: getMediaType(file),
          mediaUrl: file.url,
        },
      });
    }),
} satisfies FileRouter;

export type ChirpFileRouter = typeof chirpFileRouter;
