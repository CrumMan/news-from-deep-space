import Link from "next/link";

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default function Home(){
  return (
  <main>
    <div className="App">
      <header className="App-header">
        <h1>News from Deep Space</h1>
        <p>
          Welcome to your news aggregator.
        </p>
      </header>
    </div>
  </main>
  );

}