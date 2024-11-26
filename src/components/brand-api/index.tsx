/* eslint-disable @next/next/no-img-element */

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Spinner } from "../ui/spinner";
import { useUploadThing } from "../uploadthing";

interface BrandLogo {
  claimed: boolean;
  brandId: string;
  name: string;
  domain: string;
  icon: string;
  score: number;
  qualityScore: number;
  verified: boolean;
}

interface LogoSearchModalProps {
  query: string;
  onSelect: (imageUrl: string) => void;
}

export const LogoSearchModal: React.FC<LogoSearchModalProps> = ({
  query,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<BrandLogo[]>([]);
  const [loadingIndex, setLoading] = useState(-1);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const file = res[0];
      if (!file) return;
      onSelect(file.url);
      setOpen(false);
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
  });

  async function handleSelect(brand: BrandLogo, index: number) {
    try {
      setLoading(index);
      const response = await fetch(brand.icon);
      const blob = await response.blob();
      const file = new File([blob], "logo.webp", { type: blob.type });
      await startUpload([file]);
      setLoading(-1);
      return file;
    } catch (error) {
      console.error("Error downloading the image:", error);
      return null;
    }
  }

  useEffect(() => {
    fetch(`https://api.brandfetch.io/v2/search/${query}?c=1idDWwrLbKWzGMk-eR0`)
      .then((res) => res.json())
      .then((data: BrandLogo[]) => {
        setResults(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={!query}
        >
          <Search className="mr-2 h-4 w-4" />
          Procurar logo
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md rounded-md">
        <DialogTitle className="mb-4 text-xl font-semibold">
          Resultados para &quot;{query}&quot;
        </DialogTitle>
        <ScrollArea className="h-[300px]">
          {loadingIndex > -1 && (
            <div className="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-primary/10"></div>
          )}
          {results.length > 0 && (
            <ul className="mt-4 space-y-2">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="flex cursor-pointer items-center gap-4 rounded p-2 hover:bg-gray-100"
                  onClick={async () => {
                    await handleSelect(result, index);
                  }}
                >
                  <img
                    src={result.icon}
                    alt={result.name}
                    className="h-8 w-8 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-gray-500">{result.domain}</p>
                  </div>
                  {loadingIndex === index && (
                    <Spinner className="ml-auto h-4 w-4 animate-spin" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export function FormLogoSearch({
  querykey,
  imageKey,
}: {
  querykey: string;
  imageKey: string;
}) {
  const form = useFormContext();
  const query = useWatch({ name: querykey });

  return (
    <LogoSearchModal
      query={query}
      onSelect={(imageUrl) => {
        form.setValue(imageKey, imageUrl);
      }}
    />
  );
}
