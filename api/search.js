export default async function handler(req, res) {

  const query = (req.query.q || "").toLowerCase()

  if (!query) {
    return res.status(400).json({error:"missing query"})
  }

  try {

    const page = await fetch(
      "https://www.broshura.bg/search?q=" + encodeURIComponent(query),
      {
        headers:{
          "User-Agent":"Mozilla/5.0"
        }
      }
    )

    const html = await page.text()

    const results = []

    const blocks = html.split("product-item")

    blocks.forEach(block => {

      const nameMatch = block.match(/title="([^"]+)"/)
      const priceMatch = block.match(/(\d+[.,]\d+)\s?лв/)

      if(nameMatch && priceMatch){

        const name = nameMatch[1]
        const price = parseFloat(priceMatch[1].replace(",","."))
        const storeMatch = block.match(/store-name[^>]*>([^<]+)/)

        const store = storeMatch ? storeMatch[1] : "магазин"

        results.push({
          store:store,
          title:name,
          price:price,
          url:"https://www.broshura.bg/search?q="+encodeURIComponent(query)
        })

      }

    })

    results.sort((a,b)=>a.price-b.price)

    const top3 = results.slice(0,3)

    res.status(200).json({
      query,
      results:top3
    })

  } catch(e){

    res.status(500).json({
      error:"scraping error",
      details:e.toString()
    })

  }

}
