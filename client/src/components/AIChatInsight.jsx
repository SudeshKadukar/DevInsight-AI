import React, { useMemo, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

function generateAssistantReply(question, metrics, insights) {
  const q = question.toLowerCase();
  const leadTime = metrics?.leadTime?.value ?? 0;
  const cycleTime = metrics?.cycleTime?.value ?? 0;
  const bugRate = metrics?.bugRate?.value ?? 0;
  const deploymentFrequency = metrics?.deploymentFrequency?.value ?? 0;
  const prThroughput = metrics?.prThroughput?.value ?? 0;

  if (q.includes("lead") || q.includes("slow")) {
    return `Lead Time is ${leadTime} days. This suggests work may be waiting in review or release queues. Try splitting larger PRs and asking for earlier reviews.`;
  }

  if (q.includes("bug") || q.includes("quality")) {
    return `Bug Rate is ${bugRate}. Since this is escaped production bug ratio, tighten regression checks before merge and add one focused test for each risky change.`;
  }

  if (q.includes("deploy")) {
    return `Deployment Frequency is ${deploymentFrequency} this month. If frequency is stable but lead time is high, focus on reducing queue time between merge and release.`;
  }

  if (q.includes("throughput") || q.includes("pr")) {
    return `PR Throughput is ${prThroughput}. Throughput looks healthier when PR size is small and review time is predictable.`;
  }

  if (q.includes("cycle")) {
    return `Cycle Time is ${cycleTime} days. If this remains high, break tickets into smaller deliverables and reduce in-progress multitasking.`;
  }

  return insights?.likelyStory?.[0]
    ? `${insights.likelyStory[0]} Recommended action: ${insights.recommendedActions?.[0] ?? "Keep delivery slices small."}`
    : "Ask about lead time, cycle time, bug rate, deployment frequency, or PR throughput.";
}

const AIChatInsight = ({ data, insights }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me about your metrics and I will suggest practical next steps.",
    },
  ]);

  const quickPrompts = useMemo(
    () => [
      "Why is lead time high?",
      "How can I reduce bug rate?",
      "What should I do next sprint?",
    ],
    []
  );

  const ask = (text) => {
    if (!text.trim()) return;
    const reply = generateAssistantReply(text, data?.metrics, insights);
    setMessages((prev) => [...prev, { role: "user", text }, { role: "assistant", text: reply }]);
    setQuestion("");
  };

  return (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={18} className="text-indigo-500" />
        <h2 className="font-semibold text-lg">AI Chatboard Insight</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => ask(prompt)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="max-h-56 overflow-y-auto space-y-2 mb-3 pr-1">
        {messages.map((m, idx) => (
          <div
            key={`${m.role}-${idx}`}
            className={`text-sm rounded-lg px-3 py-2 ${
              m.role === "assistant"
                ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                : "bg-indigo-600 text-white ml-8"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(question);
          }}
          placeholder="Ask about your metrics..."
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        />
        <button
          onClick={() => ask(question)}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm"
        >
          <Send size={14} />
          Ask
        </button>
      </div>
    </section>
  );
};

export default AIChatInsight;
