import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
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
    // Fetch top posts with at least 10 feedbacks, sorted by feedback count
    const posts = await PostModel.find({
      userId,
    })
      .populate("feedbacks", "_id") // Populate feedbacks to count them
      .select("title feedbacks sentimentSummary createdAt")
      .lean();

    // Filter posts with at least 10 feedbacks
    const filteredPosts = posts.filter((post) => post.feedbacks.length > 10);

    // Transform data into the required format
    const topPosts = filteredPosts
      .map((post) => {
        const { _id, title, feedbacks, sentimentSummary } = post;

        // Determine sentiment based on sentimentSummary
        let sentiment = "Mixed";
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
        } else if (
          sentimentSummary.neutral > sentimentSummary.positive &&
          sentimentSummary.neutral > sentimentSummary.negative
        ) {
          sentiment = "Neutral";
        }

        // Calculate engagement level
        let engagement = "Medium";
        if (feedbacks.length > 50 && feedbacks.length <= 100) engagement = "High";
        else if (feedbacks.length > 100) engagement = "Very High";

        return {
          id: _id,
          title,
          engagement,
          sentiment,
          feedbackCount: feedbacks.length,
        };
      })
      .sort((a, b) => b.feedbackCount - a.feedbackCount) // Sort by feedback count
      .slice(0, 5); // Limit to 5 posts

    return NextResponse.json(
      {
        success: true,
        topPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching top posts:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error fetching top posts.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
