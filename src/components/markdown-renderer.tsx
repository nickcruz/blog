"use client";

import { useEffect, useState } from "react";
import type { Root } from "mdast";
import rehypePrism from "rehype-prism-plus";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

/* eslint-disable @next/next/no-img-element */

type MarkdownRendererProps = {
  content: string;
};

function remarkTakeawaysDirective() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        typeof node !== "object" ||
        node === null ||
        !("type" in node) ||
        !("name" in node) ||
        node.type !== "containerDirective" ||
        node.name !== "takeaways"
      ) {
        return;
      }

      const data =
        "data" in node && typeof node.data === "object" && node.data !== null
          ? node.data
          : {};

      Object.assign(node, {
        data: {
          ...data,
          hName: "aside",
          hProperties: {
            className: ["markdown-takeaways"],
          },
        },
      });
    });
  };
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [expandedImage, setExpandedImage] = useState<{
    alt: string;
    src: string;
  } | null>(null);

  useEffect(() => {
    if (!expandedImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedImage]);

  const components: Components = {
    a: ({ href, ...props }) => {
      const isExternal =
        typeof href === "string" &&
        (href.startsWith("http://") || href.startsWith("https://"));

      return (
        <a
          href={href}
          rel={isExternal ? "noreferrer noopener" : undefined}
          target={isExternal ? "_blank" : undefined}
          {...props}
        />
      );
    },
    img: ({ alt, src, ...props }) => {
      if (typeof src !== "string") {
        return null;
      }

      return (
        <button
          aria-label={`Open image${alt ? `: ${alt}` : ""}`}
          className="markdown-image-trigger"
          onClick={() => setExpandedImage({ alt: alt ?? "", src })}
          type="button"
        >
          <img
            alt={alt ?? ""}
            className="w-full"
            loading="lazy"
            src={src}
            {...props}
          />
        </button>
      );
    },
  };

  return (
    <>
      <ReactMarkdown
        components={components}
        rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
        remarkPlugins={[
          remarkGfm,
          remarkDirective,
          remarkTakeawaysDirective,
        ]}
      >
        {content}
      </ReactMarkdown>

      {expandedImage ? (
        <div
          aria-modal="true"
          className="image-overlay"
          onClick={() => setExpandedImage(null)}
          role="dialog"
        >
          <button
            aria-label="Close image"
            className="image-overlay__close"
            onClick={() => setExpandedImage(null)}
            type="button"
          >
            Close
          </button>
          <div className="image-overlay__viewport">
            <div
              className="image-overlay__content"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                alt={expandedImage.alt}
                className="image-overlay__image"
                src={expandedImage.src}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
