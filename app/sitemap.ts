import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://africanmarkethub.ca";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.africanmarkethub.ca/api/v1";

  try {
    const [itemsRes, catsRes, blogsRes] = await Promise.all([
      fetch(`${apiUrl}/items`, { cache: "no-store" }),
      fetch(`${apiUrl}/categories`, { cache: "no-store" }),
      fetch(`${apiUrl}/blogs`, { cache: "no-store" }), 
    ]);

    const itemsData = await itemsRes.json();
    const catsData = await catsRes.json();
    const blogsData = await blogsRes.json();

    const items = itemsData.data || [];
    const categories = catsData.data || [];
    const blogs = blogsData.data || [];

    const blogUrls = blogs.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const productUrls = items.map((item: any) => ({
      url: `${siteUrl}/items/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const categoryUrls = categories.map((cat: any) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

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
      { url: `${siteUrl}/blog`, lastModified: new Date(), priority: 0.7 }, 
      ...typeUrls,
      ...categoryUrls,
      ...productUrls,
      ...blogUrls, 
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [{ url: siteUrl, lastModified: new Date() }];
  }
}
