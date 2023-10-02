import React, { useState } from "react";
import "./styles.css";

const SkillIcon = (props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
      <div
        style={{
          position: "relative", // Necessary for tooltip positioning
          aspectRatio: "1/1",
          width: "50px",
          display: "flex",
          padding: "5px"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {
          <div
            className="tooltip" // You can style the tooltip using CSS
            style={{
              display: showTooltip && props.tooltipText ? 'block' : 'none',
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 1.0)",
              color: "#fff",
              padding: "5px",
              borderRadius: "10px",
              textAlign: 'center',
              zIndex: 100
            }}
          >
            {props.tooltipText} {/* Replace with the actual tooltip text */}
          </div>
        }
        <img
          src={props.img}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          alt="Skill Icon"
        />
      </div>
  );
};

export default SkillIcon;