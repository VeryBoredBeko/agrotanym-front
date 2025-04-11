export interface ClimatologyData {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number, number];
    };
    properties: {
      parameter: Record<string, Record<string, number | string>>;
    };
    header: {
      title: string;
      api: {
        version: string;
        name: string;
      };
      sources: string[];
      fill_value: number;
      time_standard: string;
      range: string;
    };
    messages: string[];
    parameters: Record<string, { units: string; longname: string }>;
    times: {
      data: number;
      process: number;
    };
  }