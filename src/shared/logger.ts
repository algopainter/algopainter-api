export default class Logger {
  public static get date() : string {
    const currDT = new Date();
    return (
      currDT.getFullYear() +
      '-' +
      (currDT.getMonth() + 1) +
      '-' +
      currDT.getDate() +
      ' ' +
      currDT.getHours() +
      ':' +
      currDT.getMinutes() +
      ':' +
      currDT.getSeconds()
    );
  }

  public static info<T>(message: T) : void {
    console.info(`\r\n${Logger.date} [INFO] ${JSON.stringify(message)}`);
  }

  public static error<T>(message: T) : void {
    console.error(`\r\n${Logger.date} [ERROR] ${JSON.stringify(message)}`);
  }

  public static warn<T>(message: T) : void {
    console.warn(`\r\n${Logger.date} [WARNING] ${JSON.stringify(message)}`);
  }

  public static debug<T>(message: T) : void {
    console.debug(`\r\n${Logger.date} [DEBUG] ${JSON.stringify(message)}`);
  }

  public static raw<T>(object: T) : void {
    console.log(object);
  }
}
