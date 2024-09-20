

export type Column = {
    name: string;
    type: 'string' | 'number';
  };
  
  export type CellValue = string | number | string[] | number[];
  
  export type Row = Record<string, CellValue>;
  