import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function ButtonGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-stretch", className)}
      data-slot="button-group"
      role="group"
      {...props}
    />
  );
}

export { ButtonGroup };
