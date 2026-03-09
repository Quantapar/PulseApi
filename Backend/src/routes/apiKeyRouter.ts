/// <reference path="../../types/express.d.ts" />
import { Router } from "express";
import { prisma } from "../../db";
import { tokenValidation } from "../middleware/tokenValidation";
import crypto from "crypto";

const apiKeyRouter = Router();

apiKeyRouter.use(tokenValidation);

apiKeyRouter.get("/", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: keys });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

apiKeyRouter.post("/", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required for the API Key" });
    }

    const generateApiKey = () => `pk_${crypto.randomBytes(24).toString('hex')}`;
    const newKey = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: newKey,
        userId: req.userId,
      },
    });

    res.status(201).json({ data: apiKey });
  } catch (error) {
    console.error("Error creating API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

apiKeyRouter.delete("/:id", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const key = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!key || key.userId !== req.userId) {
      return res.status(404).json({ error: "API Key not found or unauthorized" });
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    res.json({ message: "API Key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default apiKeyRouter;
