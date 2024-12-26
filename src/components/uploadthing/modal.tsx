import React from "react";
import { type ClientUploadedFileData } from "uploadthing/types";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { UploadDropzone } from "~/components/uploadthing";

interface UploadModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUploadComplete: (
    image: ClientUploadedFileData<{ uploadedBy: string }>,
  ) => void;
}

export function UploadModal({
  onUploadComplete,
  open,
  setOpen,
}: UploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="mb-4 text-xl font-semibold">Upload</DialogTitle>
        <UploadDropzone
          className="cursor-pointer"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);
            const image = res[0];
            if (!image) return;
            onUploadComplete(image);
            setOpen(false);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
