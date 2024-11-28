import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import FeedbackModel from "@/models/feedback.model";
import { NextResponse } from "next/server";

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

  const userId = user._id;

  try {
    // Fetch all posts by the user
    const totalPosts = await PostModel.countDocuments({ userId });

    // Calculate total feedback based on the user's posts
    const userPosts = await PostModel.find({ userId }).select("_id");
    const postIds = userPosts.map((post) => post._id);

    const totalFeedback = await FeedbackModel.countDocuments({
      postId: { $in: postIds },
    });

    // Calculate average engagement
    const averageEngagement =
      totalPosts > 0 ? parseFloat((totalFeedback / totalPosts).toFixed(2)) : 0;

    // Calculate weekly growth in posts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyPosts = await PostModel.countDocuments({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    const weeklyGrowth = totalPosts - weeklyPosts;

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalPosts,
          totalFeedback,
          averageEngagement,
          weeklyGrowth,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error fetching dashboard stats.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
