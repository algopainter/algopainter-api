import * as dotenv from "dotenv";
dotenv.config();

export const Settings : Record<string, string> = {
  mongoURL: process.env.MONGO_URL,
  mongoDebug: process.env.MONGO_DEBUG_MODE,
}