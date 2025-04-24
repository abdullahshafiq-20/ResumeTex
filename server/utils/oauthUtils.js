// utils/oauthUtils.js
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

// Create and export a singleton OAuth client
export const getOAuthClient = () => {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// Helper to set up client with refresh token
export const setupOAuthWithRefreshToken = (refreshToken) => {
  const client = getOAuthClient();
  client.setCredentials({
    refresh_token: refreshToken
  });
  return client;
};

// Helper to generate authorization URL
export const generateAuthUrl = (scopes = []) => {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Always show consent screen to get a refresh token
    scope: [
      'profile', 
      'email',
      ...scopes
    ]
  });
};