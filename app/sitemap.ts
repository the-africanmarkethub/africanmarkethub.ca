// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://ayokah.co.uk"; 
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.ayokah.co.uk/api/v1";

  try {
    const response = await fetch(`${apiUrl}/items`, {
      cache: "no-store", 
    });

    const result = await response.json(); 
    const items = result.data || [];

    const productUrls = items.map((product: any) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [
      { url: siteUrl, lastModified: new Date(), priority: 1.0 },
      { url: `${siteUrl}/about-us`, lastModified: new Date(), priority: 0.5 },
      ...productUrls,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [{ url: siteUrl, lastModified: new Date() }];
  }
}
