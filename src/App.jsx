// ui for toy robot app
// trying to keep this file very plain so anyone can tweak it
import { useState } from "react";
import { executeCommand, getRobot } from "./logic/robot";
import robotImage from "../robot.png";


// how wide/tall the board is
const GRID_SIZE = 5;


// turn robot.png into the icon, rotate when needed
function facingIcon(facing) {
  // start with north because the png faces north by default
  // just spinning the same image keeps things simple
  let spin = 0;
  if (facing === "EAST") spin = 90;
  if (facing === "SOUTH") spin = 180;
  if (facing === "WEST") spin = -90;

  return (
    <img
      src={robotImage}
      alt="robot"
      style={{
        width: 42,
        height: 42,
        transform: `rotate(${spin}deg)`,
        imageRendering: "auto",
        pointerEvents: "none",
      }}
    />
  );
}



export default function App() {
  // text box content
  const [text, setText] = useState("");
  // list of result lines shown in Output box
  const [output, setOutput] = useState([]);
  // current robot position pulled from logic
  const [robotState, setRobotState] = useState(getRobot());



  // run all commands typed in the box
  function run() {
    // the idea: break the textarea by lines, run each, then print a status line
    // nothing fancy; this mirrors how you might test commands by hand
    // split by new lines and drop empties
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);



    // execute each command and build printable result
    const results = lines.map((line) => {
      const res = executeCommand(line);
      return `${line} => ${res.success ? "OK" : "FAIL"}: ${res.message}`;
    });

    // add to output and clear the textarea
    setOutput((prev) => [...prev, ...results]);
    setText("");

    // refresh robot position for the grid
    setRobotState(getRobot());
  }



  // build rows from top (y=4) to bottom (y=0)
  // this draws the 5x5 grid as a bunch of divs
  const rows = [];
  for (let y = GRID_SIZE - 1; y >= 0; y--) {
    // cells across this row
    const cells = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      // check if robot is on this square
      const isRobotHere =
        robotState.isplaced &&
        robotState.x === x &&
        robotState.y === y;



      // push the square to the row
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            width: 70,
            height: 70,
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            userSelect: "none",
          }}
          title={`(${x}, ${y})`}
        >
          {isRobotHere ? facingIcon(robotState.facing) : ""}
        </div>
      );
    }



    // push row to rows array
    rows.push(
      <div
        key={y}
        style={{
          display: "flex",
        }}
      >
        {cells}
      </div>
    );
  }



  // labels for x axis
  // these just show the numbers under the grid
  const xLabels = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    // 0..4 along bottom
    xLabels.push(
      <div
        key={`x-${x}`}
        style={{
          width: 70,
          height: 24,
          textAlign: "center",
          fontSize: 12,
          lineHeight: "24px",
        }}
      >
        {x}
      </div>
    );
  }



  // labels for y axis
  // same idea but on the left side
  const yLabels = [];
  for (let y = GRID_SIZE - 1; y >= 0; y--) {
    // 4..0 on the left side
    yLabels.push(
      <div
        key={`y-${y}`}
        style={{
          width: 24,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        {y}
      </div>
    );
  }



  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "24px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* app title */}
        {/* keep it small so the focus stays on the grid and commands */}
        <h1
          style={{
            textAlign: "center",
            paddingBottom: 12,
            margin: 0,
          }}
        >
          Toy Robot - Sandaru
        </h1>
      </div>



      {/* Middle section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 48,
          padding: "40px 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Grid stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            flex: 1,
            maxWidth: "50%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "visible",
              marginTop: 80,
            }}
          >
            <div
              style={{
                display: "inline-block",
                marginRight: 30,
                transform: "scale(1.15)",
                transformOrigin: "center",
              }}
            >
              {/* x labels go on top of grid */}
              <div
                style={{
                  display: "flex",
                  marginLeft: 32,
                  marginBottom: 6,
                }}
              >
                {xLabels}
              </div>
              {/* grid with y labels on the left */}
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: 8,
                  }}
                >
                  {yLabels}
                </div>
                {/* actual grid squares */}
                <div>{rows}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 14,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            {/* simple display of robot position */}
            Robot:{" "}
            {robotState.isplaced
              ? `${robotState.x}, ${robotState.y}, ${robotState.facing}`
              : "Not placed"}
          </div>
        </div>

        {/* Commands stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            flex: 1,
            maxWidth: "50%",
            minWidth: 0,
            boxSizing: "border-box",
            padding: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              textAlign: "center",
            }}
          >
            Commands
          </h2>

          <textarea
            rows={10}
            style={{
              width: "100%",
              padding: 12,
              boxSizing: "border-box",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`PLACE(0,0,NORTH)\nMOVE\nLEFT\nRIGHT\nREPORT\n(facing can be NORTH / SOUTH / EAST / WEST)`}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* run button covers whole width */}
            {/* click it to process whatever is in the box */}
            <button
              onClick={run}
              style={{
                marginTop: 10,
                width: "100%",
                boxSizing: "border-box",
                color: "#ffffff",
              }}
            >
              Run
            </button>
          </div>

          <div
            style={{
              width: "100%",
              marginTop: 12,
              paddingTop: 8,
              borderTop: "1px solid #e5e7eb",
              boxSizing: "border-box",
            }}
          >
            {/* results log */}
            <h2
              style={{
                textAlign: "center",
                margin: "0 0 8px",
              }}
            >
              Output
            </h2>

            <pre
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                padding: 10,
                whiteSpace: "pre-wrap",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              {output.length ? output.join("\n") : "No output yet."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
