import { errResponseObjectType, successResponseObjectType } from "../../types";
import { logger } from "../../utils/winston";

function processError(e: unknown, service: string): errResponseObjectType {
 let message = "";
 if (typeof e == "string") {
  message = e;
 } else if (e instanceof Error) {
  message = e.message;
 }

 logger.error(`[${service}] error - ${message}`);

 return {
  success: false,
  statusCode: 500,
  message,
 };
}

function processFailedResponse(code: number | 400, message: string, service: string): errResponseObjectType {
 logger.error(`[${service}] error - ${message}`);
 return {
  success: false,
  statusCode: code,
  message,
 };
}

function processResponse(
 code: number | 200,
 // eslint-disable-next-line @typescript-eslint/ban-types
 payload: Record<string, unknown> | Record<string, unknown>[] | string | Record<string, never> | object
): successResponseObjectType {
 return {
  success: true,
  statusCode: code,
  payload,
 };
}

export { processError, processFailedResponse, processResponse };
