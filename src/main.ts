import { CellManager } from "./cell-manager.js";

// Create CellManager Object with csv path
const cm = await CellManager.createFromCSV('resources/cells.csv');


// Example queries

// Each method can print all cell info
console.log("\nCanceled Devices Full:\n");
cm.getByLaunchStatus("cancelled").toString();

// Or print a shortened version
console.log("\nCanceled Devices Shortened:\n");
cm.getByLaunchStatus("cancelled").toSome();

// Or be returned as a Cell object array
const discontinuedCells = cm.getByOEM("motorola").data;
const linuxCells = cm.getByPlatform("linux").data;

// And you can find the overlap between them
const overlap = cm.union(discontinuedCells, linuxCells);
console.log("\nMotorola Linux Devices:\n");
cm.toSome(overlap);