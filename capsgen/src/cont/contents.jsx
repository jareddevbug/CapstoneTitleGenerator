import React, { useState } from "react";
import titles from "../titles.json"; // Assuming titles.json is in the same directory

function MainCont(props) {
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDevices, setCurrentDevices] = useState("");
  const [currentGenre, setCurrentGenre] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); // State for alert visibility

  // Extract unique genres from titles.json
  const uniqueGenres = [...new Set(titles.map((title) => title.genre))];

  // Function to handle generate title button click
  const handleGenerateTitle = () => {
    if (!currentGenre) {
      // Show alert if no genre is selected
      setAlertVisible(true);
      return;
    }

    // Hide alert if genre is selected
    setAlertVisible(false);

    // Filter titles based on currentGenre
    const filteredTitles = titles.filter(
      (title) => title.genre === currentGenre
    );

    // Get a random index within the filtered titles array length
    const randomIndex = Math.floor(Math.random() * filteredTitles.length);

    // Get the random title object from filtered titles
    const randomTitle = filteredTitles[randomIndex];

    // Update state with random data from filtered titles
    setCurrentTitle(randomTitle.title);
    setCurrentDevices(randomTitle.devices.join(", "));
    setCurrentGenre(randomTitle.genre);
  };

  // Function to handle dropdown item click
  const handleFieldSelect = (field) => {
    setCurrentGenre(field); // Update currentGenre state
  };

  return (
    <>
      <div className="container pt-5">
        <div className="row justify-content-center align-items-flex-start maincont">
          <div className="col-md-8 p-2 bg-dark text-white contboxes">
            <div className="row p-3">
              <div className="col-md-12 p-3 bg-dark text-dark textBox d-flex justify-content-end">
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn dropdown-toggle dropdown-toggle-end fieldBtn"
                    data-bs-toggle="dropdown"
                  >
                    Field
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {uniqueGenres.map((genre) => (
                      <li key={genre}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleFieldSelect(genre)}
                        >
                          {genre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {alertVisible && (
                <div className="col-md-12 p-3">
                  <div className="alert alert-warning" role="alert">
                    Please select a field or genre first!
                  </div>
                </div>
              )}

              <div className="col-md-12 p-3 text-light textBox mainBox">
                <div className="row">
                  <div className="col-md-12">
                    <p className="h4">Title:</p>
                    <ul>
                      <li className="title">{currentTitle || props.title}</li>
                    </ul>
                  </div>
                  <hr />
                  <div className="col-md-12">
                    <p className="h4">Devices:</p>
                    <ul>
                      <li>{currentDevices || props.devices}</li>
                    </ul>
                  </div>
                  <hr />
                  <div className="col-md-12">
                    <p className="h4">Field:</p>
                    <ul>
                      <li>{currentGenre || props.genre}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-12 p-3 bg-dark text-white d-flex justify-content-center align-items-center btnbox">
                <button
                  id="buttonGen"
                  className="btn btn-primary"
                  onClick={handleGenerateTitle}
                >
                  Generate a title
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-3 p-3 bg-dark text-white contboxes">
            <div className="row">
              <div className="col-md-12 p-3 text-white item">
                <a href="https://github.com/jareddevbug" target="blank">
                  <i className="fab fa-github"></i> Github
                </a>
              </div>
              <div className="col-md-12 p-3 text-white item">
                <a href="#" target="blank">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
              <div className="col-md-12 p-3 text-white item">
                <a href="#" target="blank">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
              </div>
              <div className="col-md-12 p-3 text-white item">
                <a href="#" target="blank">
                  <i className="fab fa-discord"></i> Discord
                </a>
              </div>
              <hr />
              <div className="col-md-12 p-3 text-white coffee d-flex justify-content-center">
                <button>
                  <a href="#" target="blank">
                    <i className="fa fa-coffee"></i> Buy me a coffee
                  </a>
                </button>
              </div>
              <hr />
              <div className="col-md-12 p-3 text-white coffee d-flex justify-content-center">
                <p>© 2024 Copyright IVY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainCont;
