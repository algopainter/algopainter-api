import App from '../app';
import serverless, { Handler } from 'serverless-http';

const handler : Handler = serverless(App.expressApp);

export { handler };