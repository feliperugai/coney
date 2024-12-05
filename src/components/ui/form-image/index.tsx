/* eslint-disable @next/next/no-img-element */
import { useFormContext, useWatch } from "react-hook-form";

import { Camera, ImageIcon, Star, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { FormField } from "~/components/ui/form";
import { Spinner } from "~/components/ui/spinner";
import { type UploadDropzone, UploadModal } from "~/components/uploadthing";
import { cn } from "~/lib/utils";
import { LogoSearchModal } from "./logo-modal";

type UploadProps = Partial<React.ComponentProps<typeof UploadDropzone>> & {
  name: string;
  imageClassName?: string;
  queryKey?: string;
  imageKey?: string;
};

export function FormImage({
  name,
  className,
  queryKey,
  ...props
}: UploadProps) {
  const form = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [openLogoModal, setOpenLogoModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const query = useWatch({ name: queryKey ?? name });

  function stopLoading() {
    setIsLoading(false);
  }

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <div
            className={cn(
              "group relative size-12 cursor-pointer rounded-full hover:bg-slate-600",
              className,
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    {isLoading && <Spinner />}

                    {field.value ? (
                      <Image
                        src={field.value}
                        width={48}
                        height={48}
                        className={cn(
                          "size-12 rounded-full",
                          props.imageClassName,
                        )}
                        alt={"Visualização"}
                        onLoad={stopLoading}
                        onError={stopLoading}
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-full border-2 border-dashed">
                        <ImageIcon className="text-gray-400" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => setOpenLogoModal(true)}
                  disabled={!queryKey || !query}
                >
                  <Star className="mr-1 size-4" />
                  Procurar por marca
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setOpenUploadModal(true)}>
                  <Upload className="mr-1 size-4" />
                  Upload de arquivo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      />

      {queryKey && query && (
        <LogoSearchModal
          open={openLogoModal}
          setOpen={setOpenLogoModal}
          query={query}
          onSelect={(imageUrl) => {
            form.setValue(name, imageUrl);
          }}
        />
      )}

      <UploadModal
        open={openUploadModal}
        setOpen={setOpenUploadModal}
        onUploadComplete={(image) => {
          form.setValue(name, image.url);
        }}
      />
    </>
  );
}
