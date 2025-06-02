/**
 * Stores and handles information about a device.
 */
export class Cell {
  private oem: string | null;
  private model: string | null;
  private launch_announced: number | null;
  private launch_status: string | null;
  private launch_date: number | null;
  private body_dimensions: string | null;
  private body_weight: number | null;
  private body_sim: string | null;
  private display_type: string | null;
  private display_size: number | null;
  private display_resolution: string | null;
  private features_sensors: string | null;
  private feature_count: number | null;
  private platform_os: string | null;

  /**
   * Constructs a Cell object from raw CSV data.
   *
   * @param data - The raw data object parsed from a CSV row.
   */
  constructor(data: any) {
    this.oem = this.clean(data.oem);
    this.model = this.clean(data.model);
    this.launch_announced = this.toNumber(data.launch_announced);
    this.launch_status = this.getAvailability(data.launch_status);
    this.launch_date = this.parseLaunchDate(data.launch_status);
    this.body_dimensions = this.clean(data.body_dimensions);
    this.body_weight = this.parseWeight(data.body_weight);
    this.body_sim = this.parseSim(data.body_sim);
    this.display_type = this.clean(data.display_type);
    this.display_size = this.parseWeight(data.display_size);
    this.display_resolution = this.clean(data.display_resolution);
    this.features_sensors = this.clean(data.features_sensors);
    this.feature_count = this.countFeatures(data.features_sensors);
    this.platform_os = this.parseOS(data.platform_os);
  }

  /**
   * Getters for everything
   */
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

  public getLaunchDate(): number | null {
    return this.launch_date;
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

  public getFeatureCount(): number | null {
    return this.feature_count;
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

  /**
   * Returns a brief summary string of key device information.
   *
   * @returns A short string of key values or null if empty.
   */
  public getSome(): string | null {
    const values = 
      this.oem + " " +
      this.model + " " +
      this.launch_status + " " +
      this.platform_os;
    if (values.length === 0) return null;
    else return values;
  }
    
  /**
   * Trims string input, returning null if the input is missing or a dash.
   * @param val The string to clean.
   * @returns A trimmed string or null.
   */
  private clean(val: string | undefined): string | null {
      return !val || val === '-' ? null : val.trim();
  }
  

  /**
   * Converts the string to a number, returning null if invalid.
   *
   * @param val The value to convert.
   * @returns A number or null.
   */
  private toNumber(val: string | undefined): number | null {
      if (!val) return null
      const num = Number(val.substring(0, 4));
      return isNaN(num) ? null : num;
  }
  
  /**
   * Parses a weight string and returns the float value before the first space.
   *
   * @param val String provided.
   * @returns Float type number.
   */
  private parseWeight(val: string | undefined): number | null {
      if (!val || val === '-') return null;
      else {
          let weight: string = val.substring(0, val.indexOf(" "));
          return Number.parseFloat(weight);
      }
  }

  /**
   * Gets the availability status from a descriptive string,
   * trims after first comma.
   *
   * @param val A launch status string.
   * @returns A shortened status string or null.
   */
  private getAvailability(val: string | undefined): string | null {
      if (!val) return null;
      if (val === "Discontinued" || val === "Cancelled") return val;
      else return val.substring(0, val.indexOf(","));
  }

  /**
   * Filters SIM data to remove yes/no values.
   *
   * @param val A SIM information string.
   * @returns The SIM string or null.
   */
  private parseSim(val:string | undefined): string | null {
      if (val === "No" || val === "Yes") return null;
      else return val;
  }

   /**
   * Parses the OS string, removing details after the first comma.
   *
   * @param val An operating system string.
   * @returns A cleaned OS string or null.
   */
  private parseOS(val: string | undefined): string | null {
      if (!val) return null;
      let index: number = val.indexOf(",");
      if (index == -1) return val;
      else return val.substring(0, index);
  }

  /**
   * Extracts the launch year from the launch status string.
   * 
   * @param val A launch date string.
   * @returns Launch date in the form of an int.
   */
  private parseLaunchDate(val: string) {
    if (!val) return null;
    if (val === "Discontinued" || val === "Cancelled") return null;
    else {
      const index = val.indexOf("20")
      return parseInt(val.substring(index, index + 4));
    }
  }

  /**
   * Counts how many features are listed in the sensors string.
   * 
   * @param val A features sensors string.
   * @returns The number of features as an int.
   */
  private countFeatures(val: string) {
    if (!val) return 0;
    else return val.split(",").map(f => f.trim()).filter(f => f.length > 0).length;   
  }
}