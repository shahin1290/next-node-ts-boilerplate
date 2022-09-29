import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import cookie from "cookie";
import { IncomingHttpHeaders, ServerResponse } from "http";
import { environment } from "./environment";
import { getError } from "./errors";

export type QueryResponse<T> = [error: string | null, data: T | null];

const SET_COOKIE_HEADER = "set-cookie";

const refreshTokens = async (
  req: { headers: IncomingHttpHeaders },
  res: ServerResponse
) => {
  const cookies = cookie.parse(req.headers.cookie!);

  if (cookies.refresh) {
    const response = await axios.post(
      `${environment.apiUrl}/api/refresh`,
      undefined,
      {
        headers: { cookie: `refresh=${cookies.refresh}` },
      }
    );

    //const cookiess = response.headers[SET_COOKIE_HEADER];

    req.headers.cookie = cookies;
    res.setHeader(SET_COOKIE_HEADER, cookies);

    console.log("response", response.headers);
  }
};

const handleRequest = async (
  req: { headers: IncomingHttpHeaders },
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

export const fetcher = async <T>(
  req: { headers: IncomingHttpHeaders },
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
