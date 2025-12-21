// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ayokah.co.uk'

  // 1. Fetch your dynamic data (e.g., from your Laravel API or DB)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`)
  const products = await response.json()

  // 2. Map products to the sitemap format
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updated_at),
  }))

  // 3. Return static pages + dynamic product pages
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about-us`, lastModified: new Date() },
    ...productUrls,
  ]
}