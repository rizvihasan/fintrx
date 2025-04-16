
import { useState, useEffect } from 'react';
import { CategoryBudget } from '@/types';

export function useBudgets() {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedBudgets = localStorage.getItem('budgets');
    if (storedBudgets) {
      try {
        setBudgets(JSON.parse(storedBudgets));
      } catch (error) {
        console.error('Failed to parse stored budgets:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
  }, [budgets, isLoading]);

  const setBudget = (category: string, amount: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => 
          b.category === category ? { ...b, budget: amount } : b
        );
      }
      return [...prev, { category, budget: amount }];
    });
  };

  const getBudget = (category: string): number => {
    return budgets.find(b => b.category === category)?.budget || 0;
  };

  const deleteBudget = (category: string) => {
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  return {
    budgets,
    isLoading,
    setBudget,
    getBudget,
    deleteBudget
  };
}
