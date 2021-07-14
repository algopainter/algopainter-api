import Netlify from '../providers/netlify'
import Result from '../shared/result'

const handler = Netlify.createHandler<any>(
  async (json, queryString): Promise<Result<any>> => {
    return Result.success<any>("AlgoPainter API!", null);
  }
);

export { handler }