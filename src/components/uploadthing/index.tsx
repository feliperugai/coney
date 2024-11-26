/* eslint-disable @next/next/no-img-element */
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { useFormContext } from "react-hook-form";

import { generateReactHelpers } from "@uploadthing/react";
import Image from "next/image";
import { useState } from "react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
import { cn } from "~/lib/utils";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { Spinner } from "../ui/spinner";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

type UploadProps = Partial<React.ComponentProps<typeof UploadDropzone>> & {
  name: string;
  imageClassName?: string;
};

export function FormDropzone({ name, className, ...props }: UploadProps) {
  const form = useFormContext();
  const [isLoading, setIsLoading] = useState(false); // Estado para gerenciar o loading

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className={cn(className)}>
          {field.value ? (
            <div className="flex items-center justify-center">
              {isLoading && <Spinner />}
              <Image
                src={field.value}
                width={48}
                height={48}
                className={cn("size-12 rounded-full", props.imageClassName)}
                alt={"Visualização"}
                onLoadingComplete={() => {
                  console.log("onLoadingComplete");
                  setIsLoading(false);
                }} // Desativa o loading quando a imagem carregar
                onLoad={() => {
                  console.log("onLoad");
                  setIsLoading(false);
                }} // Ativa o loading quando começar a carregar
                onError={() => {
                  console.log("onError");
                  setIsLoading(false);
                }} // Caso ocorra erro no ca
              />
            </div>
          ) : (
            <FormItem>
              <UploadDropzone
                className="cursor-pointer"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  const image = res[0];
                  if (!image) return;
                  field.onChange(image.url);
                  setIsLoading(true);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                {...props}
              />
              <FormMessage />
            </FormItem>
          )}
        </div>
      )}
    />
  );
}
