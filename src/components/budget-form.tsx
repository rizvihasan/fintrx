
import { useState } from 'react';
import { DEFAULT_CATEGORIES } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BudgetFormProps {
  onSubmit: (category: string, amount: number) => void;
  currentBudget?: number;
  initialCategory?: string;
}

export function BudgetForm({ onSubmit, currentBudget = 0, initialCategory }: BudgetFormProps) {
  const [category, setCategory] = useState(initialCategory || '');
  const [amount, setAmount] = useState(currentBudget.toString());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    const budgetAmount = parseFloat(amount);
    if (isNaN(budgetAmount) || budgetAmount < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    onSubmit(category, budgetAmount);
    if (!initialCategory) {
      setCategory('');
      setAmount('');
    }

    toast({
      title: "Success",
      description: "Budget has been updated",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Input
          type="number"
          placeholder="Budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialCategory ? 'Update Budget' : 'Set Budget'}
      </Button>
    </form>
  );
}
