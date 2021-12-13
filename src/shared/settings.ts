import * as dotenv from "dotenv";
dotenv.config();
export default class Settings {
  static pinataInfo() : string {
    return process.env.PINATA_INFO || ''
  }

  static mongoURL() : string { 
    return process.env.MONGO_URL || ''
  }
  
  static mongoDebug() : string { 
    return process.env.MONGO_DEBUG_MODE || ''
  }
}