import { useState } from "react";
import { executeCommand, getRobot } from "./logic/robot";

const GRID_SIZE = 5;

function facingIcon(facing) {
  if (facing === "NORTH") return "⬆️";
  if (facing === "SOUTH") return "⬇️";
  if (facing === "EAST") return "➡️";
  if (facing === "WEST") return "⬅️";
  return "🤖";
}

export default function App() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState([]);
  const [robotState, setRobotState] = useState(getRobot());

  function run() {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const results = lines.map((line) => {
      const res = executeCommand(line);
      return `${line} => ${res.success ? "OK" : "FAIL"}: ${res.message}`;
    });

    setOutput((prev) => [...prev, ...results]);
    setText("");

    // refresh robot position for the grid
    setRobotState(getRobot());
  }

  // build rows from top (y=4) to bottom (y=0)
  const rows = [];
  for (let y = GRID_SIZE - 1; y >= 0; y--) {
    const cells = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const isRobotHere =
        robotState.isplaced &&
        robotState.x === x &&
        robotState.y === y;

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

  const xLabels = [];
  for (let x = 0; x < GRID_SIZE; x++) {
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

  const yLabels = [];
  for (let y = GRID_SIZE - 1; y >= 0; y--) {
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
              <div
                style={{
                  display: "flex",
                  marginLeft: 32,
                  marginBottom: 6,
                }}
              >
                {xLabels}
              </div>

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
            placeholder={`PLACE(0,0,NORTH)\nMOVE\nREPORT`}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
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
