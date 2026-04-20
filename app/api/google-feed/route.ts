import { NextResponse } from "next/server";
import axios from "axios";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    // 1. Fetch data from your backend
    const response = await axios.get(
      "https://api.africanmarkethub.ca/api/v1/items",
      {
        params: {
          limit: 250, // Increase limit to get more products in one go
          offset: 0,
          type: "products", // Ensure we only get products, not services
          status: "active",
          direction: "asc",
        },
      },
    );

    const items = response.data.data;

    // 2. Build the XML String
    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>African Market Hub - Canada Product Feed</title>
    <link>https://africanmarkethub.ca</link>
    <description>Authentic African products in Canada</description>
    ${items
      .map((item: any) => {
        // Clean HTML from description
        const cleanDescription =
          item.description
            ?.replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&/g, "&amp;") || "";

        const primaryImage = item.images?.[0] || "";

        return `
      <item>
        <g:id>${item.sku || item.id}</g:id>
        <g:title>${item.title.replace(/&/g, "&amp;")}</g:title>
        <g:description>${cleanDescription}</g:description>
        <g:link>https://africanmarkethub.ca/items/${item.slug}</g:link>
        <g:image_link>${primaryImage}</g:image_link>
        <g:condition>new</g:condition>
        <g:availability>${item.quantity > 0 ? "in_stock" : "out_of_stock"}</g:availability>
        <g:price>${item.sales_price} CAD</g:price>
        <g:brand>${item.shop?.name || "African Market Hub"}</g:brand>
        <g:google_product_category>${item.category?.name.replace(/&/g, "&amp;")}</g:google_product_category>
        <g:shipping_weight>${item.weight || 0} ${item.weight_unit || "g"}</g:shipping_weight>
        <g:identifier_exists>false</g:identifier_exists>
      </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    // 3. Return as XML
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Feed error:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
