export function generateInsights(data) {
  let insights = [];
  let suggestions = [];

  if (!data) return { insights, suggestions };

  if (data.leadTime > 5) {
    insights.push({
      title: "High Lead Time",
      description: "Lead time is consistently high, indicating that delivery from start to finish is slow.",
      type: "warning"
    });
    suggestions.push("Break tasks into smaller, more manageable chunks.");
  } else {
    insights.push({
      title: "Excellent Lead Time",
      description: "Lead time is within optimal range.",
      type: "success"
    });
  }

  if (data.bugRate > 10) {
    insights.push({
      title: "Increasing Bug Rate",
      description: "Bug rate is above threshold, pointing to potential code quality issues.",
      type: "danger"
    });
    suggestions.push("Improve automated testing and enforce stricter code reviews.");
  }

  if (data.prSize > 500) {
    insights.push({
      title: "Large PR Sizes",
      description: "Pull Request sizes exceed 500 lines, making them harder to review effectively.",
      type: "warning"
    });
    suggestions.push("Encourage developers to keep PRs small and focused on a single concern.");
  }

  if (data.cycleTime > 3) {
    suggestions.push("Review CI/CD pipelines to identify deployment bottlenecks.");
  }

  return { insights, suggestions };
}
