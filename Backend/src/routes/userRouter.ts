/// <reference path="../../types/express.d.ts" />
import express from "express";
import { prisma } from "../../db";
import { tokenValidation } from "../middleware/tokenValidation";

export const userRouter = express.Router();

userRouter.get("/dashboard", tokenValidation, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

userRouter.get("/settings", tokenValidation, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { name: true, email: true, emailAlerts: true },
    });
    if (!user) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

userRouter.put("/settings", tokenValidation, async (req, res) => {
  try {
    const { name, emailAlerts } = req.body;
    
    // Create an update payload dynamically
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (emailAlerts !== undefined) updateData.emailAlerts = emailAlerts;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, error: "No data provided" });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: { name: true, email: true, emailAlerts: true },
    });

    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});
