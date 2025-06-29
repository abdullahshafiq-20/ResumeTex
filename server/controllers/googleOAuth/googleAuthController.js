// authController.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/userSchema.js";
import { getOAuthClient, generateAuthUrl } from "../../utils/oauthUtils.js";
import bcrypt from "bcrypt";
dotenv.config();

// Step 1: Redirect to Google OAuth
export const googleAuth = async (req, res) => {
  // Generate auth URL with Gmail send scope
  const url = generateAuthUrl(['https://www.googleapis.com/auth/gmail.send']);
  res.redirect(url);
};

// Step 2: Google callback handler
export const googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user (now also storing refresh token)
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleRefreshToken: tokens.refresh_token // Store refresh token
      });
    } else if (tokens.refresh_token) {
      // Update refresh token if provided
      user.googleRefreshToken = tokens.refresh_token;
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '29days', // 29 days
    });

    // Send JWT to frontend (or set cookie)
    res.redirect(`${process.env.GOOGLE_REDIRECT_URI_1}?token=${token}`); // Replace with your frontend URL
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).send('Authentication Failed');
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-googleRefreshToken'); // Exclude sensitive data

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

// Log out user and revoke Google token
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user && user.googleRefreshToken) {
      // Revoke the refresh token (optional)
      const client = getOAuthClient();
      try {
        await client.revokeToken(user.googleRefreshToken);
      } catch (revokeError) {
        console.warn('Token revocation failed:', revokeError);
        // Continue with logout even if revocation fails
      }

      // Clear the refresh token from user record
      user.googleRefreshToken = undefined;
      await user.save();
    }

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Failed to log out' });
  }
};


export const validateUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user.subscribed) {
      return res.status(200).json({ message: "User is subscribed" });
    }

  } catch (error) {
    console.error("Error validating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const validateUserSecret = async (req, res) => {
  try {
    const { secret } = req.body;

    // Find users with a secret field (we'll check each one)
    const users = await User.find({ secret: { $exists: true } });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users with secret found" });
    }

    // Check each user's secret
    for (const user of users) {
      // Compare the provided secret with the stored hashed secret
      const isMatch = await bcrypt.compare(secret, user.secret);


      if (isMatch) {
        await User.findOneAndUpdate(
          { email: user.email },
          { isExtensionConnected: true },
          { new: true }
        );
        if (user.subscribed) {
          // const connection = await User.findOne({ secret: user.email });

          return res.status(200).json({
            message: "User is subscribed",
            success: true,
            user: { email: user.email, name: user.name }
          });
        } else {
          return res.status(403).json({
            message: "User found but not subscribed",
            success: false
          });
        }
      }
    }

    // If we get here, no user matched the secret
    return res.status(401).json({ message: "Invalid secret", success: false });
  } catch (error) {
    console.error("Error validating user:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}

export const getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ isExtensionConnected: user.isExtensionConnected });
  }
  catch (error) {
    console.error("Error fetching connection status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}