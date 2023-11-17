import Pagination from "./Pagination";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { API_BASE_URL, STRIPE_PAYMENT_LINK } from "@/utils/globalVars";
import { getItem } from "@/utils/localStorage";
import EmptyState from "./EmptyState";
import PlayCircleIcon from "@heroicons/react/24/outline/PlayCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/outline/PauseCircleIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import { IsProUserContext } from "@/exports/IsProUserContext";

interface Props {
  showFavorites: boolean;
}

export default function Feed({ showFavorites }: Props) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<[string, number][]>(
    []
  );

  const containerRef = useRef<HTMLInputElement | null>(null);
  const modalBackdropRef = useRef<HTMLInputElement | null>(null);
  const enterKeyPressed = useRef(false);
  const commandKeyPressed = useRef(false);
  const kKeyPressed = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPauseCircleIcon, setShowPauseCircleIcon] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudio, setCurrentAudio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(0);
  const [filters, setFilters] = useState<any[]>([]);
  const [isFiltersLoading, setIsFiltersLoading] = useState(true);

  const [chords, setChords] = useState([]) as any[];

  const { isProUser } = useContext(IsProUserContext);
  const [showResetButton, setShowResetButton] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDownPress);
    document.addEventListener("keyup", handleKeyUpPress);

    fetchChords();

    return () => {
      document.removeEventListener("keydown", handleKeyDownPress);
      document.removeEventListener("keyup", handleKeyUpPress);
    };
  }, []);

  const pageSize = 7;

  let isMacUser: boolean;
  try {
    isMacUser = navigator.userAgent.includes("Macintosh");
  } catch {
    isMacUser = false;
  }

  const hideFilterModal = () => {
    setQuery("");
    enterKeyPressed.current = false;
    setSelectedFilters([]);
    setShowFilterModal(false);
  };

  const getFilteredChords = async () => {
    setQuery("");

    const authToken = getItem("auth-token");

    enterKeyPressed.current = false;

    const filterIdsString = selectedFilters
      .map((filter) => filter[1])
      .join(",");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chords/filtered?ids=${filterIdsString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setChords(data.result);
        const numberOfPages = Math.ceil(data.result.length / pageSize);
        console.log("numberOfPages", numberOfPages);
        if (numberOfPages === 0) {
          setCurrentPage(0);
        } else {
          setCurrentPage(1);
        }
        setMaxPages(numberOfPages);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.");
    }

    setSelectedFilters([]);
    setShowFilterModal(false);
    setShowResetButton(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFilterSelection = (
    filterId: number,
    name: string,
    subject: string
  ) => {
    if (selectedFilters.length === 0) {
      const filter: [string, number][] = [
        [name.concat(" | ").concat(subject), filterId],
      ];

      setSelectedFilters(filter);
    } else {
      const filters = selectedFilters.concat([
        [name.concat(" | ").concat(subject), filterId],
      ]);

      setSelectedFilters(filters);
    }
  };

  const removeSelectedFilter = (filterId: number) => {
    const updatedSelectedFilters = selectedFilters.filter(
      (filter) => filter[1] !== filterId
    );

    setSelectedFilters(updatedSelectedFilters);
  };

  // Close the modal when the backdrop is clicked
  const handleBackdropClick = (e: any) => {
    if (e.target === modalBackdropRef.current) {
      hideFilterModal();
    }
  };

  // Create an array of objects to pad the missing elements
  const addPadding = (missingCount: number) =>
    Array.from({ length: missingCount }, () => ({
      chord_id: 1,
      name: "",
      "Chord Voicing": "",
      liked: false,
      file_name: "",
    }));

  function handleKeyDownPress(event: KeyboardEvent) {
    if (event.key === "Enter" && showFilterModal) {
      enterKeyPressed.current = true;
    } else if (
      (isMacUser && event.key === "Meta") ||
      (!isMacUser && event.key === "Control")
    ) {
      commandKeyPressed.current = true;
    } else if (commandKeyPressed.current && event.key.toUpperCase() === "K") {
      kKeyPressed.current = true;
      if (!showFilterModal) {
        getFilters();
        setShowFilterModal(true);
      }
    }
  }

  function handleKeyUpPress(event: KeyboardEvent) {
    if (event.key === "Enter" && showFilterModal) {
      hideFilterModal();
    } else if (event.key === "Meta") {
      commandKeyPressed.current = false;
    } else if (event.key.toUpperCase() === "K") {
      kKeyPressed.current = false;
    }
  }

  const handleFavoriteAction = async (index: number) => {
    const updatedChords = [...chords];

    updatedChords[index].liked = !updatedChords[index].liked;

    const chordId = updatedChords[index].chord_id;

    setChords(updatedChords);

    const authToken = getItem("auth-token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/chords/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          chordId,
          liked: updatedChords[index].liked,
        }),
      });

      // nothing needs to be updated in the UI
      // await response.json();
    } catch (error) {
      console.log("Something went wrong. Please try again later.");
    }
  };

  const playAudio = (file_name: string) => {
    if (showPauseCircleIcon) {
      setShowPauseCircleIcon(false);
      if (currentAudio === file_name && audioRef.current) {
        audioRef.current.pause();
        setCurrentAudio("");

        return;
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }

    const audio = document.getElementById(file_name) as HTMLAudioElement;

    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setShowPauseCircleIcon(false);
      audioRef.current = null;
      setCurrentAudio("");
    });

    setShowPauseCircleIcon(true);
    setCurrentAudio(file_name);
    audio.src = `https://sfzqlwyplnhijjxgpddr.supabase.co/storage/v1/object/public/chord-audio-files/${file_name}`;
    audio.play();
  };

  const getFilters = async () => {
    setIsFiltersLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chords/filters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        setFilters(data.result);
        setIsFiltersLoading(false);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.");
    }
  };

  const fetchChords = async () => {
    const authToken = getItem("auth-token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chords?show_only_favorites=${showFavorites}&current_page=${currentPage}&page_size=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setChords(data.result);
        const numberOfPages = Math.ceil(data.result.length / pageSize);
        setMaxPages(numberOfPages);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.");
    }

    setShowResetButton(false);
    setIsLoading(false);
  };

  return (
    <>
      {showFilterModal && (
        <>
          <div
            className="flex justify-center fixed z-50 inset-0 backdrop-blur-sm bg-slate-900/25 transition-opacity opacity-100"
            ref={modalBackdropRef}
            onClick={(e) => handleBackdropClick(e)}
          >
            <div className="mt-14 md:mt-40 px-4 md:px-0 relative w-full max-w-lg h-fit transform transition-all opacity-100">
              <div className="overflow-hidden rounded-t-lg bg-white">
                <div className="relative">
                  <input
                    className="block w-full appearance-none bg-transparent py-4 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6"
                    placeholder="Find anything..."
                    type="text"
                    onChange={handleQueryChange}
                    autoFocus
                  />
                  <svg
                    id="search-btn"
                    className="cursor-pointer absolute right-4 top-4 h-6 w-6 fill-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={getFilteredChords}
                  >
                    <path d="M20.47 21.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-9.97-4.28a6.75 6.75 0 0 1-6.75-6.75h-1.5a8.25 8.25 0 0 0 8.25 8.25v-1.5ZM3.75 10.5a6.75 6.75 0 0 1 6.75-6.75v-1.5a8.25 8.25 0 0 0-8.25 8.25h1.5Zm6.75-6.75a6.75 6.75 0 0 1 6.75 6.75h1.5a8.25 8.25 0 0 0-8.25-8.25v1.5Zm11.03 16.72-5.196-5.197-1.061 1.06 5.197 5.197 1.06-1.06Zm-4.28-9.97c0 1.864-.755 3.55-1.977 4.773l1.06 1.06A8.226 8.226 0 0 0 18.75 10.5h-1.5Zm-1.977 4.773A6.727 6.727 0 0 1 10.5 17.25v1.5a8.226 8.226 0 0 0 5.834-2.416l-1.061-1.061Z"></path>
                  </svg>
                </div>
              </div>
              {selectedFilters.length > 0 && (
                <div
                  className="flex gap-x-2 p-4 w-full overflow-x-auto h-16 border-t border-slate-200 bg-white"
                  ref={containerRef}
                >
                  {selectedFilters.map((selectedFilter, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-x-0.5 whitespace-nowrap rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                      {selectedFilter[0]}
                      <button
                        type="button"
                        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-purple-500/20"
                        onClick={() => removeSelectedFilter(selectedFilter[1])}
                      >
                        <svg
                          viewBox="0 0 14 14"
                          className="h-3.5 w-3.5 stroke-purple-600/50 group-hover:stroke-purple-600/75"
                        >
                          <path d="M4 4l6 6m0-6l-6 6" />
                        </svg>
                        <span className="absolute -inset-1" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <ul className="max-h-[18.375rem] divide-y divide-slate-200 overflow-y-auto rounded-b-lg border-t border-slate-200 text-sm leading-6">
                {filters
                  .filter(
                    (filter) =>
                      !selectedFilters
                        .map((filter) => filter[0])
                        .includes(filter.name + " | " + filter.subject)
                  )
                  .filter((filter) => {
                    const actualQuery = query.toLowerCase().trim();
                    return (
                      filter.name.toLowerCase().includes(actualQuery) ||
                      filter.subject.toLowerCase().includes(actualQuery)
                    );
                  })
                  .map((filter, index) =>
                    !filter.is_pro_filter || isProUser ? (
                      <li
                        key={index}
                        className="relative cursor-pointer flex items-center justify-between p-4 bg-slate-50"
                        onClick={() =>
                          handleFilterSelection(
                            filter.id,
                            filter.name,
                            filter.subject
                          )
                        }
                      >
                        <span className="whitespace-nowrap font-semibold text-sky-600">
                          {filter.name}
                        </span>
                        <span className="ml-4 text-right text-xs text-slate-600">
                          {filter.subject}
                        </span>
                      </li>
                    ) : (
                      <li
                        key={index}
                        className="relative flex items-center justify-between p-4 bg-slate-50"
                      >
                        <span className="whitespace-nowrap font-semibold text-slate-300">
                          {filter.name}
                        </span>
                        <LockClosedIcon
                          className="absolute inset-x-1/2 h-4 w-4 text-gray-700"
                          aria-hidden="true"
                        />
                        <span className="ml-4 text-right text-xs text-slate-300">
                          {filter.subject}
                        </span>
                      </li>
                    )
                  )}
              </ul>
              {!isFiltersLoading &&
                filters
                  .filter(
                    (filter) =>
                      !selectedFilters
                        .map(
                          (selectedFilter) => selectedFilter[0].split(" | ")[0]
                        )
                        .includes(filter.name)
                  )
                  .filter((filter) => {
                    const actualQuery = query.toLowerCase().trim();
                    return (
                      filter.name.toLowerCase().includes(actualQuery) ||
                      filter.subject.toLowerCase().includes(actualQuery)
                    );
                  }).length === 0 && (
                  <div className="bg-slate-50 rounded-b-lg px-16 py-20 text-center">
                    <h2 className="font-semibold text-slate-900">
                      No results found
                    </h2>
                  </div>
                )}
            </div>
          </div>
        </>
      )}
      {!isLoading &&
        (!showFavorites || (chords.length != 0 && showFavorites) ? (
          <div className="px-4 sm:px-6 md:w-8/12">
            <>
              {!showFavorites && (
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="black"
                        className="cursor-pointer w-8 h-8"
                        onClick={() => {
                          getFilters();
                          setShowFilterModal(true);
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {window.innerWidth > 768 && (
                      <div>
                        <span className="pl-3 font-lg text-slate-900 font-semibold opacity-30">
                          or
                        </span>
                        {isMacUser ? (
                          <span className="pl-3 font-lg text-slate-900 font-semibold opacity-30">
                            ⌘ + K
                          </span>
                        ) : (
                          <span className="pl-3 font-lg text-slate-900 font-semibold opacity-30">
                            ctrl + K
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <ArrowPathIcon
                      className={`${
                        !showResetButton && "hidden"
                      } h-8 w-8 text-gray-700 cursor-pointer`}
                      aria-hidden="true"
                      onClick={fetchChords}
                    />
                  </div>
                </div>
              )}
            </>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full border-1 divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          ></th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
                          >
                            Chord Voicing
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          ></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {chords
                          .slice(
                            (currentPage - 1) * pageSize,
                            pageSize * currentPage
                          )
                          .concat(
                            addPadding(
                              pageSize -
                                chords.slice(
                                  (currentPage - 1) * pageSize,
                                  pageSize * currentPage
                                ).length
                            )
                          )
                          .map((chord: any, index: number) => (
                            <tr key={index}>
                              {chord.name !== "" ? (
                                <td className="flex justify-center pl-6 py-4 text-sm text-gray-500">
                                  <audio
                                    id={`${chord.file_name}`}
                                    className="hidden"
                                    controls
                                  >
                                    <source
                                      src={`https://sfzqlwyplnhijjxgpddr.supabase.co/storage/v1/object/public/chord-audio-files/${chord.file_name}`}
                                      type="audio/wav"
                                    />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                  {chord.file_name !== currentAudio ? (
                                    <PlayCircleIcon
                                      className="h-6 w-6 text-gray-700 cursor-pointer"
                                      aria-hidden="true"
                                      onClick={() => playAudio(chord.file_name)}
                                    />
                                  ) : (
                                    <PauseCircleIcon
                                      className="h-6 w-6 text-gray-700 cursor-pointer"
                                      aria-hidden="true"
                                      onClick={() => playAudio(chord.file_name)}
                                    />
                                  )}
                                </td>
                              ) : (
                                <td className="opacity-0 pl-6 py-4 text-sm text-gray-500">
                                  <PlayCircleIcon
                                    className="h-8 w-8 text-gray-700"
                                    aria-hidden="true"
                                  />
                                </td>
                              )}
                              <td className="py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6">
                                {chord.name}
                              </td>
                              <td className="py-4 text-sm text-gray-500 text-center">
                                {chord["Chord Voicing"]}
                              </td>
                              {chord.name !== "" ? (
                                <td className="px-3 py-4 text-sm text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={chord.liked ? "#DC2626" : "none"}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke={chord.liked ? "#DC2626" : "black"}
                                    className="cursor-pointer w-6 h-6"
                                    onClick={() =>
                                      handleFavoriteAction(
                                        index + pageSize * (currentPage - 1)
                                      )
                                    }
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                  </svg>
                                </td>
                              ) : (
                                <td className="opacity-0 px-3 py-4 text-sm text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={chord.liked ? "#DC2626" : "none"}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke={chord.liked ? "#DC2626" : "black"}
                                    className="w-7 h-7"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                  </svg>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {currentPage > 2 && !isProUser && (
                      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm">
                        <div className="flex flex-col justify-center items-center h-full px-10 gap-10">
                          <LockClosedIcon
                            className="h-8 w-8 text-gray-700"
                            aria-hidden="true"
                          />
                          <div>
                            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                              Upgrade and Expand
                            </h2>
                            <p className="text-center font-bold leading-9 tracking-tight text-gray-600">
                              More Chords, More Music
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded-md bg-[#0070F3] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
                            onClick={() => {
                              window.open(STRIPE_PAYMENT_LINK, "_blank");
                            }}
                          >
                            Unlock Pro Features
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {currentPage !== 0 && (
              <Pagination
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                maxPages={maxPages}
              />
            )}
          </div>
        ) : (
          <EmptyState />
        ))}
    </>
  );
}
