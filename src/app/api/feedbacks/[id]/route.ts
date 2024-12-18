import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import FeedbackModel from "@/models/feedback.model";
import FeedbackVoteModel from "@/models/feedbackVote.model";
import {
  deleteFeedbackSchema,
  updateFeedbackSchema,
} from "@/schemas/feedbackSchema";

export async function PUT(request: Request) {
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

    const payload = await request.json();
    const { success, error, data } = updateFeedbackSchema.safeParse(payload);
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
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

    const { content, userToken } = data;

    const feedback = await FeedbackModel.findById(id);

    const isIpMatch = await bcrypt.compare(ipAddress, feedback.ipAddress);
    const isUserTokenMatch = feedback.userToken === userToken;

    if (isIpMatch || isUserTokenMatch) {
      feedback.content = content;
      await feedback.save();
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized to edit.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: "feedback updated.", feedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching feedback:", error);

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

    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // Extract dynamic ID

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Post ID not provided." },
        { status: 400 }
      );
    }

    const payload = await request.json();
    const { success, error, data } = deleteFeedbackSchema.safeParse(payload);
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
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

    const { userToken } = data;

    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found.",
        },
        { status: 404 }
      );
    }

    const isIpMatch = await bcrypt.compare(ipAddress, feedback.ipAddress);
    const isUserTokenMatch = feedback.userToken === userToken;

    if (isIpMatch || isUserTokenMatch) {
      await FeedbackModel.deleteOne({
        _id: id,
      });
      await FeedbackVoteModel.deleteMany({
        feedbackId: id,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized to delete.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: "feedback deleted." },
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

    const feedback = await FeedbackModel.findById(id).populate("votes");
    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, feedback }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching feedback:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching feedback.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
