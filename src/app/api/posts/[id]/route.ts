import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import FeedbackModel from "@/models/feedback.model";
import FeedbackVoteModel from "@/models/feedbackVote.model";
import { updatePostSchema } from "@/schemas/postSchema";

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
    const postPromise = PostModel.findOne({ userId, _id: id });

    // Resolve both queries concurrently
    const [post] = await Promise.all([postPromise]);

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

export async function PUT(request: Request) {
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
    const payload = await request.json();
    const { success, error, data } = updatePostSchema.safeParse(payload);
    if (!success) {
      const errors = error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation error.",
          errors,
        },
        { status: 400 }
      );
    }
    const { title, description } = data;

    const post = await PostModel.findOne({ userId, _id: id }).select(
      "_id title description likes dislikes isAcceptingFeedback createdAt"
    );

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    post.title = title ? title : post.title;
    post.description = description ? description : post.description;
    await post.save();

    return NextResponse.json(
      { success: true, message: "post updated.", post },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while updating post.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    // Extract the dynamic post ID from the request URL
    const { pathname } = new URL(request.url);
    const postId = pathname.split("/").pop(); // Assumes postId is the last segment

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID not provided." },
        { status: 400 }
      );
    }

    // Check if the post exists and belongs to the user
    const post = await PostModel.findOne({
      userId: user._id,
      _id: postId,
    }).select("_id");

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found or unauthorized access." },
        { status: 404 }
      );
    }

    // Fetch feedback IDs associated with the post
    const feedbacks = await FeedbackModel.find({ postId }).select("_id");
    const feedbackIds = feedbacks.map((feedback) => feedback._id);

    // Delete feedback votes for all associated feedbacks
    const deleteVotesPromise = FeedbackVoteModel.deleteMany({
      feedbackId: { $in: feedbackIds },
    });

    // Delete feedbacks and the post concurrently
    const deleteFeedbacksPromise = FeedbackModel.deleteMany({ postId });
    const deletePostPromise = PostModel.deleteOne({ _id: postId });

    await Promise.all([
      deleteVotesPromise,
      deleteFeedbacksPromise,
      deletePostPromise,
    ]);

    return NextResponse.json({
      success: true,
      message: "Post and associated feedback deleted successfully.",
    });
  } catch (error) {
    console.error("Error while deleting post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting post.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
