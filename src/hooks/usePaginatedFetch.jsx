import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

// Server-side pagination with automatic infinite scroll.
//
// Fetches page 1 when mounted (and again whenever `url` changes, resetting
// the list - e.g. switching years on the Events page), then loads the next
// page whenever the sentinel element approaches the viewport. Uses an
// IntersectionObserver (no scroll polling), guards against duplicate
// in-flight requests, appends without refetching earlier pages, and stops
// once the server reports hasNext: false.
//
// Expects the backend envelope { data: [...], pagination: {...} } but also
// tolerates a plain array (treated as a single, final page).
//
// Returns:
//   items       - all rows fetched so far
//   loading     - initial page load (list is empty)
//   loadingMore - a further page is being appended
//   error       - the LAST request failed (initial load errors show the
//                 error state; append errors can be retried via loadMore)
//   hasNext     - more pages exist server-side
//   pagination  - the latest pagination metadata from the server
//   sentinelRef - callback ref; render <div ref={sentinelRef} /> after the
//                 list to enable automatic loading
//   loadMore    - manual trigger (used for retry after an append error)
const usePaginatedFetch = ({ url, limit = 20 }) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [sentinel, setSentinel] = useState(null);

  // Request bookkeeping lives in refs so the observer callback always sees
  // the current values without re-subscribing on every render.
  const inFlight = useRef(false);
  const pageState = useRef({ page: 0, hasNext: true });

  const fetchPage = useCallback(
    async (page) => {
      if (inFlight.current) return;
      inFlight.current = true;
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const joiner = url.includes("?") ? "&" : "?";
      try {
        const res = await axios.get(`${url}${joiner}page=${page}&limit=${limit}`);
        const body = res.data;
        const rows = Array.isArray(body) ? body : body?.data ?? [];
        const meta = Array.isArray(body)
          ? { page, limit, total: rows.length, totalPages: 1, hasNext: false, hasPrevious: false }
          : body?.pagination ?? null;

        setItems((prev) => (page === 1 ? rows : [...prev, ...rows]));
        setPagination(meta);
        setError(false);
        pageState.current = { page, hasNext: Boolean(meta?.hasNext) };
      } catch {
        setError(true);
      } finally {
        inFlight.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [url, limit]
  );

  // Reset and load page 1 whenever the source url changes.
  useEffect(() => {
    setItems([]);
    setPagination(null);
    setError(false);
    pageState.current = { page: 0, hasNext: true };
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!inFlight.current && pageState.current.hasNext) {
      fetchPage(pageState.current.page + 1);
    }
  }, [fetchPage]);

  // Fetch the next page when the sentinel nears the viewport. The generous
  // rootMargin starts the request before the user actually hits the bottom.
  useEffect(() => {
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, loadMore]);

  return {
    items,
    pagination,
    loading,
    loadingMore,
    error,
    hasNext: pageState.current.hasNext,
    sentinelRef: setSentinel,
    loadMore,
  };
};

export default usePaginatedFetch;
