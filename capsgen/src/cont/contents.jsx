import { useEffect, useMemo, useState } from "react";
import titles from "../titles.json";
import Swal from "sweetalert2";
import {
  STORAGE_KEY,
  filterTitlesByGenreAndDevice,
  getUniqueGenres,
  pickRandomWithoutImmediateRepeats,
} from "../utils/titleGenerator";

function MainCont() {
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDevices, setCurrentDevices] = useState("");
  const [currentGenre, setCurrentGenre] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [recentTitles, setRecentTitles] = useState([]);
  const [usedIndexesByPool, setUsedIndexesByPool] = useState({});
  const [genreSearch, setGenreSearch] = useState("");
  const [deviceQuery, setDeviceQuery] = useState("");

  const uniqueGenres = useMemo(() => getUniqueGenres(titles), []);

  const visibleGenres = useMemo(() => {
    const normalizedQuery = genreSearch.trim().toLowerCase();

    if (!normalizedQuery) return uniqueGenres;

    return uniqueGenres.filter((genre) =>
      genre.toLowerCase().includes(normalizedQuery)
    );
  }, [genreSearch, uniqueGenres]);

  const filteredTitles = useMemo(
    () => filterTitlesByGenreAndDevice(titles, currentGenre, deviceQuery),
    [currentGenre, deviceQuery]
  );

  const currentPoolKey = useMemo(
    () => `${currentGenre || "all"}::${deviceQuery.trim().toLowerCase()}`,
    [currentGenre, deviceQuery]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (!rawData) return;

      const parsed = JSON.parse(rawData);

      setCurrentTitle(typeof parsed.currentTitle === "string" ? parsed.currentTitle : "");
      setCurrentDevices(typeof parsed.currentDevices === "string" ? parsed.currentDevices : "");
      setCurrentGenre(typeof parsed.currentGenre === "string" ? parsed.currentGenre : "");
      setRecentTitles(Array.isArray(parsed.recentTitles) ? parsed.recentTitles.slice(0, 5) : []);
      setUsedIndexesByPool(
        parsed.usedIndexesByPool && typeof parsed.usedIndexesByPool === "object"
          ? parsed.usedIndexesByPool
          : {}
      );
      setGenreSearch(typeof parsed.genreSearch === "string" ? parsed.genreSearch : "");
      setDeviceQuery(typeof parsed.deviceQuery === "string" ? parsed.deviceQuery : "");
    } catch (err) {
      console.error("Failed to load local state:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentTitle,
          currentDevices,
          currentGenre,
          recentTitles,
          usedIndexesByPool,
          genreSearch,
          deviceQuery,
        })
      );
    } catch (err) {
      console.error("Failed to save local state:", err);
    }
  }, [
    currentTitle,
    currentDevices,
    currentGenre,
    recentTitles,
    usedIndexesByPool,
    genreSearch,
    deviceQuery,
  ]);

  const applyGeneratedTitle = (titleObj) => {
    if (!titleObj) return;

    setCurrentTitle(titleObj.title);
    setCurrentDevices(titleObj.devices.join(", "));
    setCurrentGenre(titleObj.genre);
    setRecentTitles((prev) =>
      [{ title: titleObj.title, genre: titleObj.genre }, ...prev].slice(0, 5)
    );
  };

  const handleGenerateTitle = () => {
    if (!currentGenre.trim()) {
      setAlertVisible(true);
      return;
    }

    if (filteredTitles.length === 0) {
      Swal.fire({
        title: "No matching titles",
        text: "Try removing or changing your device filter.",
        icon: "warning",
        confirmButtonColor: "#f39c12",
        confirmButtonText: "OK",
      });
      return;
    }

    setAlertVisible(false);
    const usedIndices = usedIndexesByPool[currentPoolKey] || [];
    const { item, nextUsedIndices } = pickRandomWithoutImmediateRepeats(
      filteredTitles,
      usedIndices
    );

    setUsedIndexesByPool((prev) => ({
      ...prev,
      [currentPoolKey]: nextUsedIndices,
    }));

    applyGeneratedTitle(item);
  };

  const handleFieldSelect = (field) => {
    setCurrentGenre(field);
    setAlertVisible(false);
  };

  const handleSurpriseMe = () => {
    const pool = visibleGenres.length > 0 ? visibleGenres : uniqueGenres;
    const randomGenre = pool[Math.floor(Math.random() * pool.length)];
    const randomGenreTitles = filterTitlesByGenreAndDevice(titles, randomGenre, deviceQuery);

    if (randomGenreTitles.length === 0) {
      Swal.fire({
        title: "No matching titles",
        text: "Current device filter does not match this random field.",
        icon: "warning",
        confirmButtonColor: "#f39c12",
        confirmButtonText: "OK",
      });
      return;
    }

    const poolKey = `${randomGenre}::${deviceQuery.trim().toLowerCase()}`;
    const usedIndices = usedIndexesByPool[poolKey] || [];

    const { item, nextUsedIndices } = pickRandomWithoutImmediateRepeats(
      randomGenreTitles,
      usedIndices
    );

    setCurrentGenre(randomGenre);
    setAlertVisible(false);
    setUsedIndexesByPool((prev) => ({
      ...prev,
      [poolKey]: nextUsedIndices,
    }));
    applyGeneratedTitle(item);
  };

  const handleClear = () => {
    setCurrentTitle("");
    setCurrentDevices("");
    setCurrentGenre("");
    setAlertVisible(false);
    setRecentTitles([]);
    setUsedIndexesByPool({});
    setGenreSearch("");
    setDeviceQuery("");
  };

  const handleCopyToClipboard = () => {
    const title = currentTitle.trim();
    const devices = currentDevices.trim();
    const field = currentGenre.trim();

    const textParts = [];
    if (title) textParts.push(`Title: ${title}`);
    if (devices) textParts.push(`Devices: ${devices}`);
    if (field) textParts.push(`Field: ${field}`);

    const textToCopy = textParts.join("\n");

    if (textParts.length === 0) {
      Swal.fire({
        title: "Nothing is copied",
        text: "No content available to copy.",
        icon: "warning",
        confirmButtonColor: "#f39c12",
        confirmButtonText: "OK",
      });
      return;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        if (textParts.length === 1) {
          Swal.fire({
            title: "Only " + textParts[0].split(":")[0] + " copied",
            text: textParts[0],
            icon: "info",
            confirmButtonColor: "#17a2b8",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Copied!",
            text: "The content has been copied to clipboard.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: "Failed to copy content.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div className="container pt-2">
        <div className="row justify-content-center align-items-flex-start maincont">
          <div className="col-12 col-lg-8 p-2 bg-dark text-white contboxes">
            <div className="row p-3">
              <div className="col-md-12 p-3 bg-dark text-dark textBox d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="dropdown fieldDropdown">
                  <button
                    type="button"
                    className="btn dropdown-toggle dropdown-toggle-end fieldBtn"
                    data-bs-toggle="dropdown"
                  >
                    {currentGenre ? `Field: ${currentGenre}` : "Select Field"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {visibleGenres.length > 0 ? (
                      visibleGenres.map((genre) => (
                        <li key={genre}>
                          <button
                            className="dropdown-item"
                            onClick={() => handleFieldSelect(genre)}
                          >
                            {genre}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="dropdown-item disabled">No matching fields</li>
                    )}
                  </ul>
                </div>

                <button
                  className="btn btn-outline-success surpriseBtn"
                  onClick={handleSurpriseMe}
                >
                  Surprise me
                </button>
              </div>

              <div className="col-md-12 px-3 pb-2 filtersRow">
                <input
                  type="text"
                  className="form-control filterInput"
                  placeholder="Search fields (e.g. health)"
                  value={genreSearch}
                  onChange={(event) => setGenreSearch(event.target.value)}
                />
                <input
                  type="text"
                  className="form-control filterInput"
                  placeholder="Filter by device (e.g. mobile app)"
                  value={deviceQuery}
                  onChange={(event) => setDeviceQuery(event.target.value)}
                />
              </div>

              <div className="col-md-12 px-3 pb-2 quickFields">
                <div className="quickFieldWrap">
                  {visibleGenres.slice(0, 6).map((genre) => (
                    <button
                      key={`quick-${genre}`}
                      className={`quickFieldChip ${
                        currentGenre === genre ? "quickFieldChipActive" : ""
                      }`}
                      onClick={() => handleFieldSelect(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {alertVisible && (
                <div className="col-md-12 p-3">
                  <div className="alert alert-danger" role="alert">
                    Please select a field or genre first.
                  </div>
                </div>
              )}

              <div className="col-md-12 px-3 pb-2 text-white filterStats">
                Matching titles for this filter: <strong>{filteredTitles.length}</strong>
              </div>

              <div className="col-md-12 p-3 text-light textBox mainBox">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card bg-dark text-white p-3 mb-3">
                      <h4 className="text-light">Title</h4>
                      <ul className="list-unstyled">
                        <hr />
                        <li className="title">{currentTitle || "No title yet."}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card bg-dark text-white p-3 mb-3">
                      <h4 className="text-light">Devices</h4>
                      <ul className="list-unstyled">
                        <hr />
                        <li className="devices">
                          {currentDevices || "Generate to see suggested devices."}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card bg-dark text-white p-3">
                      <h4 className="text-light">Field</h4>
                      <ul className="list-unstyled">
                        <hr />
                        <li className="genre">{currentGenre || "No field selected."}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 p-3 bg-dark text-white d-flex justify-content-center align-items-center btnbox">
                <button
                  id="buttonGen"
                  className="btn btn-success"
                  onClick={handleGenerateTitle}
                >
                  Generate a title
                </button>

                <button
                  id="buttonCopy"
                  className="btn btn-primary"
                  onClick={handleCopyToClipboard}
                >
                  <i className="fa fa-clipboard"> </i>
                  Copy
                </button>

                <button
                  id="buttonClear"
                  className="btn btn-secondary"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-3 p-3 bg-dark text-white contboxes">
            <div className="row">
              <div className="col-md-12 p-3 text-white item recentCard">
                <h6 className="mb-3">Recent Picks</h6>
                {recentTitles.length === 0 ? (
                  <p className="recentEmpty">No generated titles yet.</p>
                ) : (
                  <ul className="recentList">
                    {recentTitles.map((entry, idx) => (
                      <li key={`${entry.title}-${idx}`}>
                        <strong>{entry.genre}:</strong> {entry.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-md-12 p-4 text-white item">
                <a href="https://github.com/jareddevbug" target="_blank" rel="noreferrer">
                  <i className="fab fa-github"></i> Github
                </a>
              </div>

              <div className="col-md-12 p-4 text-white item">
                <a href="https://www.tiktok.com/@friedpalakokak" target="_blank" rel="noreferrer">
                  <i className="fab fa-tiktok"></i> Tiktok
                </a>
              </div>

              <hr />

              <div className="col-md-12 p-3 text-white coffee d-flex justify-content-center">
                <button>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fa fa-coffee"></i> Buy me a coffee
                  </a>
                </button>
              </div>

              <hr />

              <div className="col-md-12 p-3 text-white coffee d-flex justify-content-center">
                <p>
                  Copyright 2024 Jared Sf <i className="fa fa-frog"> </i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainCont;
