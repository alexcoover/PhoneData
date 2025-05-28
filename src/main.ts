import * as fs from 'fs';
import { parse } from "csv-parse";


class Cell {
    oem: string | null;
    model: string | null;
    launch_announced: number | null;
    launch_status: string | null;
    body_dimensions: string | null;
    body_weight: number | null;
    body_sim: string | null;
    display_type: string | null;
    display_size: number | null;
    display_resolution: string | null;
    features_sensors: string | null;
    platform_os: string | null;
  
    constructor(data: any) {
      this.oem = data.oem;
      this.model = data.model;
      this.launch_announced = toNumber(data.launch_announced);
      this.launch_status = data.launch_status;
      this.body_dimensions = clean(data.body_dimensions);
      this.body_weight = parseWeight(data.body_weight);
      this.body_sim = clean(data.body_sim);
      this.display_type = clean(data.display_type);
      this.display_size = toNumber(data.display_size);
      this.display_resolution = data.display_resolution;
      this.features_sensors = clean(data.features_sensors);
      this.platform_os = clean(data.platform_os);
    }


    public getOem(): string | null {
        return this.oem;
      }
    
      public getModel(): string | null {
        return this.model;
      }
    
      public getLaunchAnnounced(): number | null {
        return this.launch_announced;
      }
    
      public getLaunchStatus(): string | null {
        return this.launch_status;
      }
    
      public getBodyDimensions(): string | null {
        return this.body_dimensions;
      }
    
      public getBodyWeight(): number | null {
        return this.body_weight;
      }
    
      public getBodySim(): string | null {
        return this.body_sim;
      }
    
      public getDisplayType(): string | null {
        return this.display_type;
      }
    
      public getDisplaySize(): number | null {
        return this.display_size;
      }
    
      public getDisplayResolution(): string | null {
        return this.display_resolution;
      }
    
      public getFeaturesSensors(): string | null {
        return this.features_sensors;
      }
    
      public getPlatformOs(): string | null {
        return this.platform_os;
      }
}


function clean(val: string | undefined): string | null {
return !val || val === '-' ? null : val.trim();
}

function toNumber(val: string | undefined): number | null {
const num = Number(val);
return isNaN(num) ? null : num;
}

function parseWeight(val: string | undefined): number | null {
if (!val || val === '-') return null;
const match = val.match(/(\d+)\s*g/i);
return match ? Number(match[1]) : null;
}


const uniqueRows = new Set<string>();
const cells: Cell[] = [];

fs.createReadStream('resources/cells.csv')
  .pipe(parse({ columns: true, trim: false }))
  .on('data', (row) => {
    const key = JSON.stringify(row);
    if (!uniqueRows.has(key)) {
      uniqueRows.add(key);
      cells.push(new Cell(row));
    }
  })
  .on('end', () => {
    console.log('Unique cells:', cells.length);
    for (const cell of cells) {
        console.log(cell.getLaunchStatus());
    }
  });