export default async function handler(req, res) {

  const query = req.query.q || "";

  const results = [
    {
      store: "Lidl",
      title: query,
      price: "провери офертата",
      url: `https://www.google.com/search?q=Lidl+${query}+оферта`
    },
    {
      store: "Kaufland",
      title: query,
      price: "провери офертата",
      url: `https://www.google.com/search?q=Kaufland+${query}+оферта`
    },
    {
      store: "Billa",
      title: query,
      price: "провери офертата",
      url: `https://www.google.com/search?q=Billa+${query}+оферта`
    }
  ];

  res.status(200).json({
    query,
    results
  });

}
