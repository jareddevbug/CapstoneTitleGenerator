import Switch from "./Switch";
function AppHeader({ theme, onToggleTheme }) {
  return (
    <header className="heroBar">
      <div className="container py-4 py-lg-5">
        <div className="heroCard">
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
            <p className="heroEyebrow mb-0">
              {/* Frontend-only / Template engine / Local persistence */}
            </p>
            
          </div>

          <div className="d-flex flex-column flex-lg-row justify-content-left align-items-lg-start gap-5">
              <div>
                <img src="/capsgen-cropped.png" style={{width: "15rem", borderRadius: "25%", objectFit: "cover;"}} alt="" /> 
              </div>
            <div>
              <h1 className="heroTitle">Capsgen - Capstone Title Generator</h1>
              <p className="heroSubtitle mb-0">
                Generate structured and relevant capstone titles based on your chosen domain, technology, and problem scope.
              </p>
            </div>
            <Switch theme={theme} onToggleTheme={onToggleTheme} />
            {/* <div className="heroStat">
              <span className="heroStatValue">Compact workflow</span>
              <span className="heroStatLabel">Generate, compare, save, and refine faster</span>
            </div> */}
          </div>

          {/* <div className="heroPills">
            <span>Batch generation</span>
            <span>Token editing</span>
            <span>Bookmarks</span>
            <span>Seeded results</span>
          </div> */}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
