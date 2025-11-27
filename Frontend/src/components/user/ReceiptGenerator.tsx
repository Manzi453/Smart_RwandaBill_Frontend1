import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Mail,
  Share2,
  Copy,
  CheckCircle,
  Loader2,
  QrCode,
  Printer,
} from "lucide-react";

interface Receipt {
  receiptNumber: string;
  transactionId: string;
  paymentDate: Date;
  amount: number;
  service: string;
  paymentMethod: string;
  billPeriod: string;
  userInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    sector: string;
  };
  status: "completed" | "pending" | "failed";
  pdfUrl?: string;
}

export const ReceiptGenerator = ({ receipt }: { receipt: Receipt }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

const handleDownloadReceipt = async () => {
    try {
      setIsGenerating(true);
      if (receipt.pdfUrl) {
        const link = document.createElement("a");
        link.href = receipt.pdfUrl;
        link.download = `receipt-${receipt.receiptNumber}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailReceipt = async () => {
    setIsSending(true);
    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(receipt.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Receipt",
          text: `Payment receipt for ${receipt.service} bill - RWF ${receipt.amount.toLocaleString()}`,
          url: receipt.pdfUrl || window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Success Alert */}
      {receipt.status === "completed" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Payment successful! Your receipt has been generated and is ready for download.
          </AlertDescription>
        </Alert>
      )}

      {/* Receipt Preview Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Payment Receipt</CardTitle>
              <p className="text-blue-100 text-sm mt-1">
                Receipt #{receipt.receiptNumber}
              </p>
            </div>
            <Badge className="bg-white text-blue-600">
              {receipt.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Transaction Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Transaction Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span className="text-muted-foreground">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm">
                    {receipt.transactionId}
                  </span>
                  <button
                    onClick={handleCopyTransactionId}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-2">
                <span className="text-muted-foreground">Payment Date</span>
                <span className="font-semibold">
                  {new Date(receipt.paymentDate).toLocaleDateString()} at{" "}
                  {new Date(receipt.paymentDate).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-2">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold capitalize">
                  {receipt.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2">
                <span className="text-muted-foreground">Service</span>
                <Badge variant="outline" className="capitalize">
                  {receipt.service}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-2">
                <span className="text-muted-foreground">Billing Period</span>
                <span className="font-semibold">{receipt.billPeriod}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-semibold">Amount Paid</span>
                <span className="text-2xl font-bold text-blue-600">
                  RWF {receipt.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Customer Information
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-semibold">{receipt.userInfo.name}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-semibold">{receipt.userInfo.phone}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-semibold">{receipt.userInfo.email}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Address:</span>{" "}
                <span className="font-semibold">
                  {receipt.userInfo.address}, {receipt.userInfo.sector},{" "}
                  {receipt.userInfo.district}
                </span>
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-t pt-4 flex flex-col items-center">
            <p className="text-xs text-muted-foreground mb-3">
              Scan to verify payment
            </p>
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
              <QrCode className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              QR Code for verification
            </p>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center space-y-1">
            <p className="text-sm font-semibold">Rwanda Bills</p>
            <p className="text-xs text-muted-foreground">
              Smart Community Billing System
            </p>
            <p className="text-xs text-muted-foreground">
              Thank you for your payment!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReceipt}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </Button>

          <Button
            onClick={handleEmailReceipt}
            className="flex items-center justify-center gap-2"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : emailSent ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Sent!
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Email Receipt
              </>
            )}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handlePrintReceipt}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button
            onClick={handleShareReceipt}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Receipt Storage Info */}
      <Alert>
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          This receipt has been automatically saved to your account. You can access it anytime from your Payment History.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
