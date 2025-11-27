import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, ArrowRight, CheckCircle } from "lucide-react";

interface QuickPaymentButtonProps {
  pendingAmount?: number;
  onPaymentComplete?: () => void;
}

export const QuickPaymentButton = ({
  pendingAmount = 5000,
  onPaymentComplete,
}: QuickPaymentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "mobile", name: "Mobile Money", icon: "📱" },
    { id: "bank", name: "Bank Transfer", icon: "🏦" },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);

    setTimeout(() => {
      onPaymentComplete?.();
      setIsOpen(false);
      setIsSuccess(false);
      setSelectedMethod(null);
    }, 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Pay Now - RWF {pendingAmount.toLocaleString()}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Payment</DialogTitle>
          </DialogHeader>

          {!isSuccess ? (
            <div className="space-y-4">
              {/* Amount Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <h2 className="text-3xl font-bold text-blue-600 mt-2">
                      RWF {pendingAmount.toLocaleString()}
                    </h2>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Payment Method</p>
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-border hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground">
                Payment Successful!
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your payment of RWF {pendingAmount.toLocaleString()} has been processed.
              </p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
