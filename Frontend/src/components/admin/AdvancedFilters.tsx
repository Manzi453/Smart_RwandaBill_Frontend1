import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Filter, X, RotateCcw } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  type: "date" | "select" | "text" | "range";
  value: string | number | [number, number];
  options?: Array<{ value: string; label: string }>;
}

interface AdvancedFiltersProps {
  filters?: FilterOption[];
  onFilterChange?: (filters: FilterOption[]) => void;
  onReset?: () => void;
}

export const AdvancedFilters = ({
  filters = [
    {
      id: "dateFrom",
      label: "From Date",
      type: "date",
      value: "2024-10-01",
    },
    {
      id: "dateTo",
      label: "To Date",
      type: "date",
      value: "2024-10-31",
    },
    {
      id: "status",
      label: "Bill Status",
      type: "select",
      value: "all",
      options: [
        { value: "all", label: "All Status" },
        { value: "paid", label: "Paid" },
        { value: "pending", label: "Pending" },
        { value: "overdue", label: "Overdue" },
      ],
    },
    {
      id: "district",
      label: "District",
      type: "select",
      value: "all",
      options: [
        { value: "all", label: "All Districts" },
        { value: "kigali", label: "Kigali City" },
        { value: "northern", label: "Northern Province" },
        { value: "southern", label: "Southern Province" },
        { value: "eastern", label: "Eastern Province" },
        { value: "western", label: "Western Province" },
      ],
    },
    {
      id: "amountMin",
      label: "Min Amount (RWF)",
      type: "range",
      value: 0,
    },
    {
      id: "amountMax",
      label: "Max Amount (RWF)",
      type: "range",
      value: 100000,
    },
  ],
  onFilterChange,
  onReset,
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(filters);
  const [appliedCount, setAppliedCount] = useState(0);

  const handleFilterChange = (id: string, value: string | number) => {
    const updated = activeFilters.map((f) =>
      f.id === id ? { ...f, value } : f
    );
    setActiveFilters(updated);
  };

  const handleApply = () => {
    const count = activeFilters.filter((f) => f.value !== "all").length;
    setAppliedCount(count);
    onFilterChange?.(activeFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const reset = filters.map((f) => ({
      ...f,
      value: f.type === "select" ? "all" : f.value,
    }));
    setActiveFilters(reset);
    setAppliedCount(0);
    onReset?.();
  };

  return (
    <div className="space-y-4">
      {/* Filter Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter className="h-4 w-4" />
        Advanced Filters
        {appliedCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
            {appliedCount}
          </span>
        )}
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Filter Options</CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeFilters.map((filter) => (
                    <div key={filter.id} className="space-y-2">
                      <label className="text-sm font-medium">{filter.label}</label>

                      {filter.type === "date" && (
                        <input
                          type="date"
                          value={filter.value as string}
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {filter.type === "select" && (
                        <select
                          value={filter.value as string}
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {filter.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {filter.type === "range" && (
                        <input
                          type="number"
                          value={filter.value as number}
                          onChange={(e) =>
                            handleFilterChange(filter.id, parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter amount"
                        />
                      )}

                      {filter.type === "text" && (
                        <input
                          type="text"
                          value={filter.value as string}
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter text"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Active Filters Display */}
                {appliedCount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <strong>{appliedCount}</strong> filter(s) applied
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleApply}
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
