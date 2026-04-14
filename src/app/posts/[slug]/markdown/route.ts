import { getAllPostSlugs, getPostBySlug, serializePostToMarkdown } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/posts/[slug]/markdown">,
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(serializePostToMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
