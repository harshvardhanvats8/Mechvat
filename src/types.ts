export interface EngineeringComponent {
  id: string;
  name: string;
  category: "mechanical" | "aerospace" | "automobile" | "ev" | "manufacturing" | "robotics";
  description: string;
  materials: string[];
  workingPrinciples: string;
  keySpecs: { label: string; value: string }[];
  failureModes: string[];
  animationSpec: {
    type: "gear" | "piston" | "bearing" | "nozzle" | "battery" | "arm" | "welding" | "cam" | "fluid";
    partsCount: number;
    baseColor: string;
  };
}

export interface Formula {
  id: string;
  name: string;
  domain: string;
  formulaStr: string;
  derivation: string;
  explanation: string;
  inputs: { name: string; key: string; defaultValue: number; unit: string; min: number; max: number }[];
  calculate: (inputs: Record<string, number>) => { result: number; unit: string; stepByStep: string };
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  milestones: string[];
  recommendedCAD: string[];
}
