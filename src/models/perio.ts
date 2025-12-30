
export type Tooth = 'X' | 'O' | '-';    // 'X' = missing, 'O' = Selected, 'S' = Skipped
export type Teeth = { [toothNumber: string]: Tooth; } // e.g., { "11": "value"};
export type PPD_Tooth = number[]; // e.g., [3,4,5,2,3,4]; for 6 sites
export type LGM_Tooth = number[]; // e.g., [0,1,1,0,2,1]; for 6 sites
export type LGM = { [toothNumber: string]: LGM_Tooth; } // e.g., { "11": [0,1,1,0,2,1]};
export type PPD = { [toothNumber: string]: PPD_Tooth } // e.g., { "11": 3};

export interface PerioRecord {
  id: string;
  label: string;
  teeth: Teeth;
  ppd: PPD;
  lgm: LGM;
  patientId? : string | null;
  createdAt: string;
  updatedAt: string;
}
