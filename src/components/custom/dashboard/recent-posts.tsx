import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export function RecentPosts() {
  const { toast } = useToast();
  const [recentPosts, setRecentPosts] = useState([
    {
      id: "",
      title: "Loading your posts...",
      engagement: 0,
      sentiment: "",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/dashboard/recent-posts`);
        if (response.status === 200) {
          if (response.data.recentPosts.length === 0) {
            setRecentPosts([
              {
                id: "",
                title: "You don't have any posts.",
                engagement: 0,
                sentiment: "",
              },
            ]);
          } else {
            setRecentPosts(response.data.recentPosts);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Error fetching recent posts",
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
    <div className="space-y-8">
      {recentPosts.map((post, index) => (
        <div key={post.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{index + 1}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{post.title}</p>
            <p className="text-sm text-muted-foreground">
              {post.engagement} engagements
            </p>
          </div>
          <div className="ml-auto font-medium">{post.sentiment}</div>
        </div>
      ))}
    </div>
  );
}
