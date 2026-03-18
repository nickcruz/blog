import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* eslint-disable @next/next/no-img-element */

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
  img: ({ alt, src, ...props }) => (
    <img
      alt={alt ?? ""}
      className="w-full"
      loading="lazy"
      src={src}
      {...props}
    />
  ),
};

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
