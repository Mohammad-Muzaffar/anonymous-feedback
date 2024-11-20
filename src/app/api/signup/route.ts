import dbConnect from "@/models/db.connect";
import UserModel from "@/models/user.model";
import { signUpSchema } from "@/schemas/signUpSchema";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const payload = await request.json();

    const parsed = signUpSchema.safeParse(payload);
    if (!parsed.success) {
      return Response.json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.errors,
      });
    }
    const { username, email, password } = payload;

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists. Please login.",
          },
          {
            status: 400,
          }
        );
      } else {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        existingUserByEmail.password = password;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();
      }
    } else {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user. ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user. " + error,
      },
      {
        status: 500,
      }
    );
  }
}
