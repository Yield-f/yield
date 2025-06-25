// // app/api/news/route.ts
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const res = await fetch(
//       `https://newsapi.org/v2/everything?q=cryptocurrency OR bitcoin OR ethereum OR defi OR nft&language=en&pageSize=30&sortBy=popularity&apiKey=ac43febbeda9455c9a4a614cba1c997f`,
//       { next: { revalidate: 3600 } } // Cache for 1 hour
//     );
//     if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
//     const data = await res.json();
//     console.log("NewsAPI response:", data);
//     return NextResponse.json({ results: data.articles });
//   } catch (error) {
//     console.error("Failed to fetch news:", error);
//     return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Calculate the 'from' date (e.g., 1 day ago)
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1); // 1 day ago
    const from = fromDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const res = await fetch(
      `https://newsapi.org/v2/everything?q="cryptocurrency" OR "bitcoin" OR "ethereum" OR "decentralized finance" OR "nft" -stock -politics -entertainment&language=en&from=${from}&pageSize=30&sortBy=publishedAt&apiKey=ac43febbeda9455c9a4a614cba1c997f`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
    const data = await res.json();
    console.log("NewsAPI response:", data);
    return NextResponse.json({ results: data.articles });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}
