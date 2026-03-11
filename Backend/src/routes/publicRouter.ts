import express from "express";
import { prisma } from "../../db";

export const publicRouter = express.Router();
publicRouter.get("/status/:shareToken", async (req, res) => {
  try {
    const { shareToken } = req.params;

    const endpoint = await prisma.endpoint.findUnique({
      where: { shareToken },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!endpoint) {
      return res
        .status(404)
        .json({ success: false, error: "Status page not found" });
    }

    const totalPings = await prisma.ping.count({
      where: { endpointId: endpoint.id },
    });

    const upPings = await prisma.ping.count({
      where: { endpointId: endpoint.id, status: "UP" },
    });

    const uptime =
      totalPings > 0
        ? parseFloat(((upPings / totalPings) * 100).toFixed(2))
        : 0;

    const pings = await prisma.ping.findMany({
      where: { endpointId: endpoint.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return res.json({
      success: true,
      data: {
        name: endpoint.name,
        url: endpoint.url,
        method: endpoint.method,
        status: endpoint.status,
        expectedStatus: endpoint.expectedStatus,
        interval: endpoint.interval,
        lastCheckedAt: endpoint.lastCheckedAt,
        uptime,
        owner: endpoint.user?.name || "Anonymous",
        pings,
      },
    });
  } catch (error) {
    console.error("Failed to fetch public status:", error);
    return res
      .status(500)
      .json({ success: false, error: "INTERNAL_SERVER_ERROR" });
  }
});
