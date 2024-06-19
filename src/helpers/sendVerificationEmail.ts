import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Honest insights | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    if (res?.error?.message) {
      return { success: false, message: res?.error?.message };
    }
    console.log(`Resend email response : ${JSON.stringify(res)}`);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error(`Error sending verification email`);
    return { success: false, message: "Failed to send verification email" };
  }
}
