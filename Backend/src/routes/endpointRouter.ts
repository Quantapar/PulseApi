/// <reference path="../../types/express.d.ts" />
import express from "express";
import { prisma } from "../../db";
import { tokenValidation } from "../middleware/tokenValidation";
import { endpointSchema } from "../validator/endpointSchema";

export const endpointRouter = express.Router();

endpointRouter.use(tokenValidation);

endpointRouter.post("/", async (req, res) => {
  try {
    const parsed = endpointSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        issues: parsed.error.issues,
      });
    }

    const { name, url, method, expectedStatus, interval } = parsed.data;

    if (!req.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const endpoint = await prisma.endpoint.create({
      data: {
        name,
        url,
        method,
        expectedStatus,
        interval,
        userId: req.userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: endpoint,
    });
  } catch (error) {
    console.error("Failed to create endpoint:", error);
    return res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

endpointRouter.get("/", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const endpoints = await prisma.endpoint.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: endpoints,
    });
  } catch (error) {
    console.error("Failed to fetch endpoints:", error);
    return res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

endpointRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const endpoint = await prisma.endpoint.findFirst({
      where: { id, userId: req.userId }
    });

    if (!endpoint) {
      return res.status(404).json({ success: false, error: "Endpoint not found or unauthorized" });
    }

    const totalPings = await prisma.ping.count({
      where: { endpointId: id }
    });

    const upPings = await prisma.ping.count({
      where: { endpointId: id, status: "UP" }
    });

    const uptime = totalPings > 0 ? parseFloat(((upPings / totalPings) * 100).toFixed(2)) : 0;

    return res.json({
      success: true,
      data: {
        ...endpoint,
        uptime,
      },
    });
  } catch (error) {
    console.error("Failed to fetch endpoint details:", error);
    return res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

endpointRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const deleted = await prisma.endpoint.deleteMany({
      where: { 
        id, 
        userId: req.userId 
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ success: false, error: "Endpoint not found or unauthorized" });
    }

    return res.json({
      success: true,
      message: "Endpoint deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete endpoint:", error);
    return res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

endpointRouter.get("/:id/pings", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const endpoint = await prisma.endpoint.findFirst({
      where: { id, userId: req.userId }
    });

    if (!endpoint) {
      return res.status(404).json({ success: false, error: "Endpoint not found or unauthorized" });
    }

    const pings = await prisma.ping.findMany({
      where: { endpointId: id },
      orderBy: { createdAt: "desc" },
      take: 100 
    });

    return res.json({
      success: true,
      data: pings,
    });
  } catch (error) {
    console.error("Failed to fetch pings:", error);
    return res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});
