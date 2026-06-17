import { EngineeringComponent, Formula, RoadmapNode } from "../types";

export const COMPONENTS_DATABASE: EngineeringComponent[] = [
  {
    id: "piston-assembly",
    name: "Reciprocating Piston Assembly",
    category: "mechanical",
    description: "The core mechanical element that converts fluid pressure from combustion or gas expansion into linear kinetic energy, which is subsequently converted into rotational shaft torque.",
    materials: ["Aluminum-Silicon Alloy (A356/A390) for weight reduction", "Steel 4140 for connecting rod", "Ductile iron for compression rings"],
    workingPrinciples: "The piston undergoes harmonic linear reciprocating motion inside the cylinder liner. Pressure generated during the power stroke pushes the crown downwards, acting on the auxiliary wrist pin and translating down the connecting rod, driving the Crankshaft throw eccentrically.",
    keySpecs: [
      { label: "Bore Diameter", "value": "85.0 mm" },
      { label: "Stroke Length", "value": "88.0 mm" },
      { label: "Compression Ratio", "value": "10.5:1" },
      { label: "Max Design Pressure", "value": "12.0 MPa" }
    ],
    failureModes: [
      "Piston crown fatigue warping under abnormal thermal cycle hotspots",
      "Seizure due to oil boundary friction breakdown",
      "Wrist pin bore shearing due to rapid deceleration forces at TDC"
    ],
    animationSpec: {
      type: "piston",
      partsCount: 5,
      baseColor: "#94a3b8"
    }
  },
  {
    id: "spur-helical-gear",
    name: "Helical Gear Mechanism",
    category: "mechanical",
    description: "High-precision mechanical component featuring custom angled helix-cut teeth that allow smoother and quieter engagement compared to standard spur gears.",
    materials: ["Chromium-Moly Steel (AISI 5130)", "Case Hardened Alloy 8620", "Synthetic Nitride Coating for surface stress relief"],
    workingPrinciples: "Helical gear teeth mesh along a gradual line of contact. This helix angle distributes loads evenly across multiple teeth, minimizing backlash, mechanical impact fatigue, and acoustic noise.",
    keySpecs: [
      { label: "Module (m)", "value": "3.5" },
      { label: "Helix Angle", "value": "22.5 Degrees" },
      { label: "Pressure Angle", "value": "20.0 Degrees" },
      { label: "Max Torque Capacity", "value": "520 Nm" }
    ],
    failureModes: [
      "Tooth surface pitting due to extreme cyclic contact stresses",
      "Bending fatigue fracturing tooth roots under critical high-shock startup loads",
      "Adhesive wear (scuffing) from local lubricating film failure"
    ],
    animationSpec: {
      type: "gear",
      partsCount: 2,
      baseColor: "#0284c7"
    }
  },
  {
    id: "rolling-ball-bearing",
    name: "Double-Row Deep Groove Ball Bearing",
    category: "mechanical",
    description: "Anti-friction component designed to support high radial and moderate axial loads while ensuring minimum rotational friction coeffecients under continuous high speed.",
    materials: ["High-Carbon Chromium Steel (AISI 52100)", "Polyamide (PA66) structural retainers", "Rubber NBR seals"],
    workingPrinciples: "Specially ground outer and inner raceways house hardened alloy spheres. Lubrication with synthetic grease reduces surface rolling resistance and prevents heating through micro-asperity sliding.",
    keySpecs: [
      { label: "Shaft Diameter (d)", "value": "45.0 mm" },
      { label: "Outer Diameter (D)", "value": "85.0 mm" },
      { label: "Dynamic Load Rate (Cr)", "value": "33.2 kN" },
      { label: "Limiting Speed", "value": "12,000 RPM" }
    ],
    failureModes: [
      "Subsurface micro-spalling representing typical rolling contact fatigue (RCF)",
      "Brinelling indentations caused by high-impact radial overload while static",
      "Electrical discharge erosion (fluting) in electric motor drives"
    ],
    animationSpec: {
      type: "bearing",
      partsCount: 4,
      baseColor: "#cbd5e1"
    }
  },
  {
    id: "bevel-gear-set",
    name: "Hypoid / Bevel Gear Assembly",
    category: "mechanical",
    description: "Gears with cone-shaped pitch surfaces used to transmit rotational mechanical power between non-parallel intersecting axes, typical in differential drive axles.",
    materials: ["Carburized Alloy Steel (SAE 4320)", "Cast Steel ASTM A148"],
    workingPrinciples: "Pinion meshes with the crown wheel, transferring torque through 90 degrees. Spiral bevel teeth engage gradually to withstand high shock parameters.",
    keySpecs: [
      { label: "Shaft Angle", "value": "90.0 Degrees" },
      { label: "Gear Ratio", "value": "3.73:1" },
      { label: "Pinion Tooth Count", "value": "11" },
      { label: "Crown Tooth Count", "value": "41" }
    ],
    failureModes: [
      "Scuffing on high-offset hypoid slides under extreme pressure loads",
      "Tooth edge chipping due to bearing failure shifting tooth alignment"
    ],
    animationSpec: {
      type: "gear",
      partsCount: 3,
      baseColor: "#0ea5e9"
    }
  },
  {
    id: "centrifugal-turbine",
    name: "Single-Stage Radial Inflow Gas Turbine",
    category: "aerospace",
    description: "High-enthalpy conversion unit extracting kinetic energy from expanding high-temperature combustion gases and translating it to drive compressor shafts dynamically.",
    materials: ["Nickel-based Superalloy (Inconel 718)", "Yttria-stabilized Zirconia (YSZ) Thermal Barrier Coating (TBC)"],
    workingPrinciples: "Hot gases are directed radially inwards through guide vanes, accelerating over curved rotor blades. The gas changes momentum, exerting force on turbine wings before exhausting axially.",
    keySpecs: [
      { label: "Inlet Gas Temp", "value": "1,150 K" },
      { label: "Pressure Ratio", "value": "4.2:1" },
      { label: "Blade Count", "value": "18" },
      { label: "Max Operational Speed", "value": "45,000 RPM" }
    ],
    failureModes: [
      "Creep deformation (rupture) of turbine blades under steady centrifugal stress at elevated operational temperatures",
      "Sulfidation corrosion from hot particulate friction and sulfur oxides",
      "Dynamic high-cycle blade resonance fatigue"
    ],
    animationSpec: {
      type: "nozzle",
      partsCount: 8,
      baseColor: "#f43f5e"
    }
  },
  {
    id: "worm-gear-reducer",
    name: "Self-Locking Worm Gear Pair",
    category: "mechanical",
    description: "A mechanical speed reducer utilizing a high-efficiency threaded screw mesh with a gear wheel, providing massive step-down ratios in small bounding volumes.",
    materials: ["Hardened Steel Screw for wear resistance", "Phosphor Bronze Gear (UNS C90700) to minimize galling"],
    workingPrinciples: "The continuous helical thread of the worm drives the curved wheel. The relative slide contact creates high sliding friction but provides a valuable self-locking feature.",
    keySpecs: [
      { label: "Lead Angle", "value": "6.5 Degrees" },
      { label: "Reduction Ratio", "value": "40:1" },
      { label: "Friction Coeff.", "value": "0.08" }
    ],
    failureModes: [
      "High thermal friction seizure during prolonged dry oil startup",
      "Abrasive pitting on bronze wheel teeth due to iron particle contamination"
    ],
    animationSpec: {
      type: "gear",
      partsCount: 2,
      baseColor: "#64748b"
    }
  }
];

export const FORMULAS_DATABASE: Formula[] = [
  {
    id: "euler-beam-bending",
    name: "Euler-Bernoulli Beam Bending Stress",
    domain: "Strength of Materials",
    formulaStr: "σ = M * y / I",
    derivation: "Derived by relating structural curvature (1/R = M/EI) to longitudinal axial strain (epsilon = y/R) under pure flexure, assuming planarity remains intact.",
    explanation: "Calculates the maximum local tension or compression stress experienced in a mechanical beam support structure under dynamic loads.",
    inputs: [
      { name: "Bending Moment (M)", key: "moment", defaultValue: 1500, unit: "N·m", min: 100, max: 10000 },
      { name: "Dist from Neutral Axis (y)", key: "yDist", defaultValue: 0.05, unit: "m", min: 0.005, max: 0.5 },
      { name: "Moment of Inertia (I)", key: "inertia", defaultValue: 0.000045, unit: "m⁴", min: 0.000001, max: 0.005 }
    ],
    calculate: (inputs) => {
      const { moment, yDist, inertia } = inputs;
      const stress = (moment * yDist) / inertia; // Pa
      const stressMPa = stress / 1e6;
      return {
        result: parseFloat(stressMPa.toFixed(2)),
        unit: "MPa",
        stepByStep: `1. Retrieve inputs: Moment M = ${moment} N·m, distance y = ${yDist} m, inert I = ${inertia} m⁴.\n2. Apply relation σ = (M * y) / I = (${moment} * ${yDist}) / ${inertia} = ${stress.toFixed(1)} Pa.\n3. Scale to user friendly engineering unit (Pa / 1,000,000) = ${stressMPa.toFixed(2)} MPa.`
      };
    }
  },
  {
    id: "diesel-cycle-efficiency",
    name: "Diesel Heat Engine Thermal Efficiency",
    domain: "Thermodynamics",
    formulaStr: "η = 1 - (1 / r^(γ-1)) * [(rc^γ - 1) / (γ * (rc - 1))]",
    derivation: "Formulated by integrating ideal gas equations along adiabatic compression, constant pressure isobaric combustion, adiabatic expansion, and constant volume exhausts.",
    explanation: "Determines the theoretical thermal power limits of continuous internal combustion diesel cycles based on ratios.",
    inputs: [
      { name: "Compression Ratio (r)", key: "r", defaultValue: 16, unit: "ratio", min: 10, max: 24 },
      { name: "Cut-off Ratio (rc)", key: "rc", defaultValue: 2, unit: "ratio", min: 1.1, max: 4 },
      { name: "Specific Heat Ratio (γ)", key: "gamma", defaultValue: 1.4, unit: "ratio", min: 1.2, max: 1.6 }
    ],
    calculate: (inputs) => {
      const { r, rc, gamma } = inputs;
      const part1 = 1 / Math.pow(r, gamma - 1);
      const numerator = Math.pow(rc, gamma) - 1;
      const denominator = gamma * (rc - 1);
      const efficiency = 1 - part1 * (numerator / denominator);
      return {
        result: parseFloat((efficiency * 100).toFixed(2)),
        unit: "%",
        stepByStep: `1. Calculate expansion ratio parameter: 1 / r^(γ-1) = 1 / ${r}^(${gamma}-1) = ${(part1).toFixed(4)}.\n2. Compute thermal multiplier factor: (rc^γ - 1) / (γ * (rc - 1)) = (${rc}^${gamma} - 1) / (${gamma} * (${rc} - 1)) = ${(numerator / denominator).toFixed(4)}.\n3. Combine cycles: η = 1 - (${(part1).toFixed(4)} * ${(numerator / denominator).toFixed(4)}) = ${(efficiency).toFixed(4)} corresponding to ${(efficiency * 100).toFixed(2)}% net conversion efficiency.`
      };
    }
  },
  {
    id: "fluid-reynolds-number",
    name: "Reynolds Number (Flow Classification)",
    domain: "Fluid Mechanics",
    formulaStr: "Re = (ρ * V * D) / μ",
    derivation: "Dimensionless ratio comparing convective inertial forces to micro-viscous fluid dampening forces along pipe boundaries.",
    explanation: "Predicts whether fluid flow within cooling corridors, aerospace injectors, or vehicle water pumps is laminar, transitional, or turbulent.",
    inputs: [
      { name: "Fluid Density (ρ)", key: "density", defaultValue: 1000, unit: "kg/m³", min: 1, max: 2000 },
      { name: "Mean Flow Velocity (V)", key: "velocity", defaultValue: 2.5, unit: "m/s", min: 0.1, max: 50 },
      { name: "Pipe Diameter (D)", key: "diameter", defaultValue: 0.05, unit: "m", min: 0.001, max: 1.0 },
      { name: "Dynamic Viscosity (μ)", key: "viscosity", defaultValue: 0.001, unit: "Pa·s", min: 0.0001, max: 0.1 }
    ],
    calculate: (inputs) => {
      const { density, velocity, diameter, viscosity } = inputs;
      const re = (density * velocity * diameter) / viscosity;
      return {
        result: Math.round(re),
        unit: "dimensionless",
        stepByStep: `1. Calculate inertial terms numerator: ρ * v * D = ${density} * ${velocity} * ${diameter} = ${density * velocity * diameter}.\n2. Divide by dynamic shear coefficient μ: ${density * velocity * diameter} / ${viscosity} = ${re.toFixed(1)}.\n3. Re > 4000 indicates fully developed turbulent flow containing vortex swirls.`
      };
    }
  },
  {
    id: "torque-power",
    name: "Rotational Torque-Power Relation",
    domain: "Machine Design",
    formulaStr: "T = P / ω  (where ω = 2 * π * N / 60)",
    derivation: "Relates angular displacement work per second inside shaft drives to active linear tangential force moments.",
    explanation: "Computes output shaft torque transmission requirements when designing electric vehicle drive motors or diesel drivetrains.",
    inputs: [
      { name: "Power Output (P)", key: "power", defaultValue: 15000, unit: "W", min: 100, max: 500000 },
      { name: "Rotational Speed (N)", key: "speed", defaultValue: 3000, unit: "RPM", min: 50, max: 15000 }
    ],
    calculate: (inputs) => {
      const { power, speed } = inputs;
      const omega = (2 * Math.PI * speed) / 60;
      const torque = power / omega;
      return {
        result: parseFloat(torque.toFixed(2)),
        unit: "N·m",
        stepByStep: `1. Calculate angular velocity: ω = (2 * π * ${speed}) / 60 = ${omega.toFixed(3)} rad/s.\n2. Divide design power continuous limit by angular rate: T = ${power} W / ${omega.toFixed(3)} rad/s = ${torque.toFixed(2)} N·m.`
      };
    }
  }
];

export const ROADMAPS_DATABASE: Record<string, RoadmapNode[]> = {
  mechanical: [
    {
      id: "m1",
      title: "Core Solid Statics & Mechanics of Materials",
      description: "Master stress and strain tensors, shear/moment diagrams, Mohr's circle, torsion, structural buckling, and material fatigue limits.",
      milestones: ["Analyse beam deflection vectors", "Determine principal stress criteria", "Verify stress concentration factors (Kt)"],
      recommendedCAD: ["AutoCAD for initial 2D schematics", "SolidWorks for mechanical part assemblies"]
    },
    {
      id: "m2",
      title: "Advanced Machine Element Design",
      description: "Understand gear mesh ratios, life cycle calculations of bearings, couplings, fasteners, clutches, springs, and pressure vessels.",
      milestones: ["Iterate helical gear contact stresses", "Determine L10 bearing fatigue lifetimes", "Design multi-plate friction clutches"],
      recommendedCAD: ["CATIA for robust machine routing", "Fusion 360 for cloud generative optimization"]
    },
    {
      id: "m3",
      title: "CAE Finite Element Analysis (FEA)",
      description: "Transition models into numerical simulation environments. Solve thermal heat loads, structural mesh meshing, boundary setups, and dynamic resonance vibrations.",
      milestones: ["Generate clean tetrahedral mesh assemblies", "Apply precise static locking boundaries", "Identify natural flutter frequencies"],
      recommendedCAD: ["ANSYS Mechanical", "Abaqus for nonlinear stress simulation"]
    }
  ],
  aerospace: [
    {
      id: "a1",
      title: "Fluid Statics & Compressible Aerodynamics",
      description: "Explore lift and drag equations, Mach boundaries, subsonic vs supersonic shockwave convergence, and airfoil drag dynamics.",
      milestones: ["Analyze Bernoulli lift differentials", "Plot NACA 4-digit airfoil pressure profiles", "Solve compressible Prandtl-Meyer expansion waves"],
      recommendedCAD: ["SolidWorks Flow Simulation", "OpenFOAM for open source fluid solutions"]
    },
    {
      id: "a2",
      title: "Jet Propulsion & Cycle Engineering",
      description: "Analyse thermodynamic turbine cycles including Brayton turbofans, jet thrust, ramjets, compression rotors, and nozzle expansions.",
      milestones: ["Write Jet Engine flow equations", "Calculate turbine stage reaction ratios", "Analyse nozzle supersonic throat profiles"],
      recommendedCAD: ["Ansys Fluent for advanced thermal mixing", "MATLAB Simulink"]
    }
  ],
  ev: [
    {
      id: "e1",
      title: "Battery Cell Chemistry & Thermal Management",
      description: "Master lithium-ion battery electrochemistry, cooling loop CFD assemblies, state of health algorithms, and passive cell safety.",
      milestones: ["Design liquid cooling flow manifolds", "Calculate cell thermal heat generation peaks", "Program battery fuel gauge parameters in BMS"],
      recommendedCAD: ["ANSYS Icepak for heat dissipation", "COMSOL Multiphysics"]
    },
    {
      id: "e2",
      title: "Electric Motor Fields & Kinematics",
      description: "Evaluate permanent magnet synchronous motors (PMSM) and AC induction machinery, stator field vectors, and copper losses.",
      milestones: ["Solve magnetic flux stator lines", "Optimize rotor tooth layout configurations", "Design custom traction inverter circuits"],
      recommendedCAD: ["Ansys Maxwell for magnetic FEA", "SolidWorks Electrical"]
    }
  ]
};
