import * as dotenv from "dotenv";
dotenv.config();
export default class Settings {
  static mongoURL() : string { 
    return process.env.MONGO_URL || ''
  }
  
  static mongoDebug() : string { 
    return process.env.MONGO_DEBUG_MODE || ''
  }
}