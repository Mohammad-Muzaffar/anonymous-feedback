"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, ArrowUp, ArrowDown } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  sentimentSummary: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface Feedback {
  _id: string;
  content: string;
  voteCount: {
    upvotes: number;
    downvotes: number;
  };
}

interface PostDetailsProps {
  postId: string;
}

export default function PostDetails({ postId }: PostDetailsProps) {
  const { getPostDetails, votePost, voteFeedback, loading, error } = useApi();
  const [post, setPost] = useState<Post | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      const data = await getPostDetails(postId);
      if (data) {
        setPost(data.post);
        setFeedbacks(data.feedbacks);
      }
    };
    fetchPostDetails();
  }, [postId]);

  const handlePostVote = async (voteType: "like" | "dislike") => {
    if (!post) return;
    try {
      const updatedPost = await votePost(post._id, voteType);
      if (updatedPost) {
        setPost((prevPost) => ({
          ...prevPost!,
          likes: updatedPost.likes,
          dislikes: updatedPost.dislikes,
        }));
      }
    } catch (error) {
      console.error("Error voting on post:", error);
    }
  };

  const handleFeedbackVote = async (
    feedbackId: string,
    vote: "upvote" | "downvote"
  ) => {
    try {
      const updatedFeedbackVote = await voteFeedback(feedbackId, vote);
      if (updatedFeedbackVote) {
        // Since the API doesn't return the updated vote count, we'll need to update it manually
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback._id === feedbackId
              ? {
                  ...feedback,
                  voteCount: {
                    upvotes:
                      vote === "upvote"
                        ? feedback.voteCount.upvotes + 1
                        : feedback.voteCount.upvotes,
                    downvotes:
                      vote === "downvote"
                        ? feedback.voteCount.downvotes + 1
                        : feedback.voteCount.downvotes,
                  },
                }
              : feedback
          )
        );
      }
    } catch (error) {
      console.error("Error voting on feedback:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <Button
                variant={post.likes > post.dislikes ? "default" : "outline"}
                onClick={() => handlePostVote("like")}
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes}
              </Button>
              <Button
                variant={post.dislikes > post.likes ? "default" : "outline"}
                onClick={() => handlePostVote("dislike")}
                className="ml-2"
              >
                <ThumbsDown className="mr-2 h-4 w-4" /> {post.dislikes}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-6 mb-4">Feedbacks</h2>
      {feedbacks.map((feedback) => (
        <Card key={feedback._id}>
          <CardContent className="pt-6">
            <p>{feedback.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedbackVote(feedback._id, "upvote")}
              >
                <ArrowUp className="mr-2 h-4 w-4" />{" "}
                {feedback.voteCount.upvotes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedbackVote(feedback._id, "downvote")}
                className="ml-2"
              >
                <ArrowDown className="mr-2 h-4 w-4" />{" "}
                {feedback.voteCount.downvotes}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
