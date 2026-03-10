export default async function handler(req, res) {

  const query = (req.query.q || "").toLowerCase()

  if (!query) {
    return res.status(400).json({ error: "missing query" })
  }

  try {

    const response = await fetch("https://www.broshura.bg/", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const html = await response.text()

    const products = []

    const items = html.split("product")

    items.forEach(item => {

      const nameMatch = item.match(/title="([^"]+)"/)
      const priceMatch = item.match(/(\d+[.,]\d+)/)
      const storeMatch = item.match(/store[^>]*>([^<]+)/)

      if (nameMatch && priceMatch) {

        const name = nameMatch[1].toLowerCase()

        if (name.includes(query)) {

          const price = parseFloat(priceMatch[1].replace(",", "."))

          const store = storeMatch ? storeMatch[1] : "магазин"

          products.push({
            store: store,
            title: name,
            price: price,
            url: "https://www.broshura.bg/"
          })

        }
      }

    })

    products.sort((a, b) => a.price - b.price)

    res.status(200).json({
      query,
      results: products.slice(0, 3)
    })

  } catch (err) {

    res.status(500).json({
      error: "scraping failed",
      details: err.toString()
    })

  }

}
