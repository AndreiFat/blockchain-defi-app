export default async function handler(req, res) {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH`;
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY,
    };

    try {
        const response = await fetch(url, {headers});
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const ethPriceInUSD = data.data.ETH.quote.USD.price;
        res.status(200).json({price: ethPriceInUSD});
    } catch (error) {
        res.status(500).json({error: 'Error fetching data from CoinMarketCap'});
    }
}