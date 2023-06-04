import Dropzone from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export const ChirpMediaUpload: React.FC<
  React.PropsWithChildren<{
    files: { file: File; url: string }[];
    setFiles: (files: { file: File; url: string }[]) => void;
  }>
> = ({ files, setFiles, children }) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Media</DialogTitle>
        </DialogHeader>

        <div>
          <div className="mb-2 flex max-h-[20rem] flex-col gap-2 overflow-y-auto">
            {files.map(({ file, url }) => (
              <div key={file.name} className="flex flex-col gap-2">
                <div className="flex items-center">
                  <FileImageIcon className="mr-2" />
                  <span>{file.name}</span>

                  <Button
                    className="ml-auto"
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      URL.revokeObjectURL(url);
                      const newFiles = files.filter((f) => f.file !== file);
                      setFiles(newFiles);
                    }}
                  >
                    Remove
                  </Button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} className="w-full" alt={file.name} />
              </div>
            ))}
          </div>
          <Dropzone
            accept={{
              "image/*": [".png", ".jpg", ".jpeg", ".webp"],
            }}
            onDrop={(dropped) => {
              const droppedFiles = dropped.map((file) => ({
                file,
                url: URL.createObjectURL(file),
              }));

              const newFiles = [...files, ...droppedFiles];
              const firstFour = newFiles.slice(0, 4);
              const rest = newFiles.slice(4);

              setFiles(firstFour);
              rest.forEach(({ url }) => URL.revokeObjectURL(url));
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="flex h-32 w-full cursor-pointer items-center justify-center border-2 border-dashed transition-colors hover:bg-muted/20"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <p className="text-muted-foreground">
                  Drop images here or click to select
                </p>
              </div>
            )}
          </Dropzone>
        </div>
      </DialogContent>
    </Dialog>
  );
};
