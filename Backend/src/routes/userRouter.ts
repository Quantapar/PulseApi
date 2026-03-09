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
