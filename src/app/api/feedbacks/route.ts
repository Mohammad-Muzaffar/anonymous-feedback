import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { v4 as uuid } from "uuid";
import FeedbackModel from "@/models/feedback.model";
import requestIp from "request-ip";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Parse and validate the request body
    const payload = await request.json();
    const parsed = feedbackSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation error.",
          errors,
        },
        { status: 400 }
      );
    }
    const fakeRequest = {
      headers: Object.fromEntries(request.headers), // Convert Headers into plain object
    };
    // Help me with ip address I need client ip address.
    const ipAddress = requestIp.getClientIp(fakeRequest) || "127.0.0.1";
    console.log(ipAddress);
    
    const { postId, content } = parsed.data;
    let { userToken } = parsed.data;
    if (!userToken) {
      userToken = uuid();
    }

    const post = await PostModel.findOne({
      _id: postId,
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found.",
        },
        { status: 404 }
      );
    }

    // To avoid duplicate feedbacks:

    const prevFeedbacks = await FeedbackModel.find({
      postId,
    }).select("_id ipAddress userToken");

    // Check if any previous feedback has the same userToken or matches the hashed IP address
    let feedbackExists = false;

    for (const feedback of prevFeedbacks) {
      // Asynchronously compare the IP addresses and check userToken
      const isIpMatch = await bcrypt.compare(ipAddress, feedback.ipAddress);

      if (feedback.userToken === userToken || isIpMatch) {
        feedbackExists = true;
        break; // Stop once we find a match
      }
    }

    if (feedbackExists) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already submitted feedback for this post.",
        },
        { status: 409 } // Conflict status
      );
    }

    const hashedIp = await bcrypt.hash(ipAddress, 10);

    const feedback = new FeedbackModel({
      postId,
      content,
      ipAddress: hashedIp,
      userToken,
    });
    const newFeedback = await feedback.save();

    await PostModel.findByIdAndUpdate(
      postId,
      { $push: { feedbacks: newFeedback._id } },
      { new: true }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "New feedback submitted.",
        feedback: newFeedback,
        userToken,
      },
      { status: 201 }
    );

    response.cookies.set("au", userToken, {
      httpOnly: true, // The cookie can't be accessed by JavaScript (security)
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS in production
      maxAge: 60 * 60 * 24 * 30, // Cookie expires in 30 days
      path: "/", // The cookie is available for the entire domain
    });

    return response;
  } catch (error) {
    console.error("Error while creating feedback:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while creating feedback.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
