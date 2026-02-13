import React, { useState, useEffect } from "react";
import {
  Wallet,
  Clock,
  CheckCircle,
  Banknote,
  AlertCircle,
  ArrowLeft,
  Building,
  CreditCard,
  History,
  PlusCircle,
  Trash2,
  RefreshCw, // Add this import
} from "lucide-react";
import { useVendor } from "../context/VendorContext";
import { useNavigate } from "react-router-dom";
import { addBankAccount, requestWithdrawal } from "../api/vendorApi"; // Add this import

const WithdrawalPage = () => {
  const {
    vendor,
    vendorBalance, // USE THIS from context
    bankAccounts, // USE THIS from context
    withdrawals, // USE THIS from context
    fetchVendorBalance, // USE THIS from context
    fetchWithdrawalHistory, // USE THIS from context
  } = useVendor();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("request");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ REMOVE THESE HARDCODED STATES:
  // const [bankAccounts, setBankAccounts] = useState([...]);
  // const [withdrawals, setWithdrawals] = useState([...]);
  // const [balance, setBalance] = useState({...});

  // Withdrawal Form State
  const [formData, setFormData] = useState({
    amount: "",
    method: "BANK_TRANSFER",
    accountId: "",
    upiId: "",
  });

  // Add Bank Account Form State
  const [bankForm, setBankForm] = useState({
    accountHolder: vendor?.userName || "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
    isDefault: false,
  });

  const [showAddBankForm, setShowAddBankForm] = useState(false);

  // Refresh data on component mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  // Add this useEffect to auto-refresh when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      refreshData();
    }
  }, [activeTab, refreshData]);
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // This should fetch both balance and history from context
      if (fetchVendorBalance) {
        await fetchVendorBalance();
      }
      if (fetchWithdrawalHistory) {
        await fetchWithdrawalHistory();
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };
  // Add this import at the top

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    const withdrawalAmount = parseFloat(formData.amount);
    if (!withdrawalAmount || withdrawalAmount < 500) {
      alert("Minimum withdrawal amount is ₹500");
      return;
    }

    // Check balance
    if (withdrawalAmount > (vendorBalance?.available || 0)) {
      alert(
        `Insufficient balance. Available: ₹${vendorBalance?.available || 0}`,
      );
      return;
    }

    // Validate bank account for BANK_TRANSFER
    if (formData.method === "BANK_TRANSFER" && !formData.accountId) {
      alert("Please select a bank account");
      return;
    }

    // Validate UPI ID for UPI method
    if (formData.method === "UPI" && !formData.upiId) {
      alert("Please enter UPI ID");
      return;
    }

    setLoading(true);

    try {
      // Prepare withdrawal data
      const withdrawalData = {
        amount: withdrawalAmount,
        method: formData.method,
        accountId:
          formData.method === "BANK_TRANSFER" ? formData.accountId : undefined,
        upiId: formData.method === "UPI" ? formData.upiId : undefined,
      };

      console.log("Submitting withdrawal:", withdrawalData);

      // Call the actual API
      const response = await requestWithdrawal(withdrawalData);
      console.log("Withdrawal Response:", response.data);

      if (response.data?.success) {
        // Reset form
        setFormData({
          amount: "",
          method: "BANK_TRANSFER",
          accountId: "",
          upiId: "",
        });

        alert(
          "Withdrawal request submitted successfully! Processing in 3-4 working days.",
        );

        // IMPORTANT: Refresh ALL data from context
        await refreshData();
      } else {
        alert(response.data?.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      alert(
        error.response?.data?.message || "Failed to submit withdrawal request",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleAddBankAccount = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !bankForm.accountHolder ||
      !bankForm.bankName ||
      !bankForm.accountNumber ||
      !bankForm.ifscCode
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const bankData = {
        accountHolder: bankForm.accountHolder,
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        ifscCode: bankForm.ifscCode,
      };

      const response = await addBankAccount(bankData);

      if (response.data?.success) {
        setBankForm({
          accountHolder: vendor?.userName || "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          upiId: "",
          isDefault: false,
        });
        setShowAddBankForm(false);

        alert("Bank account added successfully!");

        // Refresh vendor data to get updated bank accounts
        await fetchVendorBalance();
      }
    } catch (error) {
      console.error("Error adding bank account:", error);
      alert(error.response?.data?.message || "Failed to add bank account");
    } finally {
      setLoading(false);
    }
  };
  // Set default account - UPDATED
  const setDefaultAccount = (id) => {
    // TODO: Replace with actual API call
    alert(`Account ${id} set as default`);
    refreshData();
  };
  // Set default account - ACTUAL API CALL
  const handleSetDefaultAccount = async (id) => {
    if (!window.confirm("Set this account as default for withdrawals?")) return;

    try {
      const response = await setDefaultAccount(id);
      if (response.data?.success) {
        alert("Default account updated successfully!");
        refreshData();
      }
    } catch (error) {
      console.error("Error setting default account:", error);
      alert(error.response?.data?.message || "Failed to set default account");
    }
  };

  // Delete bank account - ACTUAL API CALL
  const handleDeleteBankAccount = async (id) => {
    const account = bankAccounts?.find((acc) => acc._id === id);
    if (!account) return;

    if (account.isDefault) {
      alert("Cannot delete default account. Set another as default first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      const response = await deleteBankAccount(id);
      if (response.data?.success) {
        alert("Bank account deleted successfully!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      alert(error.response?.data?.message || "Failed to delete bank account");
    }
  };
  // Delete bank account - UPDATED
  const deleteBankAccount = (id) => {
    if (bankAccounts?.find((acc) => acc.id === id)?.isDefault) {
      alert("Cannot delete default account. Set another as default first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    // TODO: Replace with actual API call
    alert(`Account ${id} deleted`);
    refreshData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add loading state
  if (refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
            <p className="text-gray-600">
              Request withdrawal to your bank account
            </p>
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Balance Overview - USE CONTEXT DATA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              {/* ✅ USE vendorBalance from context */}
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(vendorBalance?.available || 0)}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Ready to withdraw</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Pending Withdrawals</p>
              {/* ✅ USE vendorBalance from context */}
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(vendorBalance?.pending || 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-600">Processing requests</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Earned</p>
              {/* ✅ USE vendorBalance from context */}
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(vendorBalance?.totalEarned || 0)}
              </p>
            </div>
            <Banknote className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">All-time earnings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("request")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "request"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Request Withdrawal
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "accounts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Bank Accounts
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Request Withdrawal Tab */}
          {activeTab === "request" && (
            <div>
              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Important Notice
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      • Withdrawals are processed{" "}
                      <strong>manually within 3-4 working days</strong>
                      <br />• Minimum withdrawal amount: <strong>₹500</strong>
                      <br />• Ensure bank details are correct before submitting
                    </p>
                  </div>
                </div>
              </div>

              {/* Withdrawal Form */}
              <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Withdraw
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="500"
                      // ✅ USE vendorBalance from context
                      max={vendorBalance?.available || 0}
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {/* ✅ USE vendorBalance from context */}
                    Available: {formatCurrency(vendorBalance?.available || 0)} •
                    Min: ₹500
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, method: "BANK_TRANSFER" })
                      }
                      className={`p-4 border rounded-lg text-center ${
                        formData.method === "BANK_TRANSFER"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <Building className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-gray-600">
                        3-4 days processing
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, method: "UPI" })
                      }
                      className={`p-4 border rounded-lg text-center ${
                        formData.method === "UPI"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">UPI Transfer</p>
                      <p className="text-sm text-gray-600">
                        2-3 days processing
                      </p>
                    </button>
                  </div>
                </div>

                {formData.method === "BANK_TRANSFER" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Bank Account
                    </label>
                    <div className="space-y-3">
                      {bankAccounts && bankAccounts.length > 0 ? (
                        bankAccounts.map((account) => {
                          // Use _id for MongoDB (your backend returns _id)
                          const accountId = account._id || account.id;
                          return (
                            <div
                              key={accountId}
                              className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-500"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  id={`account-${accountId}`}
                                  name="account"
                                  checked={formData.accountId === accountId}
                                  onChange={() =>
                                    setFormData({
                                      ...formData,
                                      accountId: accountId,
                                    })
                                  }
                                  className="h-4 w-4 text-blue-600"
                                />
                                <div>
                                  <p className="font-medium">
                                    {account.bankName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {account.accountHolder} ••••
                                    {String(account.accountNumber).slice(-4)}
                                    {account.isDefault && (
                                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        Default
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              {account.verified ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Pending
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No bank accounts found. Please add one first.
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("accounts")}
                      className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add New Bank Account
                    </button>
                  </div>
                )}

                {formData.method === "UPI" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) =>
                        setFormData({ ...formData, upiId: e.target.value })
                      }
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.amount ||
                    parseFloat(formData.amount) < 500
                  }
                  className={`w-full py-3 rounded-lg font-medium ${
                    loading ||
                    !formData.amount ||
                    parseFloat(formData.amount) < 500
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Submit Withdrawal Request"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Bank Accounts Tab */}
          {activeTab === "accounts" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Bank Accounts
                </h3>
                <button
                  onClick={() => setShowAddBankForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Bank Account
                </button>
              </div>

              {/* Add Bank Form - ADD THIS SECTION */}
              {showAddBankForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Bank Account
                  </h4>
                  <form onSubmit={handleAddBankAccount} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={bankForm.accountHolder}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            accountHolder: e.target.value,
                          })
                        }
                        placeholder="Enter account holder name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankForm.bankName}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, bankName: e.target.value })
                        }
                        placeholder="Enter bank name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankForm.accountNumber}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            accountNumber: e.target.value,
                          })
                        }
                        placeholder="Enter account number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={bankForm.ifscCode}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, ifscCode: e.target.value })
                        }
                        placeholder="Enter IFSC code"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={bankForm.isDefault}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            isDefault: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-sm text-gray-700"
                      >
                        Set as default account
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddBankForm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Bank Accounts List - FIX THIS SECTION TO SHOW BANK ACCOUNT DETAILS */}
              <div className="space-y-4">
                {/* ✅ USE bankAccounts from context */}
                {bankAccounts?.map((account) => (
                  <div
                    key={account._id || account.id}
                    className="p-4 border border-gray-300 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{account.bankName}</p>
                          {account.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {account.accountHolder} ••••
                          {account.accountNumber?.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-600">
                          IFSC: {account.ifscCode}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {account.verified ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Pending Verification
                          </span>
                        )}

                        {!account.isDefault && (
                          <>
                            <button
                              onClick={() =>
                                setDefaultAccount(account._id || account.id)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Set as default"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                deleteBankAccount(account._id || account.id)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!bankAccounts || bankAccounts.length === 0) && (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bank accounts added yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add a bank account to withdraw your earnings
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Withdrawal History
              </h3>

              {withdrawals && withdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Method
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Est. Completion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(withdrawal.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {formatCurrency(withdrawal.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {withdrawal.method === "BANK_TRANSFER"
                              ? "Bank Transfer"
                              : "UPI"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}
                            >
                              {withdrawal.status.charAt(0) +
                                withdrawal.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {withdrawal.estimatedProcessing
                              ? new Date(
                                  withdrawal.estimatedProcessing,
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                            {withdrawal.status === "PENDING" && (
                              <p className="text-xs text-gray-500">
                                (3-4 working days)
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No withdrawal history found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submit your first withdrawal request to see history here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
