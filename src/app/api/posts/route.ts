import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import { postSchema } from "@/schemas/postSchema";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  // Get the user session
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
    // Parse and validate the request body
    const payload = await request.json();
    const parsed = postSchema.safeParse(payload);

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

    const { title, description } = parsed.data;

    // Create a new post
    const post = new PostModel({
      title,
      description: description || null,
      userId: userId,
    });

    const newPost = await post.save();
    newPost.link = `${process.env.APP_URL}/feedbacks/${newPost._id}`;
    await newPost.save();

    return NextResponse.json(
      {
        success: true,
        message: "New post created.",
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while creating post.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  // Get the user session
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
    // Parse query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Build the filter query
    const filter: Record<string, any> = { userId: userId };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch posts with optional filters and sorting
    const posts = await PostModel.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .select(
        "_id title description likes dislikes isAcceptingFeedback createdAt"
      );

    // Count total posts for pagination metadata
    const totalPosts = await PostModel.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while retrieving posts:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while retrieving posts.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
