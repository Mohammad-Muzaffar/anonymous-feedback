import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
// import FeedbackModel from "@/models/feedback.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  // Authenticate the user
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated." },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // Define the two-week threshold
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Fetch recent posts from the past 2 weeks (limit to 5)
    let posts = await PostModel.find({
      userId,
      createdAt: { $gte: twoWeeksAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("feedbacks", "_id") // Populate feedbacks for engagement count
      .select("title feedbacks sentimentSummary createdAt");

    // If no posts found in the 2-week window, fetch the latest post
    if (posts.length === 0) {
      posts = await PostModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate("feedbacks", "_id")
        .select("title feedbacks sentimentSummary createdAt");
    }

    // Transform data into the required format
    const recentPosts = posts.map((post) => {
      const { _id, title, feedbacks, sentimentSummary } = post;

      // Determine sentiment based on sentimentSummary
      let sentiment = "Neutral";
      if (
        sentimentSummary.positive > sentimentSummary.neutral &&
        sentimentSummary.positive > sentimentSummary.negative
      ) {
        sentiment = "Positive";
      } else if (
        sentimentSummary.negative > sentimentSummary.neutral &&
        sentimentSummary.negative > sentimentSummary.positive
      ) {
        sentiment = "Negative";
      }

      return {
        id: _id.toString(),
        title,
        engagement: feedbacks.length,
        sentiment,
      };
    });

    return NextResponse.json(
      {
        success: true,
        recentPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recent posts:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error fetching recent posts.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
