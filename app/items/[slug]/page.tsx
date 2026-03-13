import { Metadata } from "next";
import ItemDetail from "../components/ItemDetail";
import { getItemDetail } from "@/lib/api/items";
import { IoChevronForward } from "react-icons/io5";
import Link from "next/link";

type PageParams = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  try {
    const response = await getItemDetail(slug);
    const product = response.data.product;

    const description = product.description
      ?.replace(/<\/?[^>]+(>|$)/g, "")
      .slice(0, 155);

    const seoKeywords = Array.isArray(product.keywords)
      ? product.keywords
      : product.keywords?.split(",").map((k: any) => k.trim()) || [];

    return {
      title: `${product.title} | African Market Hub`,
      description: description,
      keywords: seoKeywords,
      alternates: {
        canonical: `https://ayokah.com/items/${slug}`,
      },
      openGraph: {
        title: product.title,
        description: product.meta_description || description,
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
        description: product.meta_description || description,
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

    const star_rating = response.data.star_rating ?? { total: 0, reviews: [] };

    // --- Unified Structured Data ---
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: product.images,
      description: product.description?.replace(/<\/?[^>]+(>|$)/g, ""),
      sku: product.sku || `SKU-${product.id}`,
      brand: {
        "@type": "Brand",
        name: "African Market Hub",
      },
      offers: {
        "@type": "Offer",
        url: `https://africanmarkethub.ca/items/${product.slug}`,
        priceCurrency: "GBP", // Use your actual currency
        price: product.sales_price,
        itemCondition: "https://schema.org/NewCondition",
        availability:
          product.quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      ...(star_rating.total > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.average_rating || 0,
          reviewCount: star_rating.total,
        },
      }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://africanmarkethub.ca",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.category.name,
          item: `https://africanmarkethub.ca/items?category=${product.category.slug}`,
        },
        { "@type": "ListItem", position: 3, name: product.title },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <nav className="my-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="inline-flex ml-4 list-none">
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
                href={`/items?category=${product.category.slug}`}
                className="truncate text-hub-primary hover:text-hub-secondary"
              >
                {product.category.name}
              </Link>
              <span className="mx-2">
                <IoChevronForward />
              </span>
            </li>
            <li
              className="min-w-0 font-semibold truncate text-hub-primary max-w-40 md:max-w-80 lg:max-w-120"
              aria-current="page"
            >
              {product.title}
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
      <div className="p-10 font-medium text-center text-red-500">
        Failed to load product.
      </div>
    );
  }
}
