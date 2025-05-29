export class Cell {
  private oem: string | null;
  private model: string | null;
  private launch_announced: number | null;
  private launch_status: string | null;
  private body_dimensions: string | null;
  private body_weight: number | null;
  private body_sim: string | null;
  private display_type: string | null;
  private display_size: number | null;
  private display_resolution: string | null;
  private features_sensors: string | null;
  private platform_os: string | null;


  constructor(data: any) {
    this.oem = this.clean(data.oem);
    this.model = this.clean(data.model);
    this.launch_announced = this.toNumber(data.launch_announced);
    this.launch_status = this.getAvailability(data.launch_status);
    this.body_dimensions = this.clean(data.body_dimensions);
    this.body_weight = this.parseWeight(data.body_weight);
    this.body_sim = this.parseSim(data.body_sim);
    this.display_type = this.clean(data.display_type);
    this.display_size = this.parseWeight(data.display_size);
    this.display_resolution = this.clean(data.display_resolution);
    this.features_sensors = this.clean(data.features_sensors);
    this.platform_os = this.parseOS(data.platform_os);
  }




  public getOEM(): string | null {
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
  public getAll(): string | null {
    const values = [
      this.oem,
      this.model,
      this.launch_announced,
      this.launch_status,
      this.body_dimensions,
      this.body_weight,
      this.body_sim,
      this.display_type,
      this.display_size,
      this.display_resolution,
      this.features_sensors,
      this.platform_os,
    ]
    if (values.length === 0) return null;
    const stringValues = values.map(v => 
      typeof v === 'number' ? v.toString() : String(v)
    );
  
    return stringValues.join(', ');
  }

  public getSome(): string | null {
    const values = 
      this.oem + " " +
      this.model + " " +
      this.launch_status + " " +
      this.platform_os;
    if (values.length === 0) return null;
    else return values;
  }
    

  private clean(val: string | undefined): string | null {
      return !val || val === '-' ? null : val.trim();
  }
  
  private toNumber(val: string | undefined): number | null {
      const num = Number(val);
      return isNaN(num) ? null : num;
  }
  
  private parseWeight(val: string | undefined): number | null {
      if (!val || val === '-') return null;
      else {
          let weight: string = val.substring(0, val.indexOf(" "));
          return Number.parseFloat(weight);
      }
  }

  private getAvailability(val: string | undefined): string | null {
      if (!val) return null;
      if (val === "Discontinued" || val === "Cancelled") return val;
      else return val.substring(0, val.indexOf(","));
  }

  private parseSim(val:string | undefined): string | null {
      if (val === "No" || val === "Yes") return null;
      else return val;
  }

  private parseOS(val: string | undefined): string | null {
      if (!val) return null;
      let index: number = val.indexOf(",");
      if (index == -1) return val;
      else return val.substring(0, index);
  }
}