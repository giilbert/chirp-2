import type { ChirpFileRouter } from "@/server/uploadthing";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<ChirpFileRouter>();
