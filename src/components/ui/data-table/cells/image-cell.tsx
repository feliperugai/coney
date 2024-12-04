import Image from "next/image";
import { useState } from "react";

type ImageCellProps = {
  src?: string | null;
  color?: string | null;
  description?: string;
};

export function ImageCell({ src, color, description }: ImageCellProps) {
  const [loading, setLoading] = useState(!!src);

  if (!src) {
    return (
      <div className="flex items-center gap-4">
        {color && (
          <div
            className="size-7 items-center justify-center rounded-md"
            style={{ backgroundColor: color }}
          />
        )}
        {description}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {loading && (
        <div className="size-7 animate-pulse rounded-md bg-primary/10" />
      )}
      <Image
        src={src}
        width={28}
        height={28}
        className="rounded-md"
        alt={"Visualização"}
        onLoadingComplete={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
      {description}
    </div>
  );
}
