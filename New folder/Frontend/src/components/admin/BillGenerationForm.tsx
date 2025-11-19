import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {Popover,PopoverContent,PopoverTrigger} from "@radix-ui/react-popover";



export interface BillGenerationFormProps {
  onGenerate: (billData: BillData) => void;
  onCancel: () => void;
  users: Array<{
    id: string;
    name: string;
    email: string;
    district: string;
  }>;
}

export interface BillData {
  userId: string;
  userName: string;
  amount: number;
  dueDate: Date;
  description: string;
  serviceType: 'water' | 'sanitation' | 'security';
  status: 'pending' | 'paid' | 'overdue';
}

export function BillGenerationForm({ onGenerate, onCancel, users }: BillGenerationFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<BillData, 'userName' | 'status'>>({
    userId: '',
    amount: 0,
    dueDate: new Date(),
    description: '',
    serviceType: 'water',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userId) {
      newErrors.userId = t('userRequired');
    }
    if (formData.amount <= 0) {
      newErrors.amount = t('amountRequired');
    }
    if (!formData.dueDate) {
      newErrors.dueDate = t('dueDateRequired');
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = t('futureDateRequired');
    }
    if (!formData.description) {
      newErrors.description = t('descriptionRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedUser = users.find(user => user.id === formData.userId);
    
    if (!selectedUser) {
      setErrors({ ...errors, userId: t('userNotFound') });
      return;
    }

    onGenerate({
      ...formData,
      userName: selectedUser.name,
      status: 'pending',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="userId">{t('selectUser')} *</Label>
        <Select
          value={formData.userId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={t('selectUser')} />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} ({user.email}) - {user.district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.userId && <p className="text-sm text-red-500 mt-1">{errors.userId}</p>}
      </div>

      <div>
        <Label htmlFor="serviceType">{t('serviceType')}</Label>
        <Select
          value={formData.serviceType}
          onValueChange={(value: 'water' | 'sanitation' | 'security') => 
            setFormData(prev => ({ ...prev, serviceType: value }))
          }
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={t('selectServiceType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="water">{t('water')}</SelectItem>
            <SelectItem value="sanitation">{t('sanitation')}</SelectItem>
            <SelectItem value="security">{t('security')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">{t('amount')} (RWF) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={handleInputChange}
          className="mt-1"
        />
        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
      </div>

      <div>
        <Label>{t('dueDate')} *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-1 justify-start text-left font-normal",
                !formData.dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dueDate ? (
                format(formData.dueDate, "PPP")
              ) : (
                <span>{t('pickDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.dueDate}
              onSelect={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, dueDate: date }));
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
      </div>

      <div>
        <Label htmlFor="description">{t('description')} *</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          placeholder={t('enterDescription')}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">
          {t('generateBill')}
        </Button>
      </div>
    </form>
  );
}
