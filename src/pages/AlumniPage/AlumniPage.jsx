import { useState, useEffect, useRef } from "react";
import PageHeading from "../../components/PageHeading/PageHeading";
import styles from "./AlumniPage.module.css";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";
import Loading from "../../components/Loading/Loading";
import SearchIcon from "./search1.png";

// Curated ordering (matched by name, case-insensitive). These alumni are
// pinned to the top of the initial list, before "Load More".
const PINNED_TOP_NAMES = ["khushi arora", "tanvi saini"];
// These alumni are pushed into the "Load More" section (hidden initially).
const PINNED_LOAD_MORE_NAMES = ["hashmeet singh", "alankar mittal"];

// The search is a name lookup: accept only letters and spaces (no digits or
// special characters) and cap the query at this many characters.
const MAX_SEARCH_LENGTH = 30;

const AlumniPage = () => {
  const {
    mainDiv,
    inner,
    intro,
    header,
    heading,
    searchWrap,
    input,
    icon,
    alumniGrid,
    alumniCard,
    alumniImgWrap,
    alumniImg,
    alumniBody,
    alumniName,
    alumniInfo,
    connectBtn,
    scrollSentinel,
    stateMsg,
  } = styles;

  const [count, setcount] = useState(4);
  const [searchQuery, setSearchQuery] = useState(""); // Search state for the input field
  const sentinelRef = useRef(null);

  // Field validation: strip anything that isn't a letter or space, and cap the
  // length so only valid names can be typed into the search bar.
  const handleSearchChange = (e) => {
    const cleaned = e.target.value
      .replace(/[^a-zA-Z\s]/g, "")
      .slice(0, MAX_SEARCH_LENGTH);
    setSearchQuery(cleaned);
  };

  // Chunked fetching: alumni arrive 20 at a time, newest first (order=desc -
  // the same display order the page always used), and further pages append
  // as the user scrolls.
  const {
    items,
    error,
    loading,
    loadingMore,
    hasNext,
    loadMore,
  } = usePaginatedFetch({
    url: `${import.meta.env.VITE_SERVER_URL}/api/alumni/?order=desc`,
    limit: 20,
  });

  // Filter alumni data based on the search query (case-insensitive)
  const filteredAlumni = items.filter((alumnus) =>
    alumnus.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // A search must cover the whole directory, not just the loaded chunks -
  // while a query is active, keep pulling the remaining pages.
  useEffect(() => {
    if (searchQuery && hasNext && !loading && !loadingMore) loadMore();
  }, [searchQuery, hasNext, loading, loadingMore, loadMore]);

  const toTitleCase = (string) =>
    string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const cleanField = (value) => {
    const lower = value?.toLowerCase?.();
    return !value || lower === "nil" || lower === "nan"
      ? ""
      : toTitleCase(value);
  };

  // Same list as before (filtered, newest first - the server now sends that
  // order directly), only reordered: the two pinned alumni move to the front,
  // the two demoted ones move to the end so they land in the "Load More"
  // section. Every other card keeps its relative order.
  const normalizeName = (value) => value?.trim().toLowerCase() ?? "";

  const orderedAlumni = (() => {
    const base = filteredAlumni.slice();
    const pinnedTop = [];
    const pinnedLoadMore = [];
    const rest = [];

    base.forEach((alumnus) => {
      const name = normalizeName(alumnus.name);
      if (PINNED_TOP_NAMES.includes(name)) pinnedTop.push(alumnus);
      else if (PINNED_LOAD_MORE_NAMES.includes(name)) pinnedLoadMore.push(alumnus);
      else rest.push(alumnus);
    });

    pinnedTop.sort(
      (a, b) =>
        PINNED_TOP_NAMES.indexOf(normalizeName(a.name)) -
        PINNED_TOP_NAMES.indexOf(normalizeName(b.name))
    );

    return [...pinnedTop, ...rest, ...pinnedLoadMore];
  })();

  const visibleAlumni = orderedAlumni.slice(0, count);
  const totalCount = orderedAlumni.length;
  // More to show: either unrevealed loaded cards, or unfetched server pages.
  const hasMore = count < totalCount || hasNext;

  // Start from the first batch again whenever the search query changes.
  useEffect(() => {
    setcount(4);
  }, [searchQuery]);

  // Infinite scroll: reveal the next batch as the sentinel near the bottom of
  // the list scrolls into view, and fetch the next server chunk when the
  // loaded buffer runs low so cards are ready before they're needed.
  useEffect(() => {
    if (!hasMore) return undefined;
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setcount(Math.min(count + 6, totalCount));
          if (items.length - count < 12 && hasNext) loadMore();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, count, totalCount, items.length, hasNext, loadMore]);

  return (
    <div className={mainDiv}>
      <PageHeading imgURL="/img/hero/hero-bg.jpg" text="ALUMNI" />
      <div className={inner}>
        <p className={intro}>
          The TULAS CSA alumni network brings together graduates of the Cloud
          Security Alliance student chapter who now work across cybersecurity,
          cloud security, and technology. Many stay involved as mentors,
          guiding current students through career growth, industry connections,
          and hands-on advice from people whose journeys began at TULAS CSA and
          continue to shape our community.
        </p>
        <div className={header}>
          <h2 className={heading}>Connect With Our Alumni</h2>
          <div className={searchWrap}>
            <img className={icon} src={SearchIcon} alt="" aria-hidden="true" width={38} height={38} decoding="async" />
            <input
              type="text"
              className={input}
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchChange}
              maxLength={MAX_SEARCH_LENGTH}
            />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : !error && visibleAlumni.length === 0 && hasNext ? (
          // A search with no hits among loaded chunks while more pages are
          // still coming in - keep the loading state, not a false "no
          // results".
          <Loading />
        ) : error || visibleAlumni.length === 0 ? (
          <p className={stateMsg}>No alumni found.</p>
        ) : (
          <>
            <div className={alumniGrid}>
              {visibleAlumni.map((alumnus, index) => (
                <div className={alumniCard} key={alumnus._id ?? index}>
                  <div className={alumniImgWrap}>
                    <img
                      className={alumniImg}
                      src={alumnus.alumniImgURL}
                      alt={`${toTitleCase(alumnus.name)} - UPES Cloud Security Alliance alumni`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className={alumniBody}>
                    <h3 className={alumniName}>{toTitleCase(alumnus.name)}</h3>
                    {cleanField(alumnus.position) && (
                      <p className={alumniInfo}>{cleanField(alumnus.position)}</p>
                    )}
                    {cleanField(alumnus.company) && (
                      <p className={alumniInfo}>{cleanField(alumnus.company)}</p>
                    )}
                    <a
                      className={connectBtn}
                      href={alumnus.linkedInURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Connect
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {loadingMore && <Loading />}
            {hasMore && (
              <div
                ref={sentinelRef}
                className={scrollSentinel}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
