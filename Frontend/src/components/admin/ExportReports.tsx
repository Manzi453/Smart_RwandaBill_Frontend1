import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Download,
  FileText,
  Sheet,
  BarChart3,
  CheckCircle,
} from "lucide-react";

interface ExportOption {
  id: string;
  name: string;
  format: string;
  icon: React.ReactNode;
  description: string;
}

interface ExportReportsProps {
  onExport?: (format: string, type: string) => void;
}

export const ExportReports = ({ onExport }: ExportReportsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reportTypes = [
    {
      id: "bills",
      name: "Bills Report",
      description: "Export all bills with status and amounts",
    },
    {
      id: "users",
      name: "Users Report",
      description: "Export user list with payment history",
    },
    {
      id: "revenue",
      name: "Revenue Report",
      description: "Export revenue analytics and trends",
    },
    {
      id: "transactions",
      name: "Transactions Report",
      description: "Export all transactions and payments",
    },
  ];

  const exportFormats: ExportOption[] = [
    {
      id: "pdf",
      name: "PDF",
      format: "pdf",
      icon: <FileText className="h-6 w-6" />,
      description: "Professional PDF format",
    },
    {
      id: "excel",
      name: "Excel",
      format: "xlsx",
      icon: <Sheet className="h-6 w-6" />,
      description: "Excel spreadsheet format",
    },
    {
      id: "csv",
      name: "CSV",
      format: "csv",
      icon: <BarChart3 className="h-6 w-6" />,
      description: "Comma-separated values",
    },
  ];

  const handleExport = async (format: string) => {
    if (!selectedType) return;

    setIsExporting(true);
    // Simulate export processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    setIsSuccess(true);
    onExport?.(format, selectedType);

    setTimeout(() => {
      setIsOpen(false);
      setIsSuccess(false);
      setSelectedType(null);
    }, 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Reports</DialogTitle>
          </DialogHeader>

          {!isSuccess ? (
            <div className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Select Report Type</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedType === type.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-border hover:border-blue-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Export Format Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Select Format</p>
                <div className="grid grid-cols-3 gap-3">
                  {exportFormats.map((format) => (
                    <motion.button
                      key={format.id}
                      onClick={() => handleExport(format.format)}
                      disabled={!selectedType || isExporting}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        !selectedType || isExporting
                          ? "opacity-50 cursor-not-allowed"
                          : "border-border hover:border-blue-600 hover:bg-blue-50"
                      }`}
                      whileHover={selectedType ? { scale: 1.05 } : {}}
                      whileTap={selectedType ? { scale: 0.95 } : {}}
                    >
                      <div className="text-blue-600">{format.icon}</div>
                      <div className="text-center">
                        <p className="font-medium text-sm">{format.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Date Range</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          From
                        </label>
                        <input
                          type="date"
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue="2024-10-01"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          To
                        </label>
                        <input
                          type="date"
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue="2024-10-31"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
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
                Export Successful!
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your report has been generated and will download shortly.
              </p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
