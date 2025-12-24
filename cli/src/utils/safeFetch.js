import fetch from "node-fetch";
import { FetchError } from "node-fetch";

export async function safeFetch(url, options = {}) {

  let res;

  const controller = new AbortController(); // to handle timeouts
    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);

  try {
    res = await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      throw new FetchError("NETWORK_UNREACHABLE");
    }
    throw new FetchError("NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new FetchError("UNAUTHORIZED", res.status);
    }

    if (res.status === 404) {
      throw new FetchError("NOT_FOUND", res.status);
    }

    if (res.status >= 500) {
      throw new FetchError("SERVER_ERROR", res.status);
    }

    throw new FetchError("HTTP_ERROR", res.status);
  }

  return res;
}

