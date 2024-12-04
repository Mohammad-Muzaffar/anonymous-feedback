"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Post {
  _id: string;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  isAcceptingFeedback: boolean;
  createdAt: string;
  link: string;
  sentimentSummary: {
    positive: number;
    neutral: number;
    negative: number;
  };
  commonFeedbackThemes: string[];
}

interface Feedback {
  _id: string;
  content: string;
  voteCount: {
    upvotes: number;
    downvotes: number;
  };
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalFeedbacks: number;
}

const PostFeedbackPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalFeedbacks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();
  const { toast } = useToast();

  const fetchPostAndFeedbacks = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/posts/${postId}`, {
        params: { page },
      });

      // Assuming the API response structure:
      // {
      //   success: true,
      //   post: { ...postDetails },
      //   feedbacks: [...feedbackList],
      //   pagination: { currentPage, totalPages, totalFeedbacks }
      // }
      const { data } = response;
      if (data.success) {
        setPost(data.post);
        setFeedbacks(data.feedbacks);
        setPagination(data.pagination);
      } else {
        throw new Error("Failed to fetch post and feedbacks");
      }
    } catch (error) {
      console.error("Error fetching post and feedbacks:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch post and feedbacks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndFeedbacks();
  }, [postId]);

  const handlePageChange = (page: number) => {
    fetchPostAndFeedbacks(page);
  };

  const copyLink = (link: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "The feedback link has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Failed to copy the link. Please try again.",
        });
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const totalSentiment =
    post.sentimentSummary.positive +
    post.sentimentSummary.neutral +
    post.sentimentSummary.negative;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
          <div className="flex items-center space-x-4 mt-2">
            <span className="flex items-center text-sm text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <ThumbsDown className="h-4 w-4 mr-1" /> {post.dislikes}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyLink(post.link)}
            >
              <Copy className="h-4 w-4 mr-2" /> Copy Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{post.description}</p>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Sentiment Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Positive</span>
                <Progress
                  value={
                    (post.sentimentSummary.positive / totalSentiment) * 100
                  }
                  className="w-2/3"
                />
                <span>{post.sentimentSummary.positive}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Neutral</span>
                <Progress
                  value={(post.sentimentSummary.neutral / totalSentiment) * 100}
                  className="w-2/3"
                />
                <span>{post.sentimentSummary.neutral}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Negative</span>
                <Progress
                  value={
                    (post.sentimentSummary.negative / totalSentiment) * 100
                  }
                  className="w-2/3"
                />
                <span>{post.sentimentSummary.negative}</span>
              </div>
            </div>
          </div>
          {post.commonFeedbackThemes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Common Feedback Themes</h3>
              <div className="flex flex-wrap gap-2">
                {post.commonFeedbackThemes.map((theme, index) => (
                  <Badge key={index} variant="secondary">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Feedbacks</h2>
      {feedbacks.map((feedback) => (
        <Card key={feedback._id} className="mb-4">
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-2">{feedback.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <ArrowUp className="mr-2 h-4 w-4" />{" "}
                  {feedback.voteCount.upvotes}
                </span>
                <span className="flex items-center">
                  <ArrowDown className="mr-2 h-4 w-4" />{" "}
                  {feedback.voteCount.downvotes}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                isActive={pagination.currentPage === 1}
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={pagination.currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                isActive={pagination.currentPage === pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PostFeedbackPage;
