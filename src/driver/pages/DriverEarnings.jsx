import React, { useState, useEffect } from "react";
import driverApi from "../api/driverApi";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
  Clock,
  Award,
  AlertCircle,
  Moon,
  Sun,
} from "lucide-react";

const DriverEarnings = () => {
  const [earnings, setEarnings] = useState({
    summary: null,
    performance: null,
    payouts: [],
    wallet: null,
  });
  const [loading, setLoading] = useState(true);
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
      const [summaryRes, performanceRes, walletRes, payoutsRes] =
        await Promise.all([
          driverApi.getEarningsSummary(),
          driverApi.getPerformanceMetrics(),
          driverApi.getWalletSummary(), // NEW: Get wallet with hold balance
          driverApi.getPayoutHistory(), // NEW: Get auto-payout history
        ]);

      if (summaryRes.data?.success) {
        setEarnings((prev) => ({ ...prev, summary: summaryRes.data.summary }));
      }
      if (performanceRes.data?.success) {
        setEarnings((prev) => ({ ...prev, performance: performanceRes.data }));
      }
      if (walletRes.data?.success) {
        setEarnings((prev) => ({ ...prev, wallet: walletRes.data.wallet }));
      }
      if (payoutsRes.data?.success) {
        setEarnings((prev) => ({ ...prev, payouts: payoutsRes.data.payouts }));
      }

      calculateNextPayoutTime();
    } catch (error) {
      console.error("Error fetching earnings data:", error);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summary = earnings.summary;
  const performance = earnings.performance;
  const wallet = earnings.wallet || { available: 0, inHold: 0, totalEarned: 0 };
  const payouts = earnings.payouts || [];

  // Check if it's night time (for UI theme)
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 20 || currentHour < 6;

  return (
    <div className="space-y-6">
      {/* Header with time-based greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Earnings</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            {isNightTime ? (
              <Moon className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            {isNightTime ? "Night shift" : "Day shift"} earnings
          </p>
        </div>

        {/* Next Auto-Payout Badge */}
        <div className="mt-4 md:mt-0 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">
                Next Auto-Payout
              </p>
              <p className="text-lg font-bold text-blue-800">Tonight at 2 AM</p>
              <p className="text-xs text-blue-600 mt-1">
                {wallet.available >= 100
                  ? `₹${wallet.available} will be sent in ${timeRemaining}`
                  : `Minimum ₹100 required for payout (current: ₹${wallet.available})`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Summary - Updated with Hold Balance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Available Balance</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(wallet.available)}
              </p>
              <p className="text-blue-100 text-xs mt-2">
                ⏰ Auto-payout tonight at 2 AM
              </p>
            </div>
            <Wallet className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">In Hold (24h)</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(wallet.inHold)}
              </p>
              <p className="text-amber-100 text-xs mt-2">
                ⏳ Releases in 24 hours
              </p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Deliveries</p>
              <p className="text-3xl font-bold mt-2">
                {summary?.total?.totalDeliveries || 0}
              </p>
              <p className="text-green-100 text-xs mt-2">
                +{summary?.today?.deliveries || 0} today
              </p>
            </div>
            <Award className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Earned</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(wallet.totalEarned)}
              </p>
              <p className="text-purple-100 text-xs mt-2">Lifetime earnings</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Hold Information Banner */}
      {wallet.inHold > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">
                ₹{wallet.inHold} is currently in 24-hour hold
              </p>
              <p className="text-sm text-blue-700 mt-1">
                This money will be automatically released to your available
                balance after the hold period completes. No action needed from
                you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Today's Performance
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Today's Earnings</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(summary?.today?.earnings || 0)}
                </span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-500">Deliveries:</span>
                <span className="font-medium">
                  {summary?.today?.deliveries || 0}
                </span>
                <span className="text-gray-500 ml-2">Tips:</span>
                <span className="font-medium">
                  {formatCurrency(summary?.today?.tips || 0)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summary?.week?.earnings || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {summary?.week?.deliveries || 0} deliveries
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summary?.month?.earnings || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {summary?.month?.deliveries || 0} deliveries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Performance Metrics
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Avg. Delivery Time
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {performance?.metrics?.averageDeliveryTime
                  ? `${Math.round(performance.metrics.averageDeliveryTime)} min`
                  : "N/A"}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-gray-50 to-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Avg. Rating
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {performance?.metrics?.averageRating?.toFixed(1) || "N/A"}
                <span className="text-yellow-500 ml-1">★</span>
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  Total Distance
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {performance?.metrics?.totalDistance
                  ? `${Math.round(performance.metrics.totalDistance)} km`
                  : "N/A"}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-gray-50 to-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">
                  Peak Hour
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {performance?.peakHours?.[0]?._id || "N/A"}:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Payout History - REPLACES Withdrawal History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Auto-Payout History
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Payments automatically sent to your UPI/bank account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium">
                ⚡ Auto-payout daily at 2 AM
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UTR
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payout.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {payout.method === "UPI" ? "UPI" : "Bank Transfer"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payout.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : payout.status === "PROCESSING"
                                ? "bg-blue-100 text-blue-800"
                                : payout.status === "FAILED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">
                        {payout.utr || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No payout history yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your earnings will be automatically sent to your UPI account
                every night at 2 AM. Complete deliveries to start earning!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* UPI Settings Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Payout Settings
            </h3>
            <p className="text-sm text-gray-600">
              Money is automatically sent to your UPI ID every night at 2 AM
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/driver/settings")}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Update UPI
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current UPI ID</span>
            <span className="font-mono font-medium">
              {earnings.wallet?.payoutSettings?.destination?.upiId || "Not set"}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>
            Minimum payout amount: ₹100. Auto-payout runs daily at 2 AM.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;
