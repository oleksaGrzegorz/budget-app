import { useEffect, useState } from "react";

export function BitcoinPrice() {
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(Number(data.p).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }));
    };

    return () => ws.close();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-lg">
      <p className="text-xs text-slate-300">BTC / USDT</p>
      <p className="text-xl font-bold">
        {price ?? "Ładowanie..."}
      </p>
    </div>
  );
}