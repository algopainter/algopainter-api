/* eslint-disable @typescript-eslint/no-unused-vars */
import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import { EventQueryStringParameters } from "@netlify/functions/src/function/event";
import Exception from "../shared/exception";
import Result from "../shared/result";

/**
 * Type especification of action function of a handler
 */
type Action<T> = (json: string | null, queryString: EventQueryStringParameters | null) => Promise<Result<T>>;

/**
 * Handler factory for netlify functions behavior
 * 
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const handler = Netlify.createHandler<IAuction>(function: Action<IAuction>);
 * ```
 * 
 */
export default class Netlify {

  /**
   * Creates a netlify handler function and bases the response on Result<TResult>
   * @typeParam TResult Type of parameter used on service
   * @param action Custom action based on the request. json = body request 
   * @returns Netlify Handler
   */
  static createHandler<TResult>(action: Action<TResult>): Handler {
    return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
      try {
        const actionResult = await action(event.body, event.queryStringParameters);
        if (actionResult.success) {
          return {
            statusCode: 200,
            body: actionResult.data ? JSON.stringify(actionResult.data) : actionResult.message
          }
        }
        return {
          statusCode: 400,
          body: actionResult.data ? JSON.stringify(actionResult.data) : actionResult.message
        }
      } catch (ex) {
        console.log(ex);
        if (ex instanceof Exception) {
          return {
            statusCode: 400,
            body: ex.formattedMessage
          }
        }
        return {
          statusCode: 500,
          body: ex.toString()
        }
      }
    }
  }
}