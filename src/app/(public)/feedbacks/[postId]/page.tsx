"use client";

import * as zod from "zod";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  LinkIcon,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const FeedbackPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { postId } = useParams();
  const router = useRouter();

  const feedbackSchema = zod.object({
    content: zod.string({ message: "content is required." }),
  });
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof feedbackSchema>> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/feedbacks", {
        postId,
        content: data.content,
      });

      if (response.status === 201) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
        localStorage.setItem("auser", response.data.userToken);
        router.push(`/public/posts/${postId}`);
      } else {
        throw new Error("Feedback submission failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: error.response?.data.message,
        });
      } else {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`/api/posts/details/${postId}`);
        if (response.data.success) {
          setPost(response.data.post);
        } else {
          throw new Error("Failed to fetch post details");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch post details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId, toast]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : post ? (
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-white p-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 flex items-center mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                Created on {new Date(post.createdAt).toLocaleDateString()}
              </CardDescription>
              <Separator className="my-4" />
              <CardContent className="p-0">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-gray-700">{post.likes}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-gray-700">{post.dislikes}</span>
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      navigator.clipboard.writeText(post.link);
                      toast({
                        title: "Link Copied",
                        description:
                          "The post link has been copied to your clipboard.",
                      });
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ) : (
          <div className="text-center text-red-600">
            Failed to load post details
          </div>
        )}

        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gray-50 border-b p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Submit Your Feedback
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500 mt-2">
              We value your honest and anonymous feedback. Please share your
              thoughts below.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium text-gray-900">
                        Your Feedback
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your feedback here..."
                          className="min-h-[150px] resize-none border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
