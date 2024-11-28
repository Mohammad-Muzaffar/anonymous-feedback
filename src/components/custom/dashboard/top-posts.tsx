import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export function TopPosts() {
  const { toast } = useToast();
  const [topPosts, setRecentPosts] = useState([
    {
      id: "",
      title: "Loading top posts...",
      engagement: "",
      sentiment: "",
      feedbackCount: 0,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/dashboard/top-posts`);
        if (response.status === 200) {
          if (response.data.topPosts.length === 0) {
            setRecentPosts([
              {
                id: "",
                title: "You do not have any top performing posts.",
                engagement: "",
                sentiment: "",
                feedbackCount: 0,
              },
            ]);
          } else {
            setRecentPosts(response.data.topPosts);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Error fetching top posts",
            description: error.response?.data.message,
            variant: "destructive",
          });
        } else {
          console.error(error);
        }
      }
    };
    fetchStats();
  }, [toast]);
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
