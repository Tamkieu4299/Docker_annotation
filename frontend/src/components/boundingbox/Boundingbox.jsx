import { useContext, useRef } from "react";
export default function Boundingbox() {
    const rectInfos = [
        [
            { top: "0px", left: "0px", color: "green" },
            { top: "0px", left: "500px", color: "yellow" },
        ],
        [
            { top: "150px", left: "0px", color: "blue" },
            { top: "150px", left: "500px", color: "black" },
        ],
    ];
    const rects = rectInfos.map((row, i) =>
        row.map((svgElement, j) => (
            <svg
                key={`i+${i}+${j}+j`}
                style={{
                    width: "500px",
                    height: "150px",
                    position: "absolute",
                    top: svgElement.top,
                    left: svgElement.left,
                }}
            >
                <rect
                    style={{
                        fill: svgElement.color,
                        width: "500px",
                        height: "150px",
                    }}
                />
            </svg>
        ))
    );

    return (
        <div style={{ position: "relative", width: "1000px", height: "300px" }}>
            {rects}
        </div>
    );
}
