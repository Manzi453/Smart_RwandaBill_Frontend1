import { useState } from "react";
import { motion } from "framer-motion";
// Removed unused AnimatePresence and useTranslation imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface Bill {
  id: string;
  service: "water" | "sanitation" | "security";
  amount: number;
  dueDate: Date;
  billingPeriod: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface PaymentState {
  status: "idle" | "processing" | "success" | "error";
  transactionId?: string;
  message?: string;
}

export const PaymentProcessor = ({
  bill,
  onPaymentComplete,
}: {
  bill: Bill;
  onPaymentComplete: (result: {
    transactionId: string;
    amount: number;
    service: string;
    paymentMethod: string;
    timestamp: Date;
    status: string;
  }) => void;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: "idle",
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  const paymentMethods: PaymentMethod[] = [
    {
      id: "mtn",
      name: "MTN Mobile Money",
      icon: <Smartphone className="h-6 w-6" />,
      description: "Pay via MTN Mobile Money",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <Smartphone className="h-6 w-6" />,
      description: "Pay via Airtel Money",
      color: "from-red-400 to-red-600",
    },
    {
      id: "card",
      name: "Card Payment",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Visa, Mastercard",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Direct bank transfer",
      color: "from-green-400 to-green-600",
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setPaymentState({ status: "processing" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      setPaymentState({
        status: "success",
        transactionId,
        message: "Payment processed successfully!",
      });

      // Call callback with payment details
      onPaymentComplete({
        transactionId,
        amount: bill.amount,
        service: bill.service,
        paymentMethod: selectedMethod,
        timestamp: new Date(),
        status: "completed",
      });
    } catch (error) {
      setPaymentState({
        status: "error",
        message: "Payment failed. Please try again.",
      });
    }
  };

  if (paymentState.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {paymentState.message}
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono font-semibold">
                  {paymentState.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">
                  RWF {bill.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-semibold capitalize">{bill.service}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (paymentState.status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{paymentState.message}</AlertDescription>
        </Alert>

        <Button
          onClick={() => setPaymentState({ status: "idle" })}
          className="w-full"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bill Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Service:</span>
            <Badge variant="outline" className="capitalize">
              {bill.service}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Billing Period:</span>
            <span className="font-semibold">{bill.billingPeriod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Due Date:</span>
            <span className="font-semibold">
              {new Date(bill.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold">Amount to Pay:</span>
            <span className="text-2xl font-bold text-blue-600">
              RWF {bill.amount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <div>
        <h3 className="font-semibold mb-3">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMethod === method.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-border hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`bg-gradient-to-br ${method.color} p-3 rounded-lg text-white`}
                >
                  {method.icon}
                </div>
                <div className="text-left">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Phone Number Input for Mobile Money */}
      {(selectedMethod === "mtn" || selectedMethod === "airtel") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="+250 7XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Enter the phone number registered with {selectedMethod === "mtn" ? "MTN" : "Airtel"}
          </p>
        </motion.div>
      )}

      {/* Security Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Your payment is secured with bank-level encryption. Your financial information is never stored on our servers.
        </AlertDescription>
      </Alert>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || paymentState.status === "processing"}
        className="w-full"
        size="lg"
      >
        {paymentState.status === "processing" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            Proceed to Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};
