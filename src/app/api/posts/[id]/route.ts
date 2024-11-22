import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import FeedbackModel from "@/models/feedback.model";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // Extract dynamic ID

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Post ID not provided." },
        { status: 400 }
      );
    }

    const userId = user._id;
    const postPromise = PostModel.findOne({ userId, _id: id }).select(
      "title description likes dislikes isAcceptingFeedback createdAt"
    );
    const feedbackPromise = FeedbackModel.find({ postId: id }).select(
      "content createdAt votes"
    );

    // Resolve both queries concurrently
    const [post, feedback] = await Promise.all([postPromise, feedbackPromise]);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, post, feedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while retrieving post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while retrieving post.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
