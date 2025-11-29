import React, { useState, useEffect } from "react";
import SearchableSelect from "./SearchableSelect";
import "./App.css";

const App = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [currencies, setCurrencies] = useState({});

  // Fetch all currencies
  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(data));
  }, []);

  // Fetch current exchange rate whenever currency changes
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(
        `https://api.frankfurter.app/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`
      )
        .then((res) => res.json())
        .then((data) => setRate(data.rates[toCurrency]))
        .catch((err) => console.log(err));
    }
  }, [fromCurrency, toCurrency]);

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) return;

    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setResult(`${data.rates[toCurrency]} ${toCurrency}`);
    } catch (error) {
      setResult("Conversion failed.");
    }
  };

  const sortedCurrencies = Object.entries(currencies).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  return (
    <div className="App">
      <h1>🌍 Currency Converter</h1>

      <div className="converter-container">
        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Searchable Dropdowns */}
        <div className="selects">
          <SearchableSelect
            options={sortedCurrencies}
            value={fromCurrency}
            onChange={setFromCurrency}
            label="From"
          />

          <SearchableSelect
            options={sortedCurrencies}
            value={toCurrency}
            onChange={setToCurrency}
            label="To"
          />
        </div>

        {/* Live Exchange Rate */}
        {rate && (
          <div className="rate-box">
            <p>
              1 <strong>{fromCurrency}</strong> ={" "}
              <strong>{rate} {toCurrency}</strong>
            </p>
          </div>
        )}

        {/* Convert Button */}
        <button onClick={handleConvert}>Convert</button>

        {/* Converted Result */}
        {result && <div className="result">Converted: {result}</div>}
      </div>
    </div>
  );
};

export default App;
