"use client";
import { DashboardHeader } from "@/components/custom/dashboard/header";
import { DashboardShell } from "@/components/custom/dashboard/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentPosts } from "@/components/custom/dashboard/recent-posts";
import { TopPosts } from "@/components/custom/dashboard/top-posts";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalFeedback: 0,
    averageEngagement: 0,
    weeklyGrowth: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/dashboard/stats`);
        if (response.status === 200) {
          setStats(response.data.stats);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Not able to fetch dashboard data",
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
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your Anonymous Feedback activity"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.weeklyGrowth} from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageEngagement}</div>
            <p className="text-xs text-muted-foreground">Feedback per post</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Your latest posts and their engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPosts />
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>
              Posts with the highest engagement and positive sentiment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopPosts />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
