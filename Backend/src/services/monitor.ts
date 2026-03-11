import { prisma } from "../../db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function pingEndpoint(endpoint: any) {
  const startTime = Date.now();
  let status = "DOWN";
  let statusCode: number | null = null;
  let responseTime = 0;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(endpoint.url, {
      method: endpoint.method,
      signal: controller.signal,
      headers: {
        "User-Agent": "PulseAPI-Monitor/1.0",
      },
    });

    clearTimeout(timeoutId);

    responseTime = Date.now() - startTime;
    statusCode = res.status;

    if (res.status === endpoint.expectedStatus) {
      status = "UP";
    }
  } catch (error) {
    responseTime = Date.now() - startTime;
  }

  await prisma.ping.create({
    data: {
      endpointId: endpoint.id,
      status,
      responseTime,
      statusCode,
    },
  });

  if (status === "DOWN" && endpoint.status !== "DOWN") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: endpoint.userId },
      });

      if (!user || !user.email) {
        console.warn(
          `[Monitor] No user/email found for endpoint ${endpoint.name} (userId: ${endpoint.userId})`,
        );
      } else if (!user.emailAlerts) {
        console.log(
          `[Monitor] Email alerts disabled for user ${user.email}, skipping alert for ${endpoint.name}`,
        );
      } else {
        const fromAddress =
          process.env.RESEND_FROM_EMAIL ||
          "PulseAPI Alerts <onboarding@resend.dev>";
        const { data, error } = await resend.emails.send({
          from: fromAddress,
          to: user.email,
          subject: `Alert: ${endpoint.name} is DOWN`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e74c3c;"> Endpoint Down Alert</h2>
              <p>Hello ${user.name || "User"},</p>
              <p>Your monitored API endpoint <strong>${endpoint.name}</strong> has gone <span style="color: #e74c3c; font-weight: bold;">DOWN</span>.</p>
              <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">URL</td><td style="padding: 8px; border: 1px solid #ddd;">${endpoint.url}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Status Code</td><td style="padding: 8px; border: 1px solid #ddd;">${statusCode || "Timeout/Error"}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Response Time</td><td style="padding: 8px; border: 1px solid #ddd;">${responseTime}ms</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Detected At</td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td></tr>
              </table>
              <p>Please check your application immediately.</p>
              <p style="color: #888; font-size: 12px;">— PulseAPI Monitoring</p>
            </div>`,
        });

        if (error) {
          console.error(`[Monitor] Resend API error for ${user.email}:`, error);
        } else {
          console.log(
            `[Monitor] Sent downtime alert email to ${user.email} for endpoint ${endpoint.name} (id: ${data?.id})`,
          );
        }
      }
    } catch (emailErr) {
      console.error("[Monitor] Failed to send downtime alert email:", emailErr);
    }
  }

  if (status === "UP" && endpoint.status === "DOWN") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: endpoint.userId },
      });

      if (user?.email && user.emailAlerts) {
        const fromAddress =
          process.env.RESEND_FROM_EMAIL ||
          "PulseAPI Alerts <onboarding@resend.dev>";
        const { error } = await resend.emails.send({
          from: fromAddress,
          to: user.email,
          subject: `Recovered: ${endpoint.name} is back UP`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #27ae60;">Endpoint Recovered</h2>
              <p>Hello ${user.name || "User"},</p>
              <p>Your monitored API endpoint <strong>${endpoint.name}</strong> is back <span style="color: #27ae60; font-weight: bold;">UP</span>.</p>
              <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">URL</td><td style="padding: 8px; border: 1px solid #ddd;">${endpoint.url}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Status Code</td><td style="padding: 8px; border: 1px solid #ddd;">${statusCode}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Response Time</td><td style="padding: 8px; border: 1px solid #ddd;">${responseTime}ms</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Recovered At</td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td></tr>
              </table>
              <p style="color: #888; font-size: 12px;">— PulseAPI Monitoring</p>
            </div>`,
        });

        if (error) {
          console.error(
            `[Monitor] Resend API error for recovery email:`,
            error,
          );
        } else {
          console.log(
            `[Monitor] Sent recovery email to ${user.email} for endpoint ${endpoint.name}`,
          );
        }
      }
    } catch (emailErr) {
      console.error("[Monitor] Failed to send recovery email:", emailErr);
    }
  }

  await prisma.endpoint.update({
    where: { id: endpoint.id },
    data: {
      status,
      lastCheckedAt: new Date(),
    },
  });

  console.log(
    `[Monitor] Pinged ${endpoint.name} (${endpoint.url}) - Status: ${status} - Time: ${responseTime}ms`,
  );
}

let isChecking = false;

export function startMonitoringService() {
  console.log("[Monitor] Starting endpoint monitoring service...");

  setInterval(async () => {
    if (isChecking) return;
    isChecking = true;

    try {
      const endpoints = await prisma.endpoint.findMany();
      const now = new Date();

      const pingPromises: Promise<void>[] = [];

      for (const endpoint of endpoints) {
        let needsCheck = false;

        if (!endpoint.lastCheckedAt) {
          needsCheck = true;
        } else {
          const timeSinceLastCheckMs =
            now.getTime() - endpoint.lastCheckedAt.getTime();

          if (timeSinceLastCheckMs >= endpoint.interval * 1000) {
            needsCheck = true;
          }
        }

        if (needsCheck) {
          pingPromises.push(
            pingEndpoint(endpoint).catch((err) =>
              console.error("[Monitor] Ping failed:", err),
            ),
          );
        }
      }

      if (pingPromises.length > 0) {
        await Promise.allSettled(pingPromises);
      }
    } catch (e) {
      console.error("[Monitor] Error in monitoring loop:", e);
    } finally {
      isChecking = false;
    }
  }, 5000);
}
