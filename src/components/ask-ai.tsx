import { useRef, useState } from "react";
import Markdown from "react-markdown";
import { Transaction, Category } from "@/types";
import { askFintrx, monthlyInsights } from "@/lib/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles, Send, Loader2 } from "lucide-react";

interface AskAiProps {
  transactions: Transaction[];
  categories: Category[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const EXAMPLES = [
  "How much did I spend on groceries this month?",
  "What are my three biggest expenses?",
  "How does my spending this month compare to last month?",
];

export function AskAi({ transactions, categories }: AskAiProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const push = (m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
    setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 50);
  };

  const ask = async (question: string) => {
    if (!question.trim() || busy) return;
    push({ role: "user", content: question });
    setInput("");
    setBusy(true);
    try {
      const answer = await askFintrx(question, transactions, categories);
      push({ role: "assistant", content: answer || "No answer came back." });
    } catch (err) {
      push({ role: "assistant", content: `Something went wrong: ${String(err)}` });
    } finally {
      setBusy(false);
    }
  };

  const insights = async () => {
    if (busy) return;
    const month = new Date().toISOString().slice(0, 7);
    push({ role: "user", content: "Give me insights for this month" });
    setBusy(true);
    try {
      const answer = await monthlyInsights(month, transactions);
      push({ role: "assistant", content: answer });
    } catch (err) {
      push({ role: "assistant", content: `Something went wrong: ${String(err)}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-500" />
          Ask your money
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Answers come from a one-time request to an AI provider. FinTRX stores
          nothing on any server; your history lives only on this device.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <div ref={listRef} className="space-y-3 max-h-[420px] overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-12 w-12 opacity-50" />}
              title="Nothing asked yet"
              description="Ask about spending, income, categories, or trends. Only you can see the answers."
            />
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-teal-500/10 border border-teal-500/30 px-4 py-2.5 text-sm"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2 [&_p:last-child]:mb-0"
                }
              >
                {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
              </div>
            ))
          )}
          {busy && (
            <div className="mr-auto flex items-center gap-2 text-sm text-muted-foreground px-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((q) => (
              <Button key={q} variant="outline" size="sm" onClick={() => ask(q)}>
                {q}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={insights}>
              Insights for this month
            </Button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Ask about your money..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
          />
          <Button
            type="submit"
            size="icon"
            disabled={busy || !input.trim()}
            className="bg-teal-500 hover:bg-teal-600 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
