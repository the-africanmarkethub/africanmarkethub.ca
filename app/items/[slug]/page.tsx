import { Metadata } from "next";
import ItemDetail from "../components/ItemDetail";
import { getItemDetail } from "@/lib/api/items";
import { IoChevronForward } from "react-icons/io5";
import Link from "next/link";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  // const { slug } = params;
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  try {
    const response = await getItemDetail(slug);
    const product = response.data.product;
    const description = product.description
      ?.replace(/<\/?[^>]+(>|$)/g, "") // strip HTML
      .slice(0, 155);
    return {
      title: `${product.title} | Ayokah Foods and Services`,
      description: description,

      openGraph: {
        title: product.title,
        description:
          product.meta_description || product.description?.slice(0, 155),
        type: "website",
        images: product.images?.map((img: string) => ({
          url: img,
          width: 1200,
          height: 630,
        })),
      },

      twitter: {
        card: "summary_large_image",
        title: product.title,
        description:
          product.meta_description || product.description?.slice(0, 155),
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch {
    return {
      title: "Product not found",
      description: "This product does not exist.",
    };
  }
}
type PageParams = {
  params: {
    slug: string;
  };
};

export default async function ItemDetailPage({ params }: PageParams) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  try {
    const response = await getItemDetail(slug);

    const product = response.data.product;
    const reviews = response.data.star_rating?.reviews ?? [];
    const recommended = response.data.recommended ?? [];
    const frequentlyBoughtTogether =
      response.data.frequently_bought_together ?? [];
    const otherViews = response.data.otherViews ?? [];
    const customerAlsoViewed = response.data.customerAlsoViewed ?? [];

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: product.images,
      description: product.description,
      sku: product.sku || product.id,
      brand: {
        "@type": "Brand",
        name: "Ayokah Foods and Services",
      },
      offers: {
        "@type": "Offer",
        url: `https://ayokah.co.uk/items/${product.slug}`,
        priceCurrency: "GBP",
        price: product.sales_price,
        itemCondition: "https://schema.org/NewCondition",
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      aggregateRating:
        product.average_rating > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: product.average_rating,
              reviewCount: product.reviews?.length || 0,
            }
          : undefined,
    };
    const star_rating = response.data.star_rating ?? { total: 0, reviews: [] };

    return (
      <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
        <nav className="text-sm text-gray-500 my-4" aria-label="Breadcrumb">
          <ol className="list-none ml-4 inline-flex">
            {/* Home Link */}
            <li className="flex items-center">
              <Link
                href="/"
                className="text-hub-primary hover:text-hub-secondary"
              >
                Home
              </Link>
              <span className="mx-2">
                <IoChevronForward />
              </span>
            </li>

            <li className="flex items-center min-w-0">
              <Link
                href={`/items?category=${product.category.slug}&type=${product.type}`}
                className="text-hub-primary hover:text-hub-secondary min-w-0"
              >
                <span className="truncate block max-w-25 sm:max-w-50">
                  {product.category.name}
                </span>
              </Link>
              <span className="mx-2 shrink-0">
                {" "}
                <IoChevronForward />
              </span>
            </li>

            {/* Current Product (Active) */}
            <li
              className="text-gray-700 font-semibold min-w-0"
              aria-current="page"
            >
              <span className="truncate block max-w-37.5 sm:max-w-full">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>
        <ItemDetail
          product={product}
          reviews={reviews}
          star_rating={star_rating}
          recommended={recommended}
          frequentlyBoughtTogether={frequentlyBoughtTogether}
          otherViews={otherViews}
          customerAlsoViewed={customerAlsoViewed}
        />
      </>
    );
  } catch {
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Failed to load product.
      </div>
    );
  }
}
