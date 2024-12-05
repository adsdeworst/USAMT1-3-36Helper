// Grid.js
import React, { useState } from "react";
import "./styles.css"; // Ensure this file contains the CSS styles for the grid

const Grid = () => {
  // Define the initial grid with numbers
  const initialGrid = [
    ["", "", "", "", "", "", "", "", "", "4"],
    ["", "", "", "6", "", "", "6", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "36", "24", "", "", "", "", "", ""],
    ["", "", "", "", "16", "", "", "", "", ""],
    ["", "", "", "", "", "24", "", "", "", ""],
    ["", "", "", "", "", "", "36", "18", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "6", "", "", "12", "", "", ""],
    ["36", "", "", "", "", "", "", "", "", ""],
  ];

  // State to manage the toggled (dark or not) status of each box
  const [darkCells, setDarkCells] = useState(
    Array(10).fill(Array(10).fill(false))
  );

  // Toggle the dark mode of a cell
  const toggleCell = (row, col) => {
    setDarkCells((prev) =>
      prev.map((r, rowIndex) =>
        r.map((c, colIndex) =>
          rowIndex === row && colIndex === col ? !c : c
        )
      )
    );
  };

  // Function to clear the grid
  const clearGrid = () => {
    setDarkCells(
      Array(10)
        .fill(null)
        .map(() => Array(10).fill(false))
    );
  };

  // Function to download the grid state
  const downloadGrid = () => {
    const gridState = darkCells.map((row, rowIndex) =>
      row.map((isDark, colIndex) => ({
        position: `${rowIndex}-${colIndex}`,
        isDark,
      }))
    );

    const blob = new Blob([JSON.stringify(gridState, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "grid-state.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  // Function to import a grid state from a JSON file
  const importGrid = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          // Convert imported data to match the darkCells structure
          const newDarkCells = Array(10)
            .fill(null)
            .map(() => Array(10).fill(false));

          importedData.forEach((row) =>
            row.forEach((cell) => {
              const [rowIndex, colIndex] = cell.position.split("-").map(Number);
              if (cell.isDark) {
                newDarkCells[rowIndex][colIndex] = true;
              }
            })
          );

          setDarkCells(newDarkCells);
        } catch (error) {
          alert("Invalid JSON file format");
        }
      };
      reader.readAsText(file);
    }
  };



  return (
    <div>
      <div className="grid">
        {initialGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell ${
                darkCells[rowIndex][colIndex] ? "dark" : ""
              }`}
              onClick={() => toggleCell(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className="buttons">
        <button onClick={clearGrid}>Clear Grid</button>
        <button onClick={downloadGrid}>Download Grid</button>
        <input
          type="file"
          accept="application/json"
          onChange={importGrid}
          style={{ marginLeft: "10px" }}
        />
      </div>
    </div>
  );
};

export default Grid;