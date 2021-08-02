const fetch = require('node-fetch');

class ServiceClient {
    constructor(host) {
        this.host = host;
    }

    getLatestCoinData = async (slug) => {
        const formattedSlug = slug.toLowerCase();

        try { 
            const response = await fetch(`${this.host}/latest/${formattedSlug}`, {
                "method": "GET",
            })
            
            const json = await response.json();
            
            const name = json["coinData"][0].name
            const price = json["coinData"][0].quote.USD.price;
            
            
            const supply = json["coinData"][0].total_supply
            const lastupdated = json["coinData"][0].last_updated;
            const logoUrl =  json["logoJson"].data[Object.keys(json["logoJson"].data)[0]].logo
            
            return [true, `-------*${name}*------- \n *price:* $${price} \n *total supply:* ${supply} \n *last updated:* ${lastupdated}`, logoUrl];
        
        } catch(err) {
            console.log(err)
            return [false, `Could not find info on that coin. Check your spelling!`];
        }
    }

    getTopTen = async (sortBy, sortDir, limit) => {
        try {
            const searchFilters = JSON.stringify({
                sortBy: sortBy,
                sortDir: sortDir,
                limit: limit
            });

            const response = await fetch(`${this.host}/latest/`, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": searchFilters
            })
            
            const dataList = await response.json();
            
            const items = dataList.map(item => `name: ${item.name} | price: $${item.quote.USD.price} | total supply: ${item.total_supply} | last updated: ${item.last_updated} \n\n`);
            
            return [true, items.slice(0, 10)]
        } catch (err) {
            console.log(err)
            return [false, `Request failed! try again.`]
        }




    }

    formatPrice = (price) => {

    }
}

module.exports = ServiceClient;
