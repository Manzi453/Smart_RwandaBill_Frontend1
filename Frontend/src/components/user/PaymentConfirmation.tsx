import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Home,
  Clock,
  Loader2,
} from "lucide-react";

interface PaymentConfirmationData {
  status: "success" | "processing" | "failed";
  transactionId: string;
  amount: number;
  service: string;
  paymentMethod: string;
  timestamp: Date;
  receiptUrl?: string;
  errorMessage?: string;
  nextSteps?: string[];
}

export const PaymentConfirmation = ({
  payment,
  onDone,
}: {
  payment: PaymentConfirmationData;
  onDone: () => void;
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(payment.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    setDownloadStarted(true);
    if (payment.receiptUrl) {
      const link = document.createElement("a");
      link.href = payment.receiptUrl;
      link.download = `receipt-${payment.transactionId}.pdf`;
      link.click();
    }
    setTimeout(() => setDownloadStarted(false), 1000);
  };

  // SUCCESS STATE
  if (payment.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-200">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse"
            />
          </motion.div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-green-600">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground">
            Your payment has been processed successfully
          </p>
        </div>

        {/* Confirmation Details */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 space-y-4">
            {/* Transaction ID */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Transaction ID
              </p>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200">
                <span className="font-mono font-semibold flex-1">
                  {payment.transactionId}
                </span>
                <button
                  onClick={handleCopyTransactionId}
                  className="p-2 hover:bg-muted rounded transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Payment Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
                <p className="text-xl font-bold text-green-600">
                  RWF {payment.amount.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Service</p>
                <p className="text-lg font-bold capitalize">
                  {payment.service}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">
                  Payment Method
                </p>
                <p className="text-sm font-semibold capitalize">
                  {payment.paymentMethod}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                <p className="text-sm font-semibold">
                  {new Date(payment.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-center text-xs text-muted-foreground">
              {new Date(payment.timestamp).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {payment.nextSteps && payment.nextSteps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {payment.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-muted-foreground pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleDownloadReceipt}
            className="w-full"
            size="lg"
            disabled={downloadStarted}
          >
            {downloadStarted ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </>
            )}
          </Button>

          <Button
            onClick={onDone}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            A receipt has been sent to your email. You can also download it above or access it anytime from your Payment History.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  // PROCESSING STATE
  if (payment.status === "processing") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        {/* Processing Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>

        {/* Processing Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-blue-600">
            Processing Payment...
          </h2>
          <p className="text-muted-foreground">
            Please don't close this window. Your payment is being processed.
          </p>
        </div>

        {/* Payment Details */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold">
                RWF {payment.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="text-muted-foreground">Service</span>
              <span className="font-semibold capitalize">{payment.service}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="text-muted-foreground">Method</span>
              <span className="font-semibold capitalize">
                {payment.paymentMethod}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Progress Info */}
        <Alert className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            This usually takes 1-2 minutes. We'll notify you once your payment is confirmed.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  // FAILED STATE
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Error Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-200">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
      </div>

      {/* Error Message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
        <p className="text-muted-foreground">
          Unfortunately, your payment could not be processed
        </p>
      </div>

      {/* Error Details */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {payment.errorMessage ||
            "An error occurred while processing your payment. Please try again."}
        </AlertDescription>
      </Alert>

      {/* Payment Details */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold">
              RWF {payment.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
            <span className="text-muted-foreground">Service</span>
            <span className="font-semibold capitalize">{payment.service}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-sm">{payment.transactionId}</span>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Check your internet connection</li>
            <li>✓ Verify your payment method has sufficient funds</li>
            <li>✓ Try a different payment method</li>
            <li>✓ Contact customer support if the problem persists</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={onDone} className="w-full" size="lg">
          Try Again
        </Button>

        <Button variant="outline" className="w-full" size="lg">
          Contact Support
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your account has not been charged. Please try again or contact our support team for assistance.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
