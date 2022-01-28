import * as dotenv from "dotenv";
dotenv.config();
export default class Settings {
  static pinataInfo() : { key: string, secret: string } {
    const info = process.env.PINATA_INFO?.split('|');
    return info ? {
      key: info[0],
      secret: info[1]
    } : {
      key: '', 
      secret: ''
    }
  }

  static mongoURL() : string { 
    return process.env.MONGO_URL || ''
  }
  
  static mongoDebug() : string { 
    return process.env.MONGO_DEBUG_MODE || ''
  }
}