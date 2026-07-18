import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// The homepage fires its data requests the instant it mounts. In local dev the
// Vite server is usually up a few seconds before the backend finishes booting,
// so that first request can hit a connection-refused / network error. With no
// retry the section would then stay stuck on "No … to show right now." until a
// manual refresh. Retry transient failures a few times with a short backoff so
// the UI recovers on its own once the backend becomes reachable. HTTP 4xx
// responses (e.g. 404) are treated as final — retrying them would not help.
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 1500;

const isRetryable = (err) => {
  // Network / connection errors have no response; retry those. For HTTP errors
  // only retry 5xx (server hiccup / still warming up), not 4xx.
  const status = err?.response?.status;
  if (status === undefined) return true;
  return status >= 500;
};

const useFetch = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Bump this to force a manual refetch via refetchData().
  const [reloadKey, setReloadKey] = useState(0);
  const refetchData = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    let timer;
    const controller = new AbortController();

    setLoading(true);
    setError(false);

    const attempt = (tries) => {
      axios
        .get(url, { signal: controller.signal })
        .then((res) => {
          if (cancelled) return;
          setData(res.data);
          setError(false);
          setLoading(false);
        })
        .catch((err) => {
          if (cancelled || axios.isCancel?.(err) || err?.code === "ERR_CANCELED")
            return;
          if (tries < MAX_RETRIES && isRetryable(err)) {
            timer = setTimeout(() => attempt(tries + 1), RETRY_DELAY_MS);
            return;
          }
          setData(null);
          setError(true);
          setLoading(false);
        });
    };

    attempt(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [url, reloadKey]);

  return { data, error, loading, refetchData };
};

export default useFetch;
