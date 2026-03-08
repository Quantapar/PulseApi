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
