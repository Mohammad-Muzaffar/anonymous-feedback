"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

function VerifyUser() {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof verifyCodeSchema>> = async (
    data
  ) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data?.message || "Successfully email verified.",
        });
        router.replace(`/signin`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            error.response?.data.message ||
            "There was a problem while verifying email.",
        });
      } else {
        console.error(error);
      }
    } finally {
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-md text-[#051D39]">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl mb-6">
            Verify Account
          </h1>
          <p className="mb-2">Verification code has been sent to you email.</p>
          <p className="mb-4 text-sm">
            if not recieved try checking spam folder.
          </p>
        </div>
        <div className="text-center flex justify-center items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the verification code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default VerifyUser;
