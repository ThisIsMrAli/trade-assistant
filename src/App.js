import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [coins, setCoins] = useState([]);
  const [btcPrice, setBtcPrice] = useState(0);

  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/bitcoin')
      .then(res => {
        setBtcPrice(res.data.market_data.current_price.usd);
      })
      .catch(err => console.log(err));

    axios
      .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then(res => {
        setCoins(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const getLongConditionClass = (coin) => {
    const priceChangeRatio = coin.price_change_percentage_24h / coins[0].price_change_percentage_24h;
    if (priceChangeRatio < 0.95) {
      return 'text-red-500';
    } else if (priceChangeRatio < 1.05) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  };

  const getShortConditionClass = (coin) => {
    const priceChangeRatio = coin.price_change_percentage_24h / coins[0].price_change_percentage_24h;
    if (priceChangeRatio < 0.8) {
      return 'text-red-500';
    } else if (priceChangeRatio < 1.2) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Top 30 Cryptocurrencies by Market Cap</h1>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 pr-3">Rank</th>
            <th className="py-3 pr-3">Name</th>
            <th className="py-3 pr-3">Symbol</th>
            <th className="py-3 pr-3">Price</th>
            <th className="py-3 pr-3">24h %</th>
            <th className="py-3 pr-3">Market Cap</th>
            <th className="py-3 pr-3">Condition</th>
            <th className="py-3 pr-3">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id} className="border-b border-gray-200">
              <td className="py-3 pr-3">{coin.market_cap_rank}</td>
              <td className="py-3 pr-3">{coin.name}</td>
              <td className="py-3 pr-3">{coin.symbol.toUpperCase()}</td>
              <td className="py-3 pr-3">${coin.current_price.toFixed(2)}</td>
              <td className={`py-3 pr-3 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td className={coin.price_change_percentage_24h / coins[0].price_change_percentage_24h < 0.95 ? 'text-red-500' : coin.current_price / coins[0].price_change_percentage_24h < 1.05 ? 'text-yellow-500' : 'text-green-500'}>
                {coin.price_change_percentage_24h / coins[0].price_change_percentage_24h < 0.95 ? 'Underpriced' : coin.price_change_percentage_24h / coins[0].price_change_percentage_24h < 1.05 ? 'Fair value' : 'Overpriced'}
              </td>
              <td className={coin.price_change_percentage_24h / coins[0].price_change_percentage_24h < 0.8 ? 'text-red-500' : coin.price_change_percentage_24h/ coins[0].price_change_percentage_24h < 1.2 ? 'text-yellow-500' : 'text-green-500'}>
                {(Math.round(coin.price_change_percentage_24h / coins[0].price_change_percentage_24h * 100) / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
