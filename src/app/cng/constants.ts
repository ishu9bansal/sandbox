import { type Step } from "@/components/Survey/types";

const STATIONS = [
  "Narula Filling Station, Pathankot",
  "Jhelum Fuels, Pathankot",
  "Jeevo Ram, Pathankot",
  "Bimla Filling Station, Samba",
  "JKRTC Fuels, Jammu",
  "Jammu Auto Aids, Jammu",
  "Walia Filling Station",
];

export const UnloadingSteps: Step[] = [
  {
    id: "stationSelection",
    title: "Station Selection",
    fields: [
      { id: "station", label: "RO / GA", type: "select", options: STATIONS },
    ],
  },
  {
    id: "initialDetails",
    title: "Initial Readings",
    fields: [
      { id: "startTime", label: "Start Time", type: "datetime" },
      { id: "initialVehicalPressure", label: "Initial Vehical Pressure (bar)", type: "text" },
      { id: "initialMFMReading", label: "Initial MFM Reading (kg)", type: "text" },
    ],
  },
  {
    id: "finalDetails",
    title: "Final Readings",
    fields: [
      { id: "endTime", label: "End Time", type: "datetime" },
      { id: "finalVehicalPressure", label: "Final Vehical Pressure (bar)", type: "text" },
      { id: "finalMFMReading", label: "Final MFM Reading (kg)", type: "text" },
    ],
  }
];

export const LoadingSteps: Step[] = [
  {
    id: "driverInfo",
    title: "Driver Details",
    fields: [
      { id: "driverName", label: "Driver's name", type: "text" },
      { id: "driverContact", label: "Driver's Mobile No.", type: "text" },
    ],
  },
  {
    id: "initialDetails",
    title: "Initial Readings",
    fields: [
      { id: "startTime", label: "Start Time", type: "datetime" },
      { id: "inPressure", label: "Mobile Cascade IN-pressure (bar)", type: "text" },
      { id: "initialMFMReading", label: "Initial MFM Reading (kg)", type: "text" },
    ],
  },
  {
    id: "finalDetails",
    title: "Final Readings",
    fields: [
      { id: "endTime", label: "End Time", type: "datetime" },
      { id: "outPressure", label: "Mobile Cascade OUT-pressure (bar)", type: "text" },
      { id: "finalMFMReading", label: "Final MFM Reading (kg)", type: "text" },
    ],
  }
];

export interface Profile {
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
}

export const SAMPLE_PROFILES: Profile[] = [
  { vehicleNumber: "PB 06 BG 4547", driverName: "Rajesh Kumar", driverContact: "9876543210" },
  { vehicleNumber: "PB 06 BE 5947", driverName: "Amit Singh", driverContact: "9123456780" },
  { vehicleNumber: "PB 06 BD 9947", driverName: "Vikram Sharma", driverContact: "9988776655" },
  { vehicleNumber: "PB 06 BF 7647", driverName: "Suresh Gupta", driverContact: "9234567890" },
  { vehicleNumber: "PB 06 BD 9948", driverName: "Rohit Verma", driverContact: "9345678901" },
  { vehicleNumber: "WB 39 D 8211", driverName: "Anil Das", driverContact: "9456789012" },
];