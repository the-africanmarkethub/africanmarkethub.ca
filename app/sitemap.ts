// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://ayokah.co.uk";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.ayokah.co.uk/api/v1";

  try {
    // 1. Fetch Items and Categories in parallel for better performance
    const [itemsRes, catsRes] = await Promise.all([
      fetch(`${apiUrl}/items`, { cache: "no-store" }),
      fetch(`${apiUrl}/categories`, { cache: "no-store" }),
    ]);

    const itemsData = await itemsRes.json();
    const catsData = await catsRes.json();

    const items = itemsData.data || [];
    const categories = catsData.data || [];

    // 2. Map Products
    const productUrls = items.map((item: any) => ({
      url: `${siteUrl}/product/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // 3. Map Categories (e.g., /category/electronics)
    const categoryUrls = categories.map((cat: any) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // 4. Define Static Type Pages (Services & Products)
    const typeUrls = ["services", "products"].map((type) => ({
      url: `${siteUrl}/items?type=${type}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    return [
      { url: siteUrl, lastModified: new Date(), priority: 1.0 },
      { url: `${siteUrl}/about-us`, lastModified: new Date(), priority: 0.5 },
      { url: `${siteUrl}/contact-us`, lastModified: new Date(), priority: 0.5 },
      ...typeUrls,
      ...categoryUrls,
      ...productUrls,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [{ url: siteUrl, lastModified: new Date() }];
  }
}
