
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionFormData, DEFAULT_CATEGORIES } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(1, { message: "Description is required" }).max(100, {
    message: "Description must be 100 characters or less",
  }),
  category: z.string().min(1, { message: "Category is required" }),
});

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  defaultValues?: TransactionFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function TransactionForm({
  onSubmit,
  defaultValues = {
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "other",
  },
  isEditing = false,
  onCancel,
}: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "other",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {isEditing ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., Grocery shopping"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEFAULT_CATEGORIES.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="px-0 pb-0 pt-2 flex gap-2">
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {isEditing ? "Update" : "Add"} Transaction
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              {!isEditing && (
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => form.reset({
                    amount: 0,
                    date: new Date().toISOString().split("T")[0],
                    description: "",
                    category: "other",
                  })}
                >
                  Reset
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
