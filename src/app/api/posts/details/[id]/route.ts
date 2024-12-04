import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // Extract dynamic ID

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Post ID not provided." },
        { status: 400 }
      );
    }

    // Find the post and populate the feedbacks field
    const post = await PostModel.findOne({ _id: id }).select(
      "sentimentSummary _id title description likes dislikes isAcceptingFeedback commonFeedbackThemes createdAt link"
    );

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post }, { status: 200 });
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
