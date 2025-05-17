import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCoins,
  FaExchangeAlt,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaSearch,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

// Country flag components
const CountryFlag = ({ currency }) => {
  const flags = {
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    AED: "🇦🇪",
    TRY: "🇹🇷",
    CAD: "🇨🇦",
    CNY: "🇨🇳",
    AUD: "🇦🇺",
    JPY: "🇯🇵",
    CHF: "🇨🇭",
    KWD: "🇰🇼",
    SAR: "🇸🇦",
    INR: "🇮🇳",
    PKR: "🇵🇰",
    IQD: "🇮🇶",
    QAR: "🇶🇦",
    OMR: "🇴🇲",
    BHD: "🇧🇭",
    AFN: "🇦🇫",
    MYR: "🇲🇾",
    THB: "🇹🇭",
    RUB: "🇷🇺",
    AZN: "🇦🇿",
    AMD: "🇦🇲",
    GEL: "🇬🇪",
    // Add more currency-flag mappings as needed
  };

  return <span className="text-2xl">{flags[currency] || "🌐"}</span>;
};

// Custom animated loading spinner
const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent"
  />
);

function App() {
  const token = "FreegiagajCs23B3SWbor0B3JGFfBvgQ";
  const url = `https://brsapi.ir/Api/Market/Gold_Currency.php?key=${token}`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("gold");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setData(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [url]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-400";
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <FaArrowUp className="inline" />;
    if (change < 0) return <FaArrowDown className="inline" />;
    return <FaEquals className="inline" />;
  };

  const getBgGradient = (change) => {
    if (change > 0) return "from-green-900/30 to-green-800/20";
    if (change < 0) return "from-red-900/30 to-red-800/20";
    return "from-gray-900/30 to-gray-800/20";
  };

  const filteredData = () => {
    if (!data) return [];

    if (activeTab === "gold") {
      return data.gold.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "currency") {
      return data.currency.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "crypto") {
      return data.cryptocurrency.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [];
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <LoadingSpinner />
          <p className="mt-6 text-lg font-medium text-gray-300">
            Loading market data...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 mb-4 rounded-full bg-red-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Connection Error
            </h3>
            <p className="mb-4 text-gray-400">Error: {error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw /> Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 mb-4 rounded-full bg-yellow-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              No Data Available
            </h3>
            <p className="mb-4 text-gray-400">
              Unable to fetch market data at this time.
            </p>
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="relative">
                <GiGoldBar className="text-5xl text-yellow-400 mr-4 z-10 relative" />
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30 -z-10"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
                Financial Market Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                <FaInfoCircle className="text-indigo-400" />
                <span className="text-gray-300 text-sm">
                  Last update:{" "}
                  <span className="font-medium text-white">
                    {data.gold[0]?.date} {data.gold[0]?.time} (Local:{" "}
                    {lastUpdated})
                  </span>
                </span>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className={`p-2 rounded-lg border ${
                  loading
                    ? "border-gray-700 text-gray-500"
                    : "border-indigo-600 text-indigo-400 hover:bg-indigo-900/30"
                } transition-colors`}
              >
                <FiRefreshCw
                  className={`text-lg ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Tabs and Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                className="input w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all"
                placeholder={`Search ${
                  activeTab === "gold"
                    ? "gold"
                    : activeTab === "currency"
                    ? "currency"
                    : "cryptocurrency"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg bg-gray-800 p-1 border border-gray-700 shadow-inner">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                  activeTab === "gold"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("gold")}
              >
                <FaCoins /> Gold & Coins
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                  activeTab === "currency"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("currency")}
              >
                <FaExchangeAlt /> Currency
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                  activeTab === "crypto"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("crypto")}
              >
                <FaCoins /> Cryptocurrency
              </button>
            </div>
          </div>
        </motion.header>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Items</p>
                <h3 className="text-2xl font-bold text-white">
                  {filteredData().length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FaChartBar className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <h3 className="text-2xl font-bold text-white">
                  {data.gold[0]?.time}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                <FaChartLine className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Market Status</p>
                <h3 className="text-2xl font-bold text-white">
                  {new Date().getHours() >= 8 && new Date().getHours() < 17
                    ? "Open"
                    : "Closed"}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                <FaInfoCircle className="text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {filteredData().length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 rounded-xl bg-gray-800/50 border border-gray-700"
          >
            <FaSearch className="text-4xl text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredData().map((item) => (
              <motion.div
                key={item.symbol}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className={`relative overflow-hidden rounded-xl border ${
                  item.change_percent > 0
                    ? "border-green-500/30 hover:border-green-500/50"
                    : item.change_percent < 0
                    ? "border-red-500/30 hover:border-red-500/50"
                    : "border-gray-700 hover:border-gray-600"
                } bg-gradient-to-br ${getBgGradient(
                  item.change_percent
                )} to-gray-900/50 shadow-lg transition-all duration-300 group`}
              >
                {/* Corner accent */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 ${
                    item.change_percent > 0
                      ? "bg-green-500/10"
                      : item.change_percent < 0
                      ? "bg-red-500/10"
                      : "bg-gray-700/10"
                  } transform translate-x-8 translate-y-8 rotate-45`}
                ></div>

                <div className="relative z-10 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`p-3 rounded-lg ${
                          activeTab === "gold"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : activeTab === "currency"
                            ? "bg-indigo-500/10 text-indigo-400"
                            : "bg-purple-500/10 text-purple-400"
                        } mr-3`}
                      >
                        {activeTab === "gold" ? (
                          <FaCoins className="text-xl" />
                        ) : activeTab === "currency" ? (
                          <CountryFlag currency={item.symbol} />
                        ) : (
                          <FaCoins className="text-xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400">{item.symbol}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${getChangeColor(
                        item.change_percent
                      )}`}
                    >
                      {getChangeIcon(item.change_percent)}{" "}
                      {Math.abs(item.change_percent)}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50 group-hover:border-gray-700 transition-colors">
                      <span className="text-sm text-gray-400">Price</span>
                      <span className="font-bold text-white">
                        {formatPrice(item.price)} {item.unit}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Change</span>
                      <span
                        className={`text-sm font-medium ${getChangeColor(
                          item.change_value
                        )}`}
                      >
                        {getChangeIcon(item.change_value)}{" "}
                        {formatPrice(Math.abs(item.change_value))} {item.unit}
                      </span>
                    </div>

                    {activeTab === "crypto" && item.market_cap && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Market Cap
                        </span>
                        <span className="text-sm font-medium text-white">
                          ${formatPrice(item.market_cap)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6 border-t border-gray-800 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-2 md:mb-0">
              designer : Mohammad hoseyn soleymanpour
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
              >
                dedicated to father
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
              >
                Behroz s
              </a>
            </div>
          </div>
          <p className="mt-4 text-gray-600 text-xs">
            © {new Date().getFullYear()} Financial Dashboard. All prices in IRR.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
