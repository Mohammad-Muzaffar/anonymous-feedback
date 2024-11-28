import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentPosts() {
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

const recentPosts = [
  {
    id: "1", // id of the post
    title: "How can we improve our product?",
    engagement: 24, // No of feedback to this post
    sentiment: "Positive",
  },
];
