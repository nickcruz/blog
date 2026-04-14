"use client";

import { useState } from "react";
import { RiArrowDownSLine, RiCheckLine, RiFileCopyLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PostMarkdownActionsProps = {
  markdown: string;
  markdownHref: string;
};

export function PostMarkdownActions({
  markdown,
  markdownHref,
}: PostMarkdownActionsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <ButtonGroup aria-label="Markdown actions">
      <Button
        aria-label="Copy post as markdown"
        className="rounded-none border-r-0"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <RiCheckLine className="h-4 w-4" /> : <RiFileCopyLine className="h-4 w-4" />}
        {copied ? "Copied" : "Copy as Markdown"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open markdown actions menu"
            className="rounded-none px-3"
            size="icon"
            type="button"
          >
            <RiArrowDownSLine className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href={markdownHref}>View as Markdown</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
