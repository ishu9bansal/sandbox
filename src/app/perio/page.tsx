"use client";

import React, { useRef, useState } from "react";

const TEETH = 18;
const ROWS = ["Buccal", "Lingual"];
const ZONES = [
  { label: "3", size: 3 },
  { label: "2", size: 3 },
  { label: "1", size: 3 },
  { label: "1", size: 3 },
  { label: "2", size: 3 },
  { label: "3", size: 3 }
];

// partial: "", "-", "1", "12", "-1", "-12" (max 2 digits)
const isValidPartial = (v) => /^-?\d{0,2}$/.test(v) || v === "";

// complete: -99..99, but not "" or "-"
const isComplete = (v) => {
  if (!/^-?\d{1,2}$/.test(v)) return false;
  const n = parseInt(v, 10);
  return n >= -99 && n <= 99;
};

export default function PerioApp() {
  const [data, setData] = useState({
    Buccal: Array(TEETH).fill(""),
    Lingual: Array(TEETH).fill("")
  });

  // refs[row][col] -> input element
  const refs = useRef(ROWS.map(() => Array(TEETH).fill(null)));

  // shiftMode[row][col] -> user pressed Shift before number, expect 2 digits
  const shiftModeRef = useRef(ROWS.map(() => Array(TEETH).fill(false)));

  const focus = (r, c) => {
    if (refs.current?.[r]?.[c]) {
      refs.current[r][c].focus();
      refs.current[r][c].select();
    }
  };

  const next = (r, c) => {
    if (c < TEETH - 1) {
      focus(r, c + 1);
    } else if (r < ROWS.length - 1) {
      focus(r + 1, 0);
    }
  };

  const prev = (r, c) => {
    if (c > 0) {
      focus(r, c - 1);
    } else if (r > 0) {
      focus(r - 1, TEETH - 1);
    }
  };

  const setShiftMode = (r, c, value) => {
    shiftModeRef.current[r][c] = value;
  };

  const getShiftMode = (r, c) => shiftModeRef.current[r][c];

  const handleChange = (r, c, raw) => {
    const v = raw.trim();

    if (!isValidPartial(v)) return;

    const rowName = ROWS[r];

    setData((d) => {
      const copy = { ...d, [rowName]: [...d[rowName]] };
      copy[rowName][c] = v;
      return copy;
    });

    const inShiftMode = getShiftMode(r, c);

    // If user signaled 2-digit entry with Shift:
    if (inShiftMode) {
      if (v.length === 1) {
        // first digit, do not move yet
        return;
      }
      // length 2 now: complete two-digit number
      setShiftMode(r, c, false);
      if (isComplete(v)) next(r, c);
      return;
    }

    // Normal behaviour: any complete value auto-advances
    if (isComplete(v)) {
      next(r, c);
    }
  };

  const handleKeyDown = (r, c, e) => {
    const key = e.key;
    const rowName = ROWS[r];
    const v = data[rowName][c];

    if (key === "Shift") {
      // mark this cell as expecting 2 digits
      setShiftMode(r, c, true);
      return;
    }

    if (key === "Backspace" && v === "") {
      e.preventDefault();
      prev(r, c);
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      next(r, c);
      return;
    }
    if (key === "ArrowLeft") {
      e.preventDefault();
      prev(r, c);
      return;
    }
    if (key === "ArrowUp") {
      e.preventDefault();
      focus(r - 1, c);
      return;
    }
    if (key === "ArrowDown") {
      e.preventDefault();
      focus(r + 1, c);
      return;
    }
  };

  return (
    <div style={styles.app}>
      <h2>LGM Clinical Chart — Baseline</h2>

      <div style={styles.grid}>
        {/* Row 1: Zone labels */}
        <div /> {/* top-left empty */}
        {ZONES.map((z, i) => (
          <div
            key={i}
            style={{
              ...styles.zoneLabel,
              gridColumn: `span ${z.size}`
            }}
          >
            {z.label}
          </div>
        ))}

        {/* Row 2: Tooth numbers */}
        {/* <div /> */}
        {/* {Array.from({ length: TEETH }).map((_, i) => (
          <div key={i} style={styles.head}>
            {i + 1}
          </div>
        ))} */}

        {/* Buccal / Lingual rows */}
        {ROWS.map((rowName, r) => (
          <React.Fragment key={rowName}>
            <div style={styles.label}>{rowName}</div>
            {data[rowName].map((value, c) => (
              <input
                key={c}
                ref={(el) => (refs.current[r][c] = el)}
                value={value}
                inputMode="numeric"
                maxLength={3} // allow "-99"
                onChange={(e) => handleChange(r, c, e.target.value)}
                onKeyDown={(e) => handleKeyDown(r, c, e)}
                style={{
                  ...styles.cell,
                  ...(c === 0 || c === 3 || c === 6 || c === 9 || c === 12 || c === 15
                    ? styles.zoneSeparatorLeft
                    : {})
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.legend}>
        <strong>Legend:</strong> values from -99 to 99. Negative = recession.
        Press <code>Shift</code> before typing to enter two-digit numbers.
      </div>

      <pre style={styles.json}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "system-ui, sans-serif",
    padding: 24,
    maxWidth: 950,
    margin: "auto"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "80px repeat(18, 36px)",
    gap: 6,
    alignItems: "center",
    marginTop: 12
  },
  zoneLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 0",
    borderBottom: "1px solid #c5cce0",
    borderRadius: 4,
    background: "#f4f6ff"
  },
  head: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.7
  },
  label: {
    fontWeight: 600,
    fontSize: 13,
    textAlign: "right",
    paddingRight: 6
  },
  cell: {
    height: 32,
    textAlign: "center",
    borderRadius: 6,
    border: "1px solid #cfd6e4",
    fontSize: 14,
    outline: "none",
    background: "#fbfcff"
  },
  zoneSeparatorLeft: {
    borderLeft: "2px solid #8b95b5"
  },
  legend: {
    marginTop: 16,
    fontSize: 12,
    color: "#444"
  },
  json: {
    marginTop: 16,
    background: "#f4f6ff",
    padding: 12,
    borderRadius: 8,
    fontSize: 12
  }
};
