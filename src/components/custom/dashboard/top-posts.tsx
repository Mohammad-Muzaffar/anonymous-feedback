import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TopPosts() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Post Title</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>Sentiment</TableHead>
          <TableHead className="text-right">Feedback Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topPosts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{post.engagement}</TableCell>
            <TableCell>{post.sentiment}</TableCell>
            <TableCell className="text-right">{post.feedbackCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const topPosts = [
  {
    id: "1",
    title: "How can we improve our customer service?",
    engagement: "High",
    sentiment: "Positive",
    feedbackCount: 89,
  },
  {
    id: "2",
    title: "What new features would you like to see in our app?",
    engagement: "Very High",
    sentiment: "Very Positive",
    feedbackCount: 112,
  },
  {
    id: "3",
    title: "How likely are you to recommend our product to others?",
    engagement: "Medium",
    sentiment: "Neutral",
    feedbackCount: 67,
  },
  {
    id: "4",
    title: "What's your opinion on our new pricing model?",
    engagement: "High",
    sentiment: "Mixed",
    feedbackCount: 78,
  },
  {
    id: "5",
    title: "How can we make our onboarding process better?",
    engagement: "Medium",
    sentiment: "Positive",
    feedbackCount: 56,
  },
];
