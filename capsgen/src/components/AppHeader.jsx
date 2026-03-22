import Switch from "./Switch";
function AppHeader({ theme, onToggleTheme }) {
  return (
    <header className="heroBar">
      <div className="container py-4 py-lg-5">
        <div className="heroCard">
          <div className="heroTopRow">
            <p className="heroEyebrow mb-0">
            © {new Date().getFullYear()} Jared SF. All rights reserved.
            </p>
            {/* <button type="button" className="themeToggle" onClick={onToggleTheme}>
              <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"} me-2`}></i>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button> */}
            <Switch theme={theme} onToggleTheme={onToggleTheme} />
          </div>
          <hr />

          <div className="heroBody">
            <div className="heroBrand">
              <div className="heroLogoWrap">
                <img
                  src="/capsgen-cropped.png"
                  className="heroLogo"
                  alt="Capsgen logo"
                />
              </div>

              <div className="heroCopy">
                <h1 className="heroTitle">Capsgen</h1>
                <p className="heroSubtitle mb-0">
                  Generate structured and relevant capstone titles based on your chosen
                  domain, technology, and problem scope.
                </p>
              </div>
            </div>

            <div className="heroStat">
              <span className="heroStatValue">Modern workflow</span>
              <span className="heroStatLabel">Generate, compare, save, and refine in one space</span>
            </div>
          </div>

          <div className="heroPills">
            <span>Modern bento UI</span>
            <span>Editable tokens</span>
            <span>Favorites</span>
            <span>Seeded results</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
