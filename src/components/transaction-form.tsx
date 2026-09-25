import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionFormData, TransactionType } from "@/types";
import { useCategories } from "@/hooks/use-categories";
import { suggestCategory } from "@/lib/ai";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(1, { message: "Description is required" }).max(100, {
    message: "Description must be 100 characters or less",
  }),
  category: z.string().min(1, { message: "Category is required" }),
  type: z.enum(["income", "expense"]),
  recurring: z.boolean().optional(),
});

const EMPTY_DEFAULTS: TransactionFormData = {
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  description: "",
  category: "other",
  type: "expense",
  recurring: false,
};

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  defaultValues?: TransactionFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function TransactionForm({
  onSubmit,
  defaultValues = EMPTY_DEFAULTS,
  isEditing = false,
  onCancel,
}: TransactionFormProps) {
  const { categories, addCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const type = form.watch("type");

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset({ ...EMPTY_DEFAULTS, type });
    }
  };

  const handleSuggest = async () => {
    const description = form.getValues("description").trim();
    if (!description || suggesting) return;
    setSuggesting(true);
    try {
      const id = await suggestCategory(description, categories);
      if (categories.some((c) => c.id === id)) {
        form.setValue("category", id);
      }
    } catch {
      // AI unavailable - leave the current category untouched
    } finally {
      setSuggesting(false);
    }
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const category = await addCategory(name);
    form.setValue("category", category.id);
    setNewCategory("");
    setAddingCategory(false);
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
            {!isEditing && (
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as TransactionType[]).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={type === t ? "default" : "outline"}
                    className={cn(
                      type === t &&
                        (t === "expense"
                          ? "bg-finance-danger hover:bg-finance-danger/90"
                          : "bg-teal-500 hover:bg-teal-600")
                    )}
                    onClick={() => form.setValue("type", t)}
                  >
                    {t === "expense" ? "Expense" : "Income"}
                  </Button>
                ))}
              </div>
            )}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" step="0.01" {...field} />
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
                    <Input placeholder="E.g., Grocery shopping" {...field} />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Category</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      disabled={suggesting}
                      onClick={handleSuggest}
                    >
                      {suggesting ? "Suggesting..." : "Suggest with AI"}
                    </Button>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
                  {addingCategory ? (
                    <div className="flex gap-2 pt-1">
                      <Input
                        placeholder="New category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddCategory}>
                        Add
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => setAddingCategory(true)}
                    >
                      + New category
                    </Button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditing && (
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Repeat monthly (rent, salary, subscriptions)
                    </FormLabel>
                  </FormItem>
                )}
              />
            )}
            <CardFooter className="px-0 pb-0 pt-2 flex gap-2">
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {isEditing ? "Update" : "Add"} Transaction
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {!isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => form.reset(EMPTY_DEFAULTS)}
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
