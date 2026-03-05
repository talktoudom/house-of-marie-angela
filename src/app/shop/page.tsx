import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

const PAGE_SIZE = 12;

type SearchParams = Record<string, string | string[] | undefined>;

function first(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}

async function getProducts(params: SearchParams) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, images:product_images(*)", { count: "exact" })
    .eq("status", "published");

  const category = first(params.category);
  const search = first(params.search);
  const pageStr = first(params.page);

  if (category && category !== "all") query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);

  const page = parseInt(pageStr || "1", 10);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: products, count } = await query.range(from, to);

  return { products: products || [], total: count || 0, page, category: category || "all", search: search || "" };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { products, total, page, category, search } = await getProducts(params);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const categories = [
    { key: "all", label: "All" },
    { key: "women", label: "Women" },
    { key: "men", label: "Men" },
    { key: "children", label: "Children" },
    { key: "jewelry", label: "Jewelry" },
  ];

  const makeHref = (next: Partial<{ category: string; search: string; page: string }>) => {
    const sp = new URLSearchParams();
    const nextCategory = next.category ?? category;
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? String(page);

    if (nextCategory && nextCategory !== "all") sp.set("category", nextCategory);
    if (nextSearch) sp.set("search", nextSearch);
    if (nextPage && nextPage !== "1") sp.set("page", nextPage);

    const qs = sp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-6 flex-col md:flex-row mb-8">
        <div>
          <h1 className="font-display text-3xl font-normal text-brand-charcoal">Shop</h1>
          <p className="font-sans text-sm text-gray-500 mt-2">
            Browse our curated pieces — fashion, culture, and craftsmanship.
          </p>
        </div>

        <form action="/shop" method="get" className="w-full md:w-[380px]">
          {category !== "all" && <input type="hidden" name="category" value={category} />}
          <div className="flex gap-2">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search products…"
              className="input-field"
            />
            <button className="btn-primary py-2 px-5" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => {
          const active = c.key === category;
          return (
            <Link
              key={c.key}
              href={makeHref({ category: c.key, page: "1" })}
              className={
                active
                  ? "px-4 py-2 text-sm font-sans rounded-full bg-brand-fuchsia text-white"
                  : "px-4 py-2 text-sm font-sans rounded-full border border-gray-200 text-gray-600 hover:border-brand-fuchsia hover:text-brand-fuchsia"
              }
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded p-10 text-center">
          <p className="font-sans text-sm text-gray-500 mb-4">No products found.</p>
          <Link href="/shop" className="btn-outline">
            View all products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p: any) => {
              const img = p.images?.[0]?.secure_url as string | undefined;

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/5] bg-gray-50">
                    {img ? (
                      <Image
                        src={img}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-sans text-xs text-gray-400 uppercase tracking-widest mb-1">
                      {p.category}
                    </p>
                    <h3 className="font-sans text-sm font-medium text-brand-charcoal line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="font-sans text-sm text-brand-charcoal mt-2">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-10">
            <p className="font-sans text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Link
                href={makeHref({ page: String(Math.max(1, page - 1)) })}
                className={`btn-outline py-2 px-4 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
              >
                Prev
              </Link>
              <Link
                href={makeHref({ page: String(Math.min(totalPages, page + 1)) })}
                className={`btn-primary py-2 px-4 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
              >
                Next
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}