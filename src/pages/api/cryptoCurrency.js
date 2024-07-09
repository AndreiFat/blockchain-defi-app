export default async function handler(req, res) {
    const listingsUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=11`;
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY,
    };

    try {
        const listingsResponse = await fetch(listingsUrl, {headers});
        if (!listingsResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const listingsData = await listingsResponse.json();

        const ids = listingsData.data.map(crypto => crypto.id).join(',');
        const infoUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids}`;
        const infoResponse = await fetch(infoUrl, {headers});
        if (!infoResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const infoData = await infoResponse.json();

        // Merge listing data with info data
        const mergedData = listingsData.data.map(crypto => ({
            ...crypto,
            logo: infoData.data[crypto.id].logo
        }));

        res.status(200).json(mergedData);
    } catch (error) {
        res.status(500).json({error: 'Error fetching data from CoinMarketCap'});
    }
}
