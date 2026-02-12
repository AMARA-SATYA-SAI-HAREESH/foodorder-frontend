import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Moon,
  Sun,
} from "lucide-react";
import vendorApi from "../api/vendorApi";

const VendorEarnings = () => {
  const [earnings, setEarnings] = useState({
    summary: null,
    transactions: [],
    wallet: null,
    payouts: [],
  });
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [rangeEarnings, setRangeEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    fetchEarningsData();

    // Update countdown every minute
    const timer = setInterval(() => {
      calculateNextPayoutTime();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);

      // Use new payout API endpoints
      const [summaryRes, walletRes, payoutsRes, transactionsRes] =
        await Promise.all([
          vendorApi.getEarningsSummary(),
          vendorApi.getWalletSummary(), // NEW: Get wallet with hold balance
          vendorApi.getPayoutHistory(), // NEW: Get auto-payout history
          vendorApi.getRecentTransactions(20),
        ]);

      if (summaryRes.data?.status) {
        setEarnings((prev) => ({ ...prev, summary: summaryRes.data.earnings }));
      }
      if (walletRes.data?.success) {
        setEarnings((prev) => ({ ...prev, wallet: walletRes.data.wallet }));
      }
      if (payoutsRes.data?.success) {
        setEarnings((prev) => ({ ...prev, payouts: payoutsRes.data.payouts }));
      }
      if (transactionsRes.data?.status) {
        setEarnings((prev) => ({
          ...prev,
          transactions: transactionsRes.data.transactions,
        }));
      }

      calculateNextPayoutTime();
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPayoutTime = () => {
    const now = new Date();
    const nextPayout = new Date();
    nextPayout.setHours(2, 0, 0, 0); // 2 AM

    if (now > nextPayout) {
      nextPayout.setDate(nextPayout.getDate() + 1);
    }

    const diff = nextPayout - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTimeRemaining(`${hours}h ${minutes}m`);
  };

  const handleDateRangeSubmit = async (e) => {
    e.preventDefault();
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      setRangeLoading(true);
      const response = await vendorApi.getEarningsByDateRange(dateRange);
      if (response.data.status) {
        setRangeEarnings(response.data);
        setActiveTab("custom");
      }
    } catch (error) {
      console.error("Error fetching range earnings:", error);
      alert("Failed to fetch earnings for selected date range");
    } finally {
      setRangeLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getTimeframeTabs = () => [
    { id: "overview", label: "Overview" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "custom", label: "Custom Range" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const wallet = earnings.wallet || { available: 0, inHold: 0, totalEarned: 0 };
  const summary = earnings.summary;
  const transactions = earnings.transactions || [];
  const payouts = earnings.payouts || [];

  // Check if it's night time
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 20 || currentHour < 6;

  return (
    <div className="space-y-6">
      {/* Header with time-based greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Restaurant Earnings
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Commission: {summary?.thisMonth?.commissionRate || 15}%
            </span>
          </div>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            {isNightTime ? (
              <Moon className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            Track your revenue and payouts
          </p>
        </div>

        {/* Next Auto-Payout Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Next Auto-Payout</p>
              <p className="text-xl font-bold">Tonight at 2 AM</p>
              <p className="text-xs text-blue-100 mt-1">
                {wallet.available >= 100
                  ? `${formatCurrency(wallet.available)} will be sent in ${timeRemaining}`
                  : `Minimum ₹100 required for payout`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Summary - Updated with Wallet Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Available Balance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(wallet.available)}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Auto-payout tonight at 2 AM
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* In Hold Balance - NEW */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">In Hold (24h)</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(wallet.inHold)}
              </p>
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Releases automatically in 24h
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(summary?.today?.netEarnings || 0)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-gray-500">Orders:</span>
                <span className="font-medium">
                  {summary?.today?.orderCount || 0}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-xs space-y-1 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">Gross:</span>
              <span className="font-medium text-gray-700">
                {formatCurrency(summary?.today?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Commission:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(summary?.today?.commissionAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(wallet.totalEarned)}
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Building className="w-3 h-3" />
                Lifetime revenue
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Hold Information Banner */}
      {wallet.inHold > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900 text-lg">
                    ₹{wallet.inHold.toLocaleString("en-IN")} in 24-hour hold
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    This money will be automatically added to your available
                    balance after the hold period completes. You don't need to
                    do anything.
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-xs font-medium text-blue-700">
                    Auto-releases in 24h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {getTimeframeTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Custom Date Range Form */}
          {activeTab === "custom" && (
            <div className="mb-8">
              <form
                onSubmit={handleDateRangeSubmit}
                className="flex flex-col sm:flex-row gap-4 items-end"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={rangeLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    {rangeLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Loading...
                      </span>
                    ) : (
                      "Apply Filter"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Earnings Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeTab === "custom" && rangeEarnings ? (
                  rangeEarnings.earnings.map((day) => (
                    <tr key={day._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(day._id).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {day.orderCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(day.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        -
                        {formatCurrency(
                          (day.totalAmount * rangeEarnings.commissionRate) /
                            100,
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatCurrency(
                          day.totalAmount -
                            (day.totalAmount * rangeEarnings.commissionRate) /
                              100,
                        )}
                      </td>
                    </tr>
                  ))
                ) : activeTab === "overview" ? (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        Today
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {summary?.today?.orderCount || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(summary?.today?.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        -{formatCurrency(summary?.today?.commissionAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatCurrency(summary?.today?.netEarnings || 0)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        Yesterday
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {summary?.yesterday?.orderCount || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(summary?.yesterday?.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        -
                        {formatCurrency(
                          summary?.yesterday?.commissionAmount || 0,
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatCurrency(summary?.yesterday?.netEarnings || 0)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        This Month
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {summary?.thisMonth?.orderCount || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(summary?.thisMonth?.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        -
                        {formatCurrency(
                          summary?.thisMonth?.commissionAmount || 0,
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatCurrency(summary?.thisMonth?.netEarnings || 0)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <PieChart className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">
                          Select a timeframe to view detailed earnings
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Choose from Today, This Week, This Month, or Custom
                          Range
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Row for Custom Range */}
          {activeTab === "custom" && rangeEarnings?.totals && (
            <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">
                    {rangeEarnings.totals.orderCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gross Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(rangeEarnings.totals.totalAmount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Commission</p>
                  <p className="text-xl font-bold text-red-600">
                    -
                    {formatCurrency(rangeEarnings.totals.commissionAmount || 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({rangeEarnings.commissionRate}%)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Net Earnings</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(rangeEarnings.totals.netEarnings || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Avg per Order</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(
                      (rangeEarnings.totals.totalAmount || 0) /
                        Math.max(rangeEarnings.totals.orderCount || 1, 1),
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions & Payout History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Recent Transactions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.method === "COD"
                            ? "bg-green-100"
                            : transaction.method === "CARD"
                              ? "bg-blue-100"
                              : "bg-purple-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-5 h-5 ${
                            transaction.method === "COD"
                              ? "text-green-600"
                              : transaction.method === "CARD"
                                ? "text-blue-600"
                                : "text-purple-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Order #{transaction.id.slice(-6)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{transaction.customer}</span>
                          <span>•</span>
                          <span>{transaction.method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent transactions</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View All Transactions
            </button>
          </div>
        </div>

        {/* Auto-Payout History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Payout History
              </h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium">
                ⚡ Auto-payout daily at 2 AM
              </span>
            </div>
          </div>
          <div className="p-6">
            {payouts.length > 0 ? (
              <div className="space-y-4">
                {payouts.slice(0, 5).map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(payout.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(payout.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payout.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : payout.status === "PROCESSING"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payout.status}
                      </span>
                      {payout.utr && (
                        <p className="text-xs font-mono text-gray-500 mt-1">
                          UTR: {payout.utr}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All Payouts →
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-900 font-medium mb-2">No payouts yet</p>
                <p className="text-sm text-gray-500">
                  Your earnings will be automatically sent to your bank account
                  every night at 2 AM
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-4">
            Payment Methods
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">COD</span>
              <span className="font-semibold text-blue-900">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-800">Card</span>
              <span className="font-semibold text-blue-900">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-800">UPI</span>
              <span className="font-semibold text-blue-900">10%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-sm font-medium text-purple-900 mb-4">
            Commission Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-800">Current Rate</span>
              <span className="font-semibold text-purple-900">
                {summary?.thisMonth?.commissionRate || 15}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-800">Total Paid</span>
              <span className="font-semibold text-purple-900">
                {formatCurrency(summary?.allTime?.commissionAmount || 0)}
              </span>
            </div>
            <button className="w-full mt-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-300">
              View Commission Breakdown
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-sm font-medium text-emerald-900 mb-4">
            Payout Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-emerald-900">
                  Auto-payout enabled
                </p>
                <p className="text-xs text-emerald-700">Daily at 2 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-emerald-900">Processing time</p>
                <p className="text-xs text-emerald-700">
                  2-4 hours after payout
                </p>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors border border-emerald-300">
              Update Bank Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorEarnings;
