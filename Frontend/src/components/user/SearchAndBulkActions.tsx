import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-ignore
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Trash2,
  Download,
  Mail,
  CheckSquare,
  Square,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

export const SearchAndBulkActions = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  // Mock payment data
  const payments: Payment[] = [
    {
      id: "1",
      date: "2024-10-15",
      service: "Water Bill",
      amount: 15000,
      status: "paid",
    },
    {
      id: "2",
      date: "2024-10-10",
      service: "Security",
      amount: 25000,
      status: "paid",
    },
    {
      id: "3",
      date: "2024-10-05",
      service: "Sanitation",
      amount: 8000,
      status: "pending",
    },
    {
      id: "4",
      date: "2024-09-20",
      service: "Water Bill",
      amount: 15000,
      status: "overdue",
    },
    {
      id: "5",
      date: "2024-09-15",
      service: "Security",
      amount: 25000,
      status: "paid",
    },
  ];

  // Filter and search payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.date.includes(searchQuery) ||
      payment.amount.toString().includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" || payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSelectPayment = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map((p) => p.id));
    }
  };

  const handleBulkDelete = () => {
    console.log("Deleting payments:", selectedPayments);
    setSelectedPayments([]);
  };

  const handleBulkExport = () => {
    const selectedData = payments.filter((p) =>
      selectedPayments.includes(p.id)
    );
    const csv = [
      ["Date", "Service", "Amount", "Status"],
      ...selectedData.map((p) => [p.date, p.service, p.amount, p.status]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleBulkEmail = () => {
    console.log("Emailing receipts for:", selectedPayments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service, date, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Found {filteredPayments.length} payment
              {filteredPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {selectedPayments.length} payment
                  {selectedPayments.length !== 1 ? "s" : ""} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkExport}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkEmail}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Payment List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSelectAll}
                className="gap-2"
              >
                {selectedPayments.length === filteredPayments.length ? (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    Select All
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, idx) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={() => handleSelectPayment(payment.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{payment.service}</p>
                        <p className="font-semibold">
                          RWF {payment.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded capitalize ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No payments found matching your search.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
