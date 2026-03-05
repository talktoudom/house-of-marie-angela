import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function WomenPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const spObj = await searchParams; // unwrap Promise

  const sp = new URLSearchParams();

  // Copy existing query params safely
  for (const [key, value] of Object.entries(spObj || {})) {
    if (typeof value === "string") sp.set(key, value);
    else if (Array.isArray(value) && value[0]) sp.set(key, value[0]);
  }

  // Force category=women
  sp.set("category", "women");

  redirect(`/shop?${sp.toString()}`);
}
