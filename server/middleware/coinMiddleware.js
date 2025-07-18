import express from "express";
import { CoinLog, User } from "../models/userSchema.js";
import { emitCoinDeduction } from "../config/socketConfig.js";
import { triggerStatsUpdate } from "../utils/trigger.js";

const transactionTemplate = {
  aiUpload: {
    action: "aiUpload",
    amount: 10,
    description: "Transfomred resume using AI"
  },
  upload : {
    action: "upload",
    amount: 3,
    description: "Uploaded a new resume"
  },
  geminiEmail: {
    action: "geminiEmail",
    amount: 7,
    description: "Generated AI email with Gemini"
  },
  aiEmail: {
    action: "aiEmail",
    amount: 2,
    description: "Generated AI email"
  },
  reAiEmail: {
    action: "reAiEmail",
    amount: 2,
    description: "Regenerated AI email"
  },
  scrapedPost: {
    action: "scrapedPost",
    amount: 3,
    description: "Scraped job post"
  }
}
export const coinGateAsync = async (template, userid) => {
  try {
    const { action, amount, description } = transactionTemplate[template];
    const userId = userid;
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    if (user.coins < amount) {
      return false;
    }

    // Deduct coins
    user.coins -= amount;
    await user.save();

    emitCoinDeduction(userId, { action, amount: user.coins, description });
    triggerStatsUpdate(userId);

    await CoinLog.create({
      userId,
      action,
      amount: -amount,
      description,
      timestamp: new Date(),
    });
    return true;
  } catch (err) {
    console.error('Coin middleware error:', err);
    return false;
  }
};



export const coinGate = (template) => {
  return async (req, res, next) => {
    console.log('Coin middleware triggered for template:', template);
    try {
      const { action, amount, description } = transactionTemplate[template];
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.coins < amount) {
        return res.status(403).json({ error: 'Insufficient coins' });
      }

      console.log('User found:', userId, 'Coins available:', user.coins, 'Amount to deduct:', amount);
      // Deduct coins
      res.on('finish', async () => {
        // Deduct coins
        user.coins -= amount;
        await user.save();

        emitCoinDeduction(userId, { action, amount: user.coins, description });
        triggerStatsUpdate(userId);

        console.log('Deducted coins:', amount, 'for action:', action);

        await CoinLog.create({
          userId,
          action,
          amount: -amount,
          description,
          timestamp: new Date(),
        });
      });

      next();
    } catch (err) {
      console.error('Coin middleware error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
