import React, { useState } from "react";
import titles from "../titles.json";
import Swal from "sweetalert2";

function MainCont(props) {
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDevices, setCurrentDevices] = useState("");
  const [currentGenre, setCurrentGenre] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); 

  const uniqueGenres = [...new Set(titles.map((title) => title.genre))];

  const handleGenerateTitle = () => {
    if (!currentGenre) {
      setAlertVisible(true);
      return;
    }

    setAlertVisible(false);

    const filteredTitles = titles.filter(
      (title) => title.genre === currentGenre
    );

    const randomIndex = Math.floor(Math.random() * filteredTitles.length);

    const randomTitle = filteredTitles[randomIndex];

    setCurrentTitle(randomTitle.title);
    setCurrentDevices(randomTitle.devices.join(", "));
    setCurrentGenre(randomTitle.genre);
  };

  const handleFieldSelect = (field) => {
    setCurrentGenre(field); 
  };

  const handleCopyToClipboard = () => {
    const title = document.querySelector(".title")?.innerText.trim() || "";
    const devices = document.querySelector(".devices")?.innerText.trim() || "";
    const field = document.querySelector(".genre")?.innerText.trim() || "";
  
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
        confirmButtonText: "OK"
      });
      return;
    }
  
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        if (textParts.length === 1) {
          Swal.fire({
            title: "Only " + textParts[0].split(":")[0] + " copied",
            text: textParts[0],
            icon: "info",
            confirmButtonColor: "#17a2b8",
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            title: "Copied!",
            text: "The content has been copied to clipboard.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK"
          });
        }
      })
      .catch(err => {
        Swal.fire({
          title: "Error",
          text: "Failed to copy content.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK"
        });
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div className="container pt-2">
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
                  <div className="alert alert-danger" role="alert">
                    Please select a field or genre first!
                  </div>
                </div>
              )}

              <div className="col-md-12 p-3 text-light textBox mainBox">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card bg-dark text-white p-3 mb-3">
                      <h4 className="text-light">Title</h4>
                      <ul className="list-unstyled">
                      <hr/>
                        <li className="title">{currentTitle || props.title}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card bg-dark text-white p-3 mb-3">
                      <h4 className="text-light">Devices</h4>
                      <ul className="list-unstyled">
                      <hr/>
                        <li className="devices">{currentDevices || props.devices}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card bg-dark text-white p-3">
                      <h4 className="text-light">Field</h4>
                      <ul className="list-unstyled">
                      <hr/>
                        <li className="genre">{currentGenre || props.genre}</li>
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
                  className="btn btn-primary ml-2"
                  onClick={handleCopyToClipboard}
                >
                  Copy
                </button>
              </div>

            </div>
          </div>

          <div className="col-md-3 p-3 bg-dark text-white contboxes">
            <div className="row">
              <div className="col-md-12 p-4 text-white item">
                <a href="https://github.com/jareddevbug" target="blank">
                  <i className="fab fa-github"></i> Github
                </a>
              </div>
              <div className="col-md-12 p-4 text-white item">
                <a href="#" target="blank">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
              <div className="col-md-12 p-4 text-white item">
                <a href="#" target="blank">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
              </div>
              <div className="col-md-12 p-4 text-white item">
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
                <p>© 2024 Copyright Jared Sf <i className="fa fa-frog"> </i></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}

export default MainCont;
