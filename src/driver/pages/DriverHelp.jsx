import React, { useState } from "react";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Headphones,
  Shield,
  DollarSign,
  Navigation,
  Clock,
} from "lucide-react";

const DriverHelp = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I accept an order?",
      answer:
        "When you're online, available orders will appear on your dashboard. Tap \"Accept Order\" on any order you want to deliver. Make sure you're available and in a suitable location before accepting.",
    },
    {
      id: 2,
      question: "How are earnings calculated?",
      answer:
        "Earnings consist of delivery fees, surge pricing during peak hours, and optional customer tips. You earn 80% of the delivery fee, with 20% going to platform commission. Earnings are updated in real-time.",
    },
    {
      id: 3,
      question: "How do I update my location?",
      answer:
        "Your location is automatically updated when the app is open. Make sure location services are enabled. You can also manually update location in the Profile section.",
    },
    {
      id: 4,
      question: "What if I need to cancel an accepted order?",
      answer:
        'Go to Current Orders, select the order, and tap "Cancel". Frequent cancellations may affect your rating. Only cancel if absolutely necessary.',
    },
    {
      id: 5,
      question: "When do I get paid?",
      answer:
        "Earnings are accumulated in your wallet. You can withdraw anytime once you reach ₹100 minimum. Withdrawals via UPI are processed within 2 hours, bank transfers take 1-2 business days.",
    },
    {
      id: 6,
      question: "How do I improve my driver rating?",
      answer:
        "Maintain good communication, deliver orders promptly, handle food carefully, and follow delivery instructions. Always verify orders before marking as delivered.",
    },
  ];

  const contactOptions = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Support",
      description: "24/7 driver support line",
      action: "Call +91-9876543210",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Get help via email",
      action: "Email support@foodapp.com",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with support agent",
      action: "Start Chat",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentation",
      description: "Driver guides & policies",
      action: "View Guides",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">
          Get help with deliveries, payments, and account issues
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactOptions.map((option, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.color} mb-3`}
            >
              {option.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {option.action} →
            </button>
          </div>
        ))}
      </div>

      {/* Emergency Section */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-6 h-6" />
              <h2 className="text-xl font-bold">Emergency Support</h2>
            </div>
            <p className="text-red-100">
              24/7 support for urgent delivery issues, safety concerns, or
              payment disputes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50">
              EMERGENCY CALL
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10">
              SAFETY ALERT
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6">
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {openFaq === faq.id && (
                <div className="mt-4 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Safety Guidelines
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Always wear helmet/seatbelt</li>
            <li>• Verify customer identity</li>
            <li>• Use contactless delivery</li>
            <li>• Report unsafe situations</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Payment Guide</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Minimum withdrawal: ₹100</li>
            <li>• UPI: Instant (2 hours)</li>
            <li>• Bank: 1-2 business days</li>
            <li>• Weekly bonus eligibility</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Peak Hours</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Lunch: 12 PM - 2 PM</li>
            <li>• Dinner: 7 PM - 10 PM</li>
            <li>• Weekends: All day</li>
            <li>• Surge pricing active</li>
          </ul>
        </div>
      </div>

      {/* Support Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Support Team
        </h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option>Select issue type</option>
                <option>Order Issues</option>
                <option>Payment Problems</option>
                <option>Account Help</option>
                <option>Technical Support</option>
                <option>Safety Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverHelp;
