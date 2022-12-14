import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { IncomingMessage, ServerResponse } from "http";

import { environment } from "./environment";
import { getError } from "./errors";

export type QueryResponse<T> = [error: string | null, data: T | null];

const SET_COOKIE_HEADER = "set-cookie";

const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const response = await axios.post("/api/refresh", undefined, {
    headers: { cookie: req.headers.cookie! },
  });
  const cookies = response.headers[SET_COOKIE_HEADER];

  // req.headers.cookie as string | number | readonly string[] = cookies;
  res.setHeader(
    SET_COOKIE_HEADER,
    req.headers.cookie as string | number | readonly string[]
  );
};

const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  request: () => Promise<AxiosResponse>
) => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens(req, res);
        return await request();
      } catch (innerError: any) {
        throw getError(innerError);
      }
    }

    throw getError(error);
  }
};

export const fetcherSSR = async <T>(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
): Promise<QueryResponse<T>> => {
  try {
    const request = () =>
      axios.get(url, { headers: { cookie: req.headers.cookie! } });
    const { data } = await handleRequest(req, res, request);
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};
