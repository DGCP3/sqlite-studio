import "react-data-grid/lib/styles.css";

import { useQuery } from "@tanstack/react-query";
import { createLazyRoute } from "@tanstack/react-router";
import { useState } from "react";
import DataGrid from "react-data-grid";

import { fetchQuery } from "@/api";
import { Editor } from "@/components/editor";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/provider/theme.provider";

export const Route = createLazyRoute("/query")({
  component: Query,
});

function Query() {
  const currentTheme = useTheme();
  const [code, setCode] = useState("select 1 + 1");

  const { data, error } = useQuery({
    queryKey: ["query", code],
    queryFn: () => fetchQuery(code),
  });
  const grid = !data ? (
    !error && <Skeleton className="w-full h-[300px]" />
  ) : (
    <DataGrid
      columns={data.columns.map((col) => ({ key: col, name: col }))}
      rows={data.rows.map((row) =>
        row.reduce((acc, curr, i) => {
          acc[data.columns[i]] = curr;
          return acc;
        }, {}),
      )}
      className={cn(currentTheme === "light" ? "rdg-light" : "rdg-dark")}
    />
  );

  return (
    <>
      <div className="grid gap-2 grid-cols-1">
        <Editor value={code} onChange={(v) => setCode(v)} />
      </div>

      {grid}
    </>
  );
}
