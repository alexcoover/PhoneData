import * as fs from 'fs';
import { parse } from 'csv-parse';
import { Cell } from './cell.js';

/**
 * Manages a list of mobile device data parsed from a CSV.
 */
export class CellManager {
    // Stores and checks unique cells to prevent duplicates
    private uniqueCells = new Set<string>();
    // Array of Cell objects
    private cellsList: Cell[] = [];

    // Dummy constructor - use createFromCSV
    private constructor() {}

  /**
   * Creates a CellManager instance by reading and parsing a CSV file.
   *
   * @param filePath - The path to the CSV file.
   * @returns A Promise that resolves to a populated CellManager instance.
   */
  public static async createFromCSV(filePath: string): Promise<CellManager> {
    const cm = new CellManager();
    // Read and parse CSV rows
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, trim: false }))
        .on('data', (row) => {
          const key = JSON.stringify(row);
          // Checks for uniqueness before adding to cellsList
          if (!cm.uniqueCells.has(key)) {
            cm.uniqueCells.add(key);
            cm.cellsList.push(new Cell(row));
          }
        }) // Return cell manager object
        .on('end', () => {
          resolve(cm);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }


  /**
   * Returns all unique OEMs found in the dataset.
   */
  public getUniqueOEMs(): Set<string> {
    // Filter all cells by OEM and check against a set
    const uniqueOEMs = new Set<string>();
    this.cellsList.forEach(cell => {
        uniqueOEMs.add(cell.getOEM())
    })
    return uniqueOEMs;
  }

    /**
     * Calculates and logs the average weight of all cells with valid weight data.
     */
    public showAverageWeight() {
        let count = 0;
        let avg = 0;
        // Get all weights and qty of cells with weight
        for (const cell of this.cellsList) {
            const weight = cell.getBodyWeight();
            if (weight != null) {
                avg += weight;
                count++;
            }
        }
        console.log("Avg Weight: " + (avg / count).toFixed(2));
    }

    /**
     * Retrieves all cells.
     *
     * @returns An object with methods to output or return the dataset.
     */
    public getAllCells() {
        const allCells = this.cellsList
        return {
            toSome: () => this.toSome(allCells),
            toString: () => this.toString(allCells),
            data: allCells
        };
    }

    /**
     * Retrieves cells that mention provided value in their platform OS.
     *
     * @param platform The platform to filter by.
     * @returns An object with methods to output or return the dataset.
     */
    public getByPlatform(platform: string) {
        // Filter by OS includes linux
        const platformCells = this.cellsList.filter(
            cell => cell.getPlatformOs()?.toLowerCase().includes(platform.toLowerCase())
        );
        return {
            toSome: () => this.toSome(platformCells),
            toString: () => this.toString(platformCells),
            data: platformCells
        };
    }

    /**
     * Retrieves cells matching the provided launch status.
     *
     * @param status The launch status to filter by.
     * @returns An object with methods to output or return the dataset.
     */
    public getByLaunchStatus(status: string) {
        // Filter by provided status
        const statusCells = this.cellsList.filter(
            cell => cell.getLaunchStatus()?.toLowerCase().includes(status.toLowerCase())
        );
        return {
            toSome: () => this.toSome(statusCells),
            toString: () => this.toString(statusCells),
            data: statusCells
        };
    }

    /**
     * Retrieves cells matching the provided OEM string.
     *
     * @param oem The OEM name to filter by.
     * @returns An object with methods to output or return the dataset.
     */
    public getByOEM(oem: string) {
        // Filter by oem provided
        const oemCells = this.cellsList.filter(
            cell => cell.getOEM()?.toLowerCase().includes(oem.toLowerCase())
        );
        return {
            toSome: () => this.toSome(oemCells),
            toString: () => this.toString(oemCells),
            data: oemCells
        };
    }

    /**
     * Computes the intersection of two arrays of Cell objects.
     *
     * @param arr1 The first array of Cell objects.
     * @param arr2 The second array of Cell objects.
     * @returns An array containing Cell objects found in both arr1 and arr2.
     */
    public union(arr1: Cell[], arr2: Cell[]): Cell[] {
        if (arr1.length == 0 || arr2.length == 0) return null;
        // Set for finding matches
        const set = new Set<Cell>;
        const result: Cell[] = [];
        
        // Add all of arr1 to set
        for (const cell of arr1) {
            set.add(cell);
        }
        // Compare arr2 against set, add to result if contained in set
        for (const cell of arr2) {
            if (set.has(cell)) {
                result.push(cell);
            }
        }
        return result;
    }

    /**
     * Shows average weight per OEM and logs in sorted order.
     */
    public showAverageWeightAll() {
        const uniqueOEMs = this.getUniqueOEMs();
        const avgWeight = new Map<string, number>();
        for (const oem of uniqueOEMs) {
            let total = 0;
            let count = 0;
            for (const cell of this.cellsList) {
                if (cell.getOEM() === oem){
                    total += cell.getBodyWeight();
                    count++;
                }
                avgWeight.set(oem, parseFloat((total / count).toFixed(2)));
            }
        }
        const sortedEntries = Array.from(avgWeight.entries()).sort(
            ([, a], [, b]) => a - b
          );
        for (const [oem, avg] of sortedEntries) {
            console.log(oem + ": " + avg + "g");
          }
    }

     /**
     * Finds cells with a difference between announced and launch dates.
     */
    public getReleaseDisparity() {
        let disparity: Cell[] = [];
        for (const cell of this.cellsList){
            if (
                cell.getLaunchAnnounced() != null &&
                cell.getLaunchDate() != null &&
                cell.getLaunchAnnounced() != cell.getLaunchDate()
              ) {
                disparity.push(cell);
              }
              
        }
        return {
            toSome: () => this.toSome(disparity),
            toString: () => this.toString(disparity),
            data: disparity
        };
    }

    /**
     * Retrieves cells by their launch year.
     *
     * @param year The launch year to filter by.
     */
    public getByReleaseYear(year: number) {
        const yearCells: Cell[] =[];
        for (const cell of this.cellsList) {
            if (cell.getLaunchDate != null && cell.getLaunchDate() === year){
                yearCells.push(cell);
            }
        }
        return {
            toSome: () => this.toSome(yearCells),
            toString: () => this.toString(yearCells),
            data: yearCells
        };
    }

    /**
     * Filters and returns cells that have a specific number of features.
     *
     * @param count The number of features to match.
     */
    public getFeaturesByCount(count: number) {
        let featureCount: Cell[] = [];
        for (const cell of this.cellsList) {
            if (cell.getFeatureCount() === count){
                featureCount.push(cell);
            }
        }
        return {
            toSome: () => this.toSome(featureCount),
            toString: () => this.toString(featureCount),
            data: featureCount
        };
    }



    /**
     * Logs the full string representation of each cell in the provided array.
     *
     * @param data Array of Cell objects to output.
     */
    public toString(data: Cell[]) {
        for (const cell of data) {
            console.log(cell.getAll())
        }
    }

    /**
     * Logs a partial string representation of each cell in the provided array.
     *
     * @param data Array of Cell objects to output.
     */
    public toSome(data: Cell[]) {
        for (const cell of data) {
            console.log(cell.getSome())
        }
    }

}
