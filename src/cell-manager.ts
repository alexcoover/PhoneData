import * as fs from 'fs';
import { parse } from 'csv-parse';
import { Cell } from './cell.js';

export class CellManager {
  private uniqueCells = new Set<string>();
  private cellsList: Cell[] = [];

  private constructor() {}

  public static async createFromCSV(filePath: string): Promise<CellManager> {
    const cm = new CellManager();

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, trim: false }))
        .on('data', (row) => {
          const key = JSON.stringify(row);
          if (!cm.uniqueCells.has(key)) {
            cm.uniqueCells.add(key);
            cm.cellsList.push(new Cell(row));
          }
        })
        .on('end', () => {
          resolve(cm);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  public getAllCells() {
    const allCells = this.cellsList
    return {
        toSome: () => this.toSome(allCells),
        toString: () => this.toString(allCells),
        data: allCells
    };
  }

  public getUniqueOEMs() {
    const uniqueOEMs = new Set<string>();
    this.cellsList.forEach(cell => {
        uniqueOEMs.add(cell.getOEM())
    })
    for (const oem of uniqueOEMs){
        console.log(oem)
    }
  }

  public getLinuxCells() {
    const linuxCells = this.cellsList.filter(
        cell => cell.getPlatformOs()?.toLowerCase().includes("linux")
    );
    return {
        toSome: () => this.toSome(linuxCells),
        toString: () => this.toString(linuxCells),
        data: linuxCells
    };
  }
  
    public getByLaunchStatus(status: string) {
    const statusCells = this.cellsList.filter(
        cell => cell.getLaunchStatus()?.toLowerCase().includes(status.toLowerCase())
    );
    return {
        toSome: () => this.toSome(statusCells),
        toString: () => this.toString(statusCells),
        data: statusCells
    };
  }
  
    private toString(data: Cell[]) {
    for (const cell of data) {
        console.log(cell.getAll())
    }
  }

    private toSome(data: Cell[]) {
    for (const cell of data) {
        console.log(cell.getSome())
    }
  }

}
