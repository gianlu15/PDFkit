import { useState } from "react";

function HelpCard({title, paragraph}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`help-container ${isOpen ? "down" : "up"}`}>
      <div className="help-title-container" onClick={handleToggle}>
        <h3>{title}</h3>
        <span id="symbol" style={{ cursor: "pointer" }}>{isOpen ? "-" : "+"}</span>
      </div>

      {isOpen && (
        <div className="help-paragraf-container">
          <p>{paragraph}</p>
        </div>
      )}
    </div>
  );
}

export default HelpCard;
