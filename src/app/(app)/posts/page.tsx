"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "usehooks-ts";

interface Post {
  _id: string;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  isAcceptingFeedback: boolean;
  createdAt: string;
  link: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit] = useState(6);
  const debouncedSearch = useDebounceCallback(() => fetchPosts(1), 450);
  const router = useRouter();
  const { toast } = useToast();

  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = response.data;
      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, limit]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPosts(page);
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
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  if(!posts || posts.length === 0){
    return (
      <div className="container mx-auto px-5 py-4">
      <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        You do not have any posts yet.
      </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-5 py-4">
      <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                </span>
                <span className="flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-1" /> {post.dislikes}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => router.push(`/posts/feedback/${post._id}`)}
              >
                View Feedback
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyLink(post.link)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy feedback link</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                isActive={pagination.currentPage <= 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={pagination.currentPage === i + 1}
                  onClick={() => {
                    if (pagination.currentPage !== i + 1) {
                      handlePageChange(i + 1);
                    }
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                isActive={pagination.currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PostsList;
