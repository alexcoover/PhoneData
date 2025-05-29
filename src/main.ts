import { CellManager } from "./cell-manager.js";

const cm = await CellManager.createFromCSV('resources/cells.csv');
//cm.getByLaunchStatus("discontinued").toSome();
cm.getAllCells().toSome();