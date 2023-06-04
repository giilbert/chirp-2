import { useCallback, useState } from "react";
import { TsForm } from "../ui/forms";
import { editProfileSchema } from "@/lib/schemas/user";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import type { z } from "zod";
import { useToast } from "@/lib/use-toast";
import type { Profile } from "@prisma/client";
import Dropzone from "react-dropzone";
import { AspectRatio } from "../ui/aspect-ratio";
import { uploadFiles } from "@/utils/uploadthing-helpers";

export const UserEditProfileForm: React.FC<{
  profile: Profile;
  setOpen: (open: boolean) => void;
}> = ({ profile, setOpen }) => {
  const [url, setUrl] = useState<string | null>(profile.headerUrl || null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const trpcContext = api.useContext();
  const { toast } = useToast();
  const updateProfile = api.user.editProfile.useMutation({
    onError(e) {
      toast({
        title: "Error updating profile",
        description: e.message,
        variant: "destructive",
      });
    },
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof editProfileSchema>) => {
      setLoading(true);
      if (file)
        await uploadFiles([file], "updateHeaderImage").catch((e: Error) => {
          toast({
            title: "Error uploading header",
            description: e.toString(),
            variant: "destructive",
          });
        });

      updateProfile
        .mutateAsync(values)
        .then(() => {
          trpcContext.user.getUserProfileByTag
            .invalidate({
              tag: profile.username,
            })
            .catch(() => 0);
          setOpen(false);
          setLoading(false);
        })
        .catch(() => 0);
    },
    [setOpen, updateProfile, trpcContext, profile, file, toast]
  );

  return (
    <>
      <p className="-mb-2">Header</p>
      <Dropzone
        accept={{
          "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        }}
        multiple={false}
        onDrop={(dropped: File[]) => {
          const file = dropped[0];
          if (!file) return;

          setFile(file);
          setUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return URL.createObjectURL(file);
          });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <AspectRatio ratio={4 / 1}>
            <div
              className="flex h-full w-full cursor-pointer items-center justify-center border-2 border-dashed transition-colors hover:bg-muted/20"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 bg-background/50 text-center text-foreground">
                Drop an image here or click to select
              </p>
              {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} className="h-full w-full border-none" alt="" />
              )}
            </div>
          </AspectRatio>
        )}
      </Dropzone>
      <TsForm
        defaultValues={profile}
        schema={editProfileSchema}
        onSubmit={onSubmit}
        // TODO: add type to inputs
        renderAfter={() => (
          <Button className="mt-4" type="submit" isLoading={loading}>
            Save
          </Button>
        )}
      />
    </>
  );
};
