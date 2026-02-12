import React, { useState, useEffect } from "react";
import {
  Wallet,
  Clock,
  CheckCircle,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { useVendor } from "../context/VendorContext";
import vendorApi from "../api/vendorApi";

const WithdrawalRequest = () => {
  const { vendor } = useVendor();
  const [balance, setBalance] = useState({ available: 0, pending: 0 });
  const [withdrawals, setWithdrawals] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    amount: "",
    method: "BANK_TRANSFER",
    accountId: "",
  });

  useEffect(() => {
    fetchWithdrawalData();
  }, []);

  const fetchWithdrawalData = async () => {
    try {
      setLoading(true);
      // You'll need to create these API endpoints
      const [balanceRes, withdrawalsRes] = await Promise.all([
        vendorApi.get("/withdrawal/balance"),
        vendorApi.get("/withdrawal/history"),
      ]);

      if (balanceRes.data?.success) {
        setBalance(balanceRes.data.balance);
        setBankAccounts(balanceRes.data.bankAccounts || []);
      }

      if (withdrawalsRes.data?.success) {
        setWithdrawals(withdrawalsRes.data.withdrawals);
      }
    } catch (error) {
      console.error("Error fetching withdrawal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit withdrawal request
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{balance.available}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{balance.pending}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Processing Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3-4 days</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Request Withdrawal
        </h2>

        {/* Form goes here */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Important Notice</p>
              <p className="text-sm text-yellow-700 mt-1">
                Withdrawals are processed manually within{" "}
                <strong>3-4 working days</strong>. Please ensure your bank
                details are correct before submitting.
              </p>
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Manage Bank Accounts
        </button>
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Withdrawals
        </h2>
        {/* Withdrawal history table goes here */}
      </div>
    </div>
  );
};

export default WithdrawalRequest;
