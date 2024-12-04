import axios from "axios";
import { useState } from "react";

const api = axios.create({
  baseURL: "/api",
});

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPostDetails = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/posts/details/${postId}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError("Failed to fetch post details");
      setLoading(false);
      console.error(err);
    }
  };

  const votePost = async (postId: string, voteType: "like" | "dislike") => {
    try {
      const userToken = localStorage.getItem("autf");
      const response = await api.post(`/posts/vote/${postId}`, {
        voteType,
        userToken,
      });
      if (response.status === 201) {
        localStorage.setItem("autf", response.data.userToken);
      }
      return response.data.post;
    } catch (err) {
      console.error("Failed to vote on post:", err);
      setError("Failed to vote on post");
      return null;
    }
  };

  const voteFeedback = async (
    feedbackId: string,
    vote: "upvote" | "downvote"
  ) => {
    try {
      const response = await api.post(`/feedbacks/votes/${feedbackId}`, {
        ipAddress: "193.168.0.252", // This should be dynamically obtained in a real app
        vote,
      });
      return response.data.updatedFeedbackVote;
    } catch (err) {
      console.error("Failed to vote on feedback:", err);
      setError("Failed to vote on feedback");
      return null;
    }
  };

  return { getPostDetails, votePost, voteFeedback, loading, error };
}
