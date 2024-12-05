import {
  type CellContext,
  type ColumnDefTemplate,
} from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { Center } from "~/components/ui/center";

export function VisualizationHeader() {
  return <Center>Visualização</Center>;
}

export function VisualizationCell({
  data,
}: {
  data: {
    image?: string | null;
    color?: string | null;
  };
}) {
  const [loading, setLoading] = useState(!!data?.image);
  console.log({ loading, state: !!data.image });

  if (data?.image) {
    return (
      <Center>
        {loading && (
          <div className="size-7 animate-pulse rounded-md bg-primary/10" />
        )}
        <Image
          src={data.image}
          width={28}
          height={28}
          className="rounded-md"
          alt={"Visualização"}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </Center>
    );
  }

  return (
    <Center>
      <div
        className="size-7 rounded-md"
        style={{ backgroundColor: data.color ?? "#ccc" }}
      />
    </Center>
  );
}
