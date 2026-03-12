import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "../db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key");

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    plugins: [
        emailOTP({
            autoSignInAfterVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                let subject = "Your Verification Code";
                if (type === "sign-in") subject = "Sign in to PulseAPI";
                else if (type === "email-verification") subject = "Verify your PulseAPI Email";
                else if (type === "forget-password") subject = "PulseAPI Password Reset";

                try {
                    await resend.emails.send({
                        from: "PulseAPI <nagmani@email.nagmaniupadhyay.com.np>",
                        to: email,
                        subject: subject,
                        html: `<p>Your code is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
                    });
                } catch (error) {
                    console.error("Failed to send OTP email via Resend:", error);
                }
            },
        }),
    ],
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trustedOrigins: ["http://localhost:5174", "http://localhost:5173", "https://pulseapi.quantapar.com", "https://pulse-borols8xa-manu-sharmas-projects-fec69182.vercel.app"],
});