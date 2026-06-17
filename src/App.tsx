import React, { useState, useEffect, useRef } from "react";
import { 
  Wrench, 
  Search, 
  Cpu, 
  Rotate3d, 
  Zap, 
  Activity, 
  Flame, 
  Layers, 
  Maximize2, 
  Compass, 
  BookmarkCheck, 
  ChevronRight, 
  BookOpen, 
  Play, 
  Pause, 
  Sliders, 
  FileText, 
  Calculator, 
  Send, 
  Users, 
  Volleyball, 
  Award, 
  Wind, 
  Eye, 
  Tv, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  RefreshCw, 
  FolderLock, 
  HelpCircle,
  Scissors
} from "lucide-react";
import TrademarkIcon from "./components/TrademarkIcon";
import { mechanicalAudio } from "./components/AudioEngine";
import { COMPONENTS_DATABASE, FORMULAS_DATABASE, ROADMAPS_DATABASE } from "./data/engineeringData";
import { EngineeringComponent, Formula } from "./types";

export default function App() {
  // Global State
  const [selectedComp, setSelectedComp] = useState<EngineeringComponent>(COMPONENTS_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"cad-sandbox" | "element-library" | "formula-hub" | "multiphysics-labs" | "generative-copilot" | "career">("cad-sandbox");
  
  // Simulation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [rpm, setRpm] = useState(1200);
  const [explodeFactor, setExplodeFactor] = useState(0); // 0 to 100
  const [renderMode, setRenderMode] = useState<"solid" | "wireframe" | "xray" | "thermal" | "cfd">("solid");
  const [cutSection, setCutSection] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotationX, setRotationX] = useState(30);
  const [rotationY, setRotationY] = useState(45);

  // Formula Hub Solver state
  const [activeFormula, setActiveFormula] = useState<Formula>(FORMULAS_DATABASE[0]);
  const [formulaInputs, setFormulaInputs] = useState<Record<string, number>>({});

  // AI Assistant state
  const [aiQuery, setAiQuery] = useState("Explain premium alloys suitable for high temperatures in turbines.");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  // AI Generative Design state
  const [genQuery, setGenQuery] = useState("Planetary Gearbox for 20kW EV Drive Motor");
  const [generatedDesign, setGeneratedDesign] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);

  // Specialty Labs Tab selection
  const [activeLabTab, setActiveLabTab] = useState<"aero" | "auto" | "ev" | "manufacture" | "robotics">("aero");

  // Interactive Aerodynamic sandbox states
  const [airfoilSpeed, setAirfoilSpeed] = useState(250); // km/h
  const [angleOfAttack, setAngleOfAttack] = useState(5); // degrees
  const [airfoilShape, setAirfoilShape] = useState<"naca0012" | "supercritical" | "high-lift">("naca0012");

  // Automobile Interactive states
  const [clutchEngaged, setClutchEngaged] = useState(true);
  const [currentAutoGear, setCurrentAutoGear] = useState(1);
  const [brakeApplied, setBrakeApplied] = useState(false);
  const [brakeTemp, setBrakeTemp] = useState(90);

  // EV Lab states
  const [evBatterySoc, setEvBatterySoc] = useState(82);
  const [evMotorMagneticAngle, setEvMotorMagneticAngle] = useState(0);
  const [bmsStatus, setBmsStatus] = useState("NOMINAL - BALANCING CELLS");

  // Smart Manufacturing simulations
  const [cncProgress, setCncProgress] = useState(0);
  const [cncPathOption, setCncPathOption] = useState<"pocket" | "contour" | "carving">("pocket");
  const [printerLayer, setPrinterLayer] = useState(140);

  // Robotic Arm kinematic coordinates
  const [robotTheta1, setRobotTheta1] = useState(45);
  const [robotTheta2, setRobotTheta2] = useState(30);
  const [robotPayload, setRobotPayload] = useState(5.0);

  // Career Section Roadmaps
  const [activeRoadmap, setActiveRoadmap] = useState<"mechanical" | "aerospace" | "ev">("mechanical");

  // AR/VR Simulated Collaboration
  const [vrUsers, setVrUsers] = useState<string[]>(["Markus (Munich)", "Yuki (Tokushima)", "Harsh (Rgipt)"]);
  const [activeDesignRoom, setActiveDesignRoom] = useState("Chasis Stress Sync room");

  // Canvas Refs
  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const printCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Audio settings
  useEffect(() => {
    mechanicalAudio.setMute(isAudioMuted);
  }, [isAudioMuted]);

  // Handle formula change initial variables
  useEffect(() => {
    if (activeFormula) {
      const initialInputs: Record<string, number> = {};
      activeFormula.inputs.forEach((input) => {
        initialInputs[input.key] = input.defaultValue;
      });
      setFormulaInputs(initialInputs);
    }
  }, [activeFormula]);

  // Audio click facilitator
  const handleInteraction = (soundType: "metallic" | "hydraulic" | "gear" | "pneumatic") => {
    mechanicalAudio.playClick(soundType);
  };

  // Quick helper to fetch tutor answer based on current component
  const askTutorForActiveComp = async () => {
    handleInteraction("pneumatic");
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component: selectedComp.name,
          category: selectedComp.category,
          query: `Tell me how to design the ${selectedComp.name} with equations, its failure modes, and best engineering metals.`
        })
      });
      const data = await res.json();
      if (data.error) {
        setAiResponse(`### ⚠️ System Advisory\n${data.error}`);
      } else {
        setAiResponse(data.text);
      }
    } catch (err: any) {
      setAiResponse(`### ❌ Connection Interrupted\nFailed to reach the AI engine container. Please retry or contact technical support.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Custom AI Tutor generic submit
  const submitCustomTutorQuery = async () => {
    if (!aiQuery.trim()) return;
    handleInteraction("hydraulic");
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component: selectedComp.name,
          category: selectedComp.category,
          query: aiQuery
        })
      });
      const data = await res.json();
      if (data.error) {
        setAiResponse(`### ⚠️ System Advisory\n${data.error}`);
      } else {
        setAiResponse(data.text);
      }
    } catch (err) {
      setAiResponse(`### ❌ Connection Interrupted\nFailed to secure response from engineering container.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Custom AI Design Generation submit
  const submitDesignGeneration = async () => {
    if (!genQuery.trim()) return;
    handleInteraction("metallic");
    setGenLoading(true);
    setGeneratedDesign(null);
    try {
      const res = await fetch("/api/design-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: genQuery })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setGeneratedDesign(data);
      }
    } catch (err) {
      alert("Error generating generative CAD specifications.");
    } finally {
      setGenLoading(false);
    }
  };

  // Simulation Canvas loop (High performance rendering)
  useEffect(() => {
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let localFrame = 0;

    const draw = () => {
      localFrame += isPlaying ? (rpm / 300) : 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save Context and apply transforms
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      
      // Calculate exploded views displacements
      const explodeOffset = (explodeFactor / 100) * 45;

      // Draw background schematic coordinates grid
      ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
      ctx.lineWidth = 1;
      for (let i = -200; i <= 200; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, -200);
        ctx.lineTo(i, 200);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-200, i);
        ctx.lineTo(200, i);
        ctx.stroke();
      }

      // Base Render colors based on material and mode
      let primaryColor = "rgb(14, 165, 233)";
      let accentColor = "rgb(56, 189, 248)";
      let backgroundFill = "rgba(13, 148, 136, 0.15)";

      if (renderMode === "wireframe") {
        primaryColor = "rgba(56, 189, 248, 0.8)";
        accentColor = "rgba(0, 240, 255, 0.9)";
      } else if (renderMode === "xray") {
        primaryColor = "rgba(147, 51, 234, 0.45)";
        accentColor = "rgba(192, 132, 252, 0.8)";
        backgroundFill = "rgba(147, 51, 234, 0.05)";
      } else if (renderMode === "thermal") {
        const heatPulse = Math.sin(localFrame * 0.05) * 40;
        primaryColor = `rgb(${230 + heatPulse}, ${100 - heatPulse}, 30)`;
        accentColor = "rgb(251, 146, 60)";
        backgroundFill = "rgba(239, 68, 68, 0.1)";
      } else if (renderMode === "cfd") {
        primaryColor = "rgb(16, 185, 129)";
        accentColor = "rgb(34, 197, 94)";
        backgroundFill = "rgba(16, 185, 129, 0.05)";
      }

      // Helper gradients for realistic metals (steel, titanium, brass)
      const getRadMetalGradient = (cx: number, cy: number, r: number, style: "steel" | "brass" | "titanium") => {
        const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.05, cx, cy, r);
        if (style === "brass") {
          grad.addColorStop(0, "#fffebb");
          grad.addColorStop(0.35, "#facc15");
          grad.addColorStop(0.7, "#bf8f00");
          grad.addColorStop(0.9, "#854d0e");
          grad.addColorStop(1.0, "#451a03");
        } else if (style === "titanium") {
          grad.addColorStop(0, "#f1f5f9");
          grad.addColorStop(0.3, "#94a3b8");
          grad.addColorStop(0.65, "#475569");
          grad.addColorStop(0.9, "#1e293b");
          grad.addColorStop(1.0, "#020617");
        } else { // steel
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.25, "#e2e8f0");
          grad.addColorStop(0.55, "#cbd5e1");
          grad.addColorStop(0.85, "#64748b");
          grad.addColorStop(1.0, "#1f2937");
        }
        return grad;
      };

      const getLinMetalGradient = (x1: number, y1: number, x2: number, y2: number, style: "steel" | "brass" | "titanium") => {
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        if (style === "brass") {
          grad.addColorStop(0, "#854d0e");
          grad.addColorStop(0.25, "#eab308");
          grad.addColorStop(0.5, "#fef08a");
          grad.addColorStop(0.75, "#ca8a04");
          grad.addColorStop(1, "#451a03");
        } else if (style === "titanium") {
          grad.addColorStop(0, "#1e293b");
          grad.addColorStop(0.3, "#475569");
          grad.addColorStop(0.5, "#f1f5f9");
          grad.addColorStop(0.7, "#64748b");
          grad.addColorStop(1, "#020617");
        } else { // steel
          grad.addColorStop(0, "#334155");
          grad.addColorStop(0.25, "#94a3b8");
          grad.addColorStop(0.5, "#ffffff");
          grad.addColorStop(0.75, "#475569");
          grad.addColorStop(1, "#1e293b");
        }
        return grad;
      };

      // Isometric projection based on RotationX and RotationY
      const rotYRad = (rotationY * Math.PI) / 180;
      const rotXRad = (rotationX * Math.PI) / 180;

      // Project 3D vector function helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const xRotY = x * Math.cos(rotYRad) - z * Math.sin(rotYRad);
        const zRotY = x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
        // Rotate around X
        const yRotX = y * Math.cos(rotXRad) - zRotY * Math.sin(rotXRad);
        return { x: xRotY, y: yRotX };
      };

      // Draw different system models based on selection
      if (selectedComp.animationSpec.type === "gear") {
        // Render Helical or Bevel gears meshing
        const angleGear1 = localFrame * 0.02;
        const angleGear2 = -angleGear1 * 1.5;

        // Gear 1 Center: (-55 - explodeOffset, 0, 0)
        ctx.save();
        const baseCenter1 = project(-55 - explodeOffset, 0, 0);
        ctx.translate(baseCenter1.x, baseCenter1.y);
        ctx.rotate(angleGear1);

        const r1 = 48;
        if (renderMode === "solid") {
          // Steel spur gear base
          ctx.fillStyle = getRadMetalGradient(0, 0, r1, "steel");
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Bevel / Groove indent
          ctx.fillStyle = getRadMetalGradient(-5, -5, r1 * 0.65, "titanium");
          ctx.beginPath();
          ctx.arc(0, 0, r1 * 0.65, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner rim shine
          ctx.strokeStyle = "rgba(255,255,255,0.18)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, r1 * 0.8, 0, Math.PI * 2);
          ctx.stroke();

          // Bolt patterns for realistic indexing
          ctx.fillStyle = "#cbd5e1";
          for (let b = 0; b < 6; b++) {
            const bAngle = (b * Math.PI * 2) / 6;
            ctx.beginPath();
            ctx.arc(Math.cos(bAngle)*18, Math.sin(bAngle)*18, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#334155";
            ctx.stroke();
          }
        } else if (renderMode === "thermal") {
          const thermalGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r1);
          thermalGrad.addColorStop(0, "#fef08a"); // hot center
          thermalGrad.addColorStop(0.4, "#ea580c");
          thermalGrad.addColorStop(1, "#450a0a");
          ctx.fillStyle = thermalGrad;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.fill();
        } else if (renderMode === "xray") {
          ctx.fillStyle = "rgba(147, 51, 234, 0.15)";
          ctx.strokeStyle = "rgba(192, 132, 252, 0.8)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Inner core projection
          ctx.beginPath();
          ctx.arc(0, 0, r1 * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        } else if (renderMode === "cfd") {
          ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else { // wireframe
          ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r1 * 0.7, 0, Math.PI * 2);
          ctx.stroke();
          // Wireframe grid radial spokes
          for (let s = 0; s < 8; s++) {
            const sAngle = (s * Math.PI * 2) / 8;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sAngle)*r1, Math.sin(sAngle)*r1);
            ctx.stroke();
          }
        }

        // Draw Gear 1 Teeth
        for (let i = 0; i < 18; i++) {
          const toothAngle = (i * Math.PI * 2) / 18;
          ctx.save();
          ctx.rotate(toothAngle);
          
          if (renderMode === "solid") {
            ctx.fillStyle = getLinMetalGradient(-6, -45, 6, -58, "steel");
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 1;
          } else if (renderMode === "thermal") {
            ctx.fillStyle = "#ea580c";
          } else if (renderMode === "xray") {
            ctx.fillStyle = "rgba(168, 85, 247, 0.6)";
            ctx.strokeStyle = "rgba(192, 132, 252, 0.8)";
          } else if (renderMode === "cfd") {
            ctx.fillStyle = "rgba(16, 185, 129, 0.5)";
          } else { // wireframe
            ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
            ctx.fillStyle = "transparent";
          }

          ctx.beginPath();
          ctx.moveTo(-6, -45);
          ctx.lineTo(-4, -58);
          ctx.lineTo(4, -58);
          ctx.lineTo(6, -45);
          ctx.closePath();
          if (renderMode !== "wireframe") ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Inner keyway axle cap
        ctx.fillStyle = renderMode === "solid" ? "#1e293b" : "transparent";
        ctx.strokeStyle = renderMode === "solid" ? "#94a3b8" : "rgba(56, 189, 248, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();


        // Gear 2 Center (55 + explodeOffset, 0, 0) - Brass meshing spur
        ctx.save();
        const baseCenter2 = project(55 + explodeOffset, 0, 0);
        ctx.translate(baseCenter2.x, baseCenter2.y);
        ctx.rotate(angleGear2);

        const r2 = 72;
        if (renderMode === "solid") {
          // High-grade golden brass alloy gear body
          ctx.fillStyle = getRadMetalGradient(0, 0, r2, "brass");
          ctx.strokeStyle = "#854d0e";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, r2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Bevel inset circle
          ctx.fillStyle = getRadMetalGradient(-5, -5, r2 * 0.7, "brass");
          ctx.beginPath();
          ctx.arc(0, 0, r2 * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Bolt patterns for realistic indexing
          ctx.fillStyle = "#eab308";
          for (let b = 0; b < 8; b++) {
            const bAngle = (b * Math.PI * 2) / 8;
            ctx.beginPath();
            ctx.arc(Math.cos(bAngle)*30, Math.sin(bAngle)*30, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#451a03";
            ctx.stroke();
          }
        } else if (renderMode === "thermal") {
          const thermalGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r2);
          thermalGrad.addColorStop(0, "#fef08a");
          thermalGrad.addColorStop(0.3, "#f97316");
          thermalGrad.addColorStop(1, "#3f0c0a");
          ctx.fillStyle = thermalGrad;
          ctx.beginPath();
          ctx.arc(0, 0, r2, 0, Math.PI * 2);
          ctx.fill();
        } else if (renderMode === "xray") {
          ctx.fillStyle = "rgba(147, 51, 234, 0.1)";
          ctx.strokeStyle = "rgba(192, 132, 252, 0.8)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, r2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (renderMode === "cfd") {
          ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, r2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else { // wireframe
          ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, r2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r2 * 0.72, 0, Math.PI * 2);
          ctx.stroke();
          // spokes
          for (let s = 0; s < 12; s++) {
            const sAngle = (s * Math.PI * 2) / 12;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sAngle)*r2, Math.sin(sAngle)*r2);
            ctx.stroke();
          }
        }

        // Draw Gear 2 Teeth (Brass helicals)
        for (let i = 0; i < 27; i++) {
          const toothAngle = (i * Math.PI * 2) / 27;
          ctx.save();
          ctx.rotate(toothAngle);

          if (renderMode === "solid") {
            ctx.fillStyle = getLinMetalGradient(-5, -67, 5, -80, "brass");
            ctx.strokeStyle = "#713f12";
            ctx.lineWidth = 1;
          } else if (renderMode === "thermal") {
            ctx.fillStyle = "#f97316";
          } else if (renderMode === "xray") {
            ctx.fillStyle = "rgba(168, 85, 247, 0.5)";
            ctx.strokeStyle = "rgba(192, 132, 252, 0.8)";
          } else if (renderMode === "cfd") {
            ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
          } else { // wireframe
            ctx.strokeStyle = "rgba(0, 240, 255, 0.9)";
            ctx.fillStyle = "transparent";
          }

          ctx.beginPath();
          ctx.moveTo(-5, -67);
          ctx.lineTo(-3, -80);
          ctx.lineTo(3, -80);
          ctx.lineTo(5, -67);
          ctx.closePath();
          if (renderMode !== "wireframe") ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Axle Core Center
        ctx.fillStyle = renderMode === "solid" ? "#0f172a" : "transparent";
        ctx.strokeStyle = renderMode === "solid" ? "#facc15" : "rgba(0, 240, 255, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.rect(-8, -8, 16, 16);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

      } else if (selectedComp.animationSpec.type === "piston") {
        const crankAngle = localFrame * 0.035;
        const crankRadius = 32;
        const rodLength = 90;

        // Coordinates of Crank Pin
        const crankPinX = Math.cos(crankAngle) * crankRadius;
        const crankPinY = Math.sin(crankAngle) * crankRadius;

        // Slider-Crank physics calculation (Piston y offset)
        const pX = 0;
        const pY = -crankPinY - Math.sqrt(rodLength * rodLength - crankPinX * crankPinX);

        const centerPt = project(0, 0, 0);

        // 1. Draw outer combustion cylinder sleeve chamber
        if (renderMode === "solid") {
          // Realistic slate metallic cylinder block with exterior cooling fins
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 4;
          const leftC = centerPt.x - 38 - explodeOffset;
          const rightC = centerPt.x + 38 + explodeOffset;
          
          // Draw cylinder block background
          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          ctx.fillRect(leftC, centerPt.y - 145, rightC - leftC, 92);

          // Draw cooling fins (horizontal ribs on left & right sides)
          ctx.fillStyle = "#334155";
          for (let f = centerPt.y - 140; f <= centerPt.y - 65; f += 12) {
            ctx.fillRect(leftC - 8, f, 8, 3);
            ctx.fillRect(rightC, f, 8, 3);
          }

          // Cylinder sleeves lines
          ctx.beginPath();
          ctx.moveTo(leftC, centerPt.y - 145);
          ctx.lineTo(leftC, centerPt.y - 53);
          ctx.moveTo(rightC, centerPt.y - 145);
          ctx.lineTo(rightC, centerPt.y - 53);
          ctx.stroke();
        } else if (renderMode === "thermal") {
          const blockGrad = ctx.createLinearGradient(centerPt.x - 45, 0, centerPt.x + 45, 0);
          blockGrad.addColorStop(0, "#7f1d1d");
          blockGrad.addColorStop(0.5, "#ef4444");
          blockGrad.addColorStop(1, "#7f1d1d");
          ctx.fillStyle = blockGrad;
          ctx.fillRect(centerPt.x - 38, centerPt.y - 145, 76, 85);
        } else { // wireframe / xray
          ctx.strokeStyle = renderMode === "wireframe" ? "rgba(244, 63, 94, 0.6)" : "rgba(147, 51, 234, 0.3)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(centerPt.x - 38 - explodeOffset, centerPt.y - 145, 76 + explodeOffset * 2, 85);
        }

        // Combustion visualization in chamber: glowing beautiful plasma expansion ring
        if (isPlaying && Math.sin(crankAngle) > 0.7) {
          const combustionGrad = ctx.createRadialGradient(centerPt.x, centerPt.y - 130, 2, centerPt.x, centerPt.y - 130, 45);
          combustionGrad.addColorStop(0, "#fffbeb");
          combustionGrad.addColorStop(0.2, "#fef08a");
          combustionGrad.addColorStop(0.5, "#f97316");
          combustionGrad.addColorStop(0.8, "#ef4444");
          combustionGrad.addColorStop(1.0, "rgba(239, 68, 68, 0)");
          
          ctx.fillStyle = combustionGrad;
          ctx.beginPath();
          ctx.arc(centerPt.x, centerPt.y - 130, 45 + explodeOffset, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Draw Crankshaft axle center disk
        ctx.save();
        const diskLoc = project(0, 45, 0);
        ctx.translate(diskLoc.x, diskLoc.y);
        
        if (renderMode === "solid") {
          ctx.fillStyle = getRadMetalGradient(0, 0, 28, "titanium");
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 28, Math.PI * 0.1, Math.PI * 0.9, false);
          ctx.lineTo(-10, -32);
          ctx.lineTo(10, -32);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Main heavy counterweight bolt
          ctx.fillStyle = "#cbd5e1";
          ctx.beginPath();
          ctx.arc(0, 15, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = primaryColor;
          ctx.fillStyle = "rgba(30, 41, 59, 0.2)";
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();

        // 3. Draw Connecting Rod linkage line (Forged steel I-beam rod)
        const crankProj = project(crankPinX, 45 + crankPinY, 0);
        const pistonProj = project(pX, 45 + pY, 0);

        if (renderMode === "solid") {
          ctx.strokeStyle = getLinMetalGradient(crankProj.x, crankProj.y, pistonProj.x, pistonProj.y, "steel");
          ctx.lineWidth = 10;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(crankProj.x, crankProj.y);
          ctx.lineTo(pistonProj.x, pistonProj.y);
          ctx.stroke();

          // Recess web
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(crankProj.x * 0.9 + pistonProj.x * 0.1, crankProj.y * 0.9 + pistonProj.y * 0.1);
          ctx.lineTo(crankProj.x * 0.1 + pistonProj.x * 0.9, crankProj.y * 0.1 + pistonProj.y * 0.9);
          ctx.stroke();
        } else {
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(crankProj.x, crankProj.y);
          ctx.lineTo(pistonProj.x, pistonProj.y);
          ctx.stroke();
        }

        // 4. Draw Linear Piston Head crown
        ctx.save();
        ctx.translate(pistonProj.x, pistonProj.y);
        
        const pw = 68 + explodeOffset * 2;
        if (renderMode === "solid") {
          // Brushed CNC titanium piston head structure
          ctx.fillStyle = getLinMetalGradient(-pw/2, -24, pw/2, 14, "titanium");
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(-pw/2, -24, pw, 38);
          ctx.fill();
          ctx.stroke();

          // Dome detail
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(-pw/2 + 2, -22, pw - 4, 6);

          // Piston compression gas rings grooving
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(-pw/2 - 0.5, -16, 2.5, 3);
          ctx.fillRect(-pw/2 - 0.5, -9, 2.5, 3);
          ctx.fillRect(pw/2 - 2, -16, 2.5, 3);
          ctx.fillRect(pw/2 - 2, -9, 2.5, 3);

          // Piston Pin (Wristpin) journal aperture
          ctx.fillStyle = getRadMetalGradient(0, -2, 9, "steel");
          ctx.beginPath();
          ctx.arc(0, -2, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#475569";
          ctx.stroke();
        } else if (renderMode === "thermal") {
          const pistonThGrad = ctx.createLinearGradient(0, -24, 0, 14);
          pistonThGrad.addColorStop(0, "#f97316");
          pistonThGrad.addColorStop(0.5, "#ea580c");
          pistonThGrad.addColorStop(1, "#7f1d1d");
          ctx.fillStyle = pistonThGrad;
          ctx.fillRect(-pw/2, -24, pw, 38);
        } else if (renderMode === "xray") {
          ctx.fillStyle = "rgba(147, 51, 234, 0.2)";
          ctx.strokeStyle = "rgba(192, 132, 252, 0.85)";
          ctx.beginPath();
          ctx.rect(-pw/2, -24, pw, 38);
          ctx.fill();
          ctx.stroke();
        } else { // wireframe
          ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
          ctx.strokeRect(-pw/2, -24, pw, 38);
          ctx.beginPath();
          ctx.moveTo(-pw/2, -10);
          ctx.lineTo(pw/2, -10);
          ctx.stroke();
        }
        ctx.restore();

        // Joint pins
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(crankProj.x, crankProj.y, 5, 0, Math.PI * 2);
        ctx.arc(pistonProj.x, pistonProj.y - 2, 4, 0, Math.PI * 2);
        ctx.fill();

      } else if (selectedComp.animationSpec.type === "bearing") {
        const bearingAngle = localFrame * 0.015;
        const outerR = 75;
        const innerR = 40;
        const ballR = 15;
        const midR = (outerR + innerR) / 2;

        const centerPt = project(0, 0, 0);
        ctx.save();
        ctx.translate(centerPt.x, centerPt.y);

        const outLimit = outerR + explodeOffset;
        const inLimit = innerR - explodeOffset;

        if (renderMode === "solid") {
          // Stainless steel Outer Race ring
          ctx.fillStyle = getRadMetalGradient(0, 0, outLimit, "steel");
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, outLimit, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner hollow center (clearing outer race inner perimeter)
          ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
          ctx.beginPath();
          ctx.arc(0, 0, outLimit - 8, 0, Math.PI * 2);
          ctx.fill();

          // Steel Inner Race ring
          ctx.fillStyle = getRadMetalGradient(0, 0, inLimit, "steel");
          ctx.beginPath();
          ctx.arc(0, 0, inLimit, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Shaft core mount cutout hole
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(0, 0, inLimit - 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Steel guide race concentric grooving
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, midR, 0, Math.PI * 2);
          ctx.stroke();

          // Draw real golden brass linkage cage bars for holding balls
          ctx.strokeStyle = getRadMetalGradient(0, 0, midR + 2, "brass");
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, midR, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, outLimit, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, inLimit, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw balls
        for (let i = 0; i < 8; i++) {
          const ballAngle = bearingAngle + (i * Math.PI * 2) / 8;
          const bX = Math.cos(ballAngle) * midR;
          const bY = Math.sin(ballAngle) * midR;

          if (renderMode === "solid") {
            const ballGrad = ctx.createRadialGradient(bX - ballR * 0.35, bY - ballR * 0.35, ballR * 0.05, bX, bY, ballR);
            ballGrad.addColorStop(0, "#ffffff");
            ballGrad.addColorStop(0.3, "#cbd5e1");
            ballGrad.addColorStop(0.7, "#475569");
            ballGrad.addColorStop(1.0, "#0f172a");
            
            ctx.shadowColor = "rgba(0,0,0,0.4)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.fillStyle = ballGrad;
            ctx.beginPath();
            ctx.arc(bX, bY, ballR, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bX, bY, ballR - 1, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = rendererBallColor(renderMode);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bX, bY, ballR, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
        ctx.restore();
      } else {
        const spinTime = localFrame * 0.04;
        const centerPt = project(0, 0, 0);

        ctx.save();
        ctx.translate(centerPt.x, centerPt.y);

        const casingR = 72;
        if (renderMode === "solid") {
          ctx.strokeStyle = getRadMetalGradient(0, 0, casingR, "titanium");
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(0, 0, casingR, 0, Math.PI * 2);
          ctx.stroke();

          // Bolt patterns along casing perimeter
          ctx.fillStyle = "#cbd5e1";
          for (let b = 0; b < 12; b++) {
            const bAngle = (b * Math.PI * 2) / 12;
            ctx.beginPath();
            ctx.arc(Math.cos(bAngle)*casingR, Math.sin(bAngle)*casingR, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, casingR - 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Central rotating impeller blades with metallics
        for (let i = 0; i < 12; i++) {
          const angle = spinTime + (i * Math.PI * 2) / 12;
          ctx.save();
          ctx.rotate(angle);
          
          if (renderMode === "solid") {
            const bladeGrad = ctx.createLinearGradient(0, 0, 52, 10);
            bladeGrad.addColorStop(0, "#475569");
            bladeGrad.addColorStop(0.3, "#94a3b8");
            bladeGrad.addColorStop(0.6, "#cbd5e1");
            bladeGrad.addColorStop(0.9, "#e2e8f0");
            bladeGrad.addColorStop(1.0, "#475569");
            ctx.fillStyle = bladeGrad;
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 1;
          } else if (renderMode === "thermal") {
            const bladeTh = ctx.createLinearGradient(0, 0, 52, 0);
            bladeTh.addColorStop(0, "#ef4444");
            bladeTh.addColorStop(1, "#fef08a");
            ctx.fillStyle = bladeTh;
          } else if (renderMode === "xray") {
            ctx.fillStyle = "rgba(168, 85, 247, 0.45)";
            ctx.strokeStyle = "rgba(192, 132, 252, 0.8)";
          } else if (renderMode === "cfd") {
            ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
            ctx.strokeStyle = "#10b981";
          } else { // wireframe
            ctx.fillStyle = "transparent";
            ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
          }

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(25, -20, 52, 0);
          ctx.quadraticCurveTo(20, 20, 0, 0);
          ctx.closePath();
          if (renderMode !== "wireframe") ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Axle nose cap (shiny metallic hub locknut)
        ctx.fillStyle = renderMode === "solid" ? getRadMetalGradient(0, 0, 14, "steel") : "#ffffff";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // Air flow indicators for CFD visualizations
      if (renderMode === "cfd") {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1.5;
        const blockCount = 5;
        for (let k = 0; k < blockCount; k++) {
          const flowX = -120 + ((localFrame * 2 + k * 80) % 240);
          const flowY = -80 + (k * 40);
          ctx.beginPath();
          ctx.moveTo(flowX, flowY);
          ctx.lineTo(flowX + 25, flowY);
          ctx.stroke();
        }
      }

      // CAD Blueprint Dimension markings
      if (cutSection) {
        ctx.strokeStyle = "rgba(220, 38, 38, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(-150, 0);
        ctx.lineTo(150, 0);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(220, 38, 38, 0.1)";
        ctx.fillRect(-150, 0, 300, 150);
        ctx.fillStyle = "rgba(220, 38, 38, 0.9)";
        ctx.font = "10px monospace";
        ctx.fillText("SECTION PLANE C-C (ACTIVE)", -140, -8);
      }

      ctx.restore();

      // Top corner measurement metadata overlay
      ctx.fillStyle = "#38bdf8";
      ctx.font = "10px monospace";
      ctx.fillText(`ENGINE STATE: ON (RPM: ${rpm})`, 15, 22);
      ctx.fillText(`ZOOM PREVIEW: ${zoom}X`, 15, 38);
      ctx.fillText(`ROTATION: X=${rotationX}°, Y=${rotationY}°`, 15, 54);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedComp, isPlaying, rpm, explodeFactor, renderMode, cutSection, zoom, rotationX, rotationY, activeTab]);

  // Color selection helper
  const rendererBallColor = (mode: string) => {
    switch (mode) {
      case "xray": return "rgba(168, 85, 247, 0.8)";
      case "thermal": return "#ea580c";
      case "cfd": return "#10b981";
      default: return "#f1f5f9";
    }
  };

  // Live Simulation for Smart manufacturing (CNCs and printers)
  useEffect(() => {
    const canvas = printCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let localFrame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localFrame++;

      // CAD grid
      ctx.strokeStyle = "rgba(56, 189, 248, 0.04)";
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      if (activeLabTab === "manufacture") {
        // Draw CNC milling simulation or 3D Printer
        ctx.strokeStyle = "rgb(14, 165, 233)";
        ctx.lineWidth = 2;
        
        // Block to machine
        ctx.fillStyle = "rgba(71, 85, 105, 0.45)";
        ctx.fillRect(40, 60, 200, 100);

        // Machined path tool tracing array
        ctx.strokeStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(40, 60);
        const segments = Math.min((localFrame % 300), 200);
        for (let i = 0; i < segments; i++) {
          const px = 40 + i;
          const py = 60 + Math.sin(i * 0.12) * 12 + (i * 0.2);
          ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Dynamic drill tool
        const toolX = 40 + segments;
        const toolY = 60 + Math.sin(segments * 0.12) * 12 + (segments * 0.2);
        
        ctx.fillStyle = "#94a3b8";
        ctx.strokeStyle = "#f43f5e";
        ctx.beginPath();
        ctx.moveTo(toolX - 6, toolY - 50);
        ctx.lineTo(toolX + 6, toolY - 50);
        ctx.lineTo(toolX + 2, toolY - 2);
        ctx.lineTo(toolX - 2, toolY - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Friction sparks element
        if (segments < 196) {
          ctx.fillStyle = "#fbbf24";
          for (let s = 0; s < 6; s++) {
            const rx = toolX + (Math.random() * 20 - 10);
            const ry = toolY + (Math.random() * 20 - 10);
            ctx.fillRect(rx, ry, 3, 3);
          }
        }
      } else if (activeLabTab === "robotics") {
        // Draw Dual Linkage Arm Kinematics
        const baseX = canvas.width / 2;
        const baseY = canvas.height - 30;

        const len1 = 70;
        const len2 = 55;

        // Radians from Degrees
        const r1 = (robotTheta1 * Math.PI) / 180;
        const r2 = ((robotTheta1 + robotTheta2) * Math.PI) / 180;

        const jointX = baseX + Math.sin(r1) * len1;
        const jointY = baseY - Math.cos(r1) * len1;

        const tipX = jointX + Math.sin(r2) * len2;
        const tipY = jointY - Math.cos(r2) * len2;

        // Base Pedestal
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(baseX - 25, baseY, 50, 20);
        ctx.fill();
        ctx.stroke();

        // Segment 1 (Shoulder to Elbow)
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(jointX, jointY);
        ctx.stroke();

        // Segment 2 (Elbow to Wrist)
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(jointX, jointY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Joint Nodes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(baseX, baseY, 6, 0, Math.PI * 2);
        ctx.arc(jointX, jointY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Robotic Gripper Claws holding active Payload
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tipX - 8, tipY);
        ctx.lineTo(tipX, tipY - 8);
        ctx.lineTo(tipX + 8, tipY);
        ctx.stroke();

        // Simulated heavy parcel block representing payload
        ctx.fillStyle = "rgba(16, 185, 129, 0.85)";
        ctx.fillRect(tipX - 12, tipY - 24, 24, 12);
        ctx.fillStyle = "#fff";
        ctx.font = "8px sans-serif";
        ctx.fillText(`${robotPayload}kg`, tipX - 10, tipY - 15);
      } else {
        // Fallback lab visualizations (Aero pressure charts or EV grids)
        ctx.fillStyle = "rgba(56, 189, 248, 0.05)";
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < canvas.width; i++) {
          const sy = (canvas.height / 2) + Math.sin(i * 0.03 + (localFrame * 0.05)) * 30 * Math.sin(localFrame * 0.01);
          if (i === 0) ctx.moveTo(i, sy);
          else ctx.lineTo(i, sy);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeLabTab, robotTheta1, robotTheta2, robotPayload, activeTab, selectedComp, renderMode, zoom, rotationX, rotationY, explodeFactor, isPlaying, rpm, cutSection]);

  // Handle live formula calculate changes
  const computedFormulaResult = () => {
    if (!activeFormula) return { result: 0, unit: "", stepByStep: "" };
    const inputsWithDefaults = { ...formulaInputs };
    activeFormula.inputs.forEach((input) => {
      if (inputsWithDefaults[input.key] === undefined || isNaN(inputsWithDefaults[input.key])) {
        inputsWithDefaults[input.key] = input.defaultValue;
      }
    });
    const calc = activeFormula.calculate(inputsWithDefaults);
    if (calc && isNaN(calc.result)) {
      calc.result = 0;
    }
    return calc;
  };

  // Formula inputs change handler
  const handleFormulaInputChange = (key: string, val: number) => {
    setFormulaInputs((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  // Filtered Component List for Search & Navigation Library
  const filteredComponents = COMPONENTS_DATABASE.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || comp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="min-h-screen bg-[#030712] text-slate-100 font-sans flex flex-col antialiased selection:bg-blue-500/30 selection:text-blue-200"
      id="mechvat-root-env"
    >
      {/* Dynamic Navigation Header */}
      <header className="border-b border-blue-900/40 bg-slate-950/75 backdrop-blur-md sticky top-0 z-50 px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Trademark Logo & MechVat Branding */}
          <div className="flex items-center gap-3">
            <TrademarkIcon size={46} glow={true} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-teal-400">
                  MECHVAT
                </span>
                <span className="text-[10px] bg-blue-600/30 border border-blue-400/40 px-1 py-0.5 rounded font-mono text-blue-400 tracking-widest uppercase">
                  TM
                </span>
              </div>
              <p className="text-[9.5px] text-sky-400/70 tracking-tight font-mono">
                PRECISION MULTIPHYSICS VISUALIZATION LAB
              </p>
            </div>
          </div>

          {/* Core Applet Scope Indicators (No unrequested sidebars or complex overlays) */}
          <nav className="flex flex-wrap items-center gap-1 md:gap-2 text-[11px] font-bold font-mono">
            {[
              { id: "cad-sandbox", label: "CAD Rig", sound: "metallic" },
              { id: "element-library", label: "Catalog", sound: "gear" },
              { id: "generative-copilot", label: "AI Co-Pilot", sound: "metallic" },
              { id: "formula-hub", label: "Formula Solver", sound: "hydraulic" },
              { id: "multiphysics-labs", label: "Labs", sound: "pneumatic" },
              { id: "career", label: "Roadmaps", sound: "metallic" }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  handleInteraction(tab.sound as any);
                }}
                className={`px-2.5 py-1.5 rounded transition-all border text-[10px] md:text-xs ${
                  activeTab === tab.id 
                    ? "bg-blue-600/10 border-blue-500/50 text-sky-400 font-extrabold" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                / {tab.label.toUpperCase()}
              </button>
            ))}
          </nav>

          {/* Sound Synthesizer Controller & Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newState = mechanicalAudio.toggleMute();
                setIsAudioMuted(newState);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                isAudioMuted 
                  ? "bg-red-950/30 border-red-800/40 text-red-400 hover:bg-red-900/40" 
                  : "bg-sky-950/30 border-sky-800/30 text-sky-400 hover:bg-sky-900/20"
              }`}
              title="Clicking activates custom synthesised mechanical sound signatures"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isAudioMuted ? "MUTED" : "SYNTH ON"}</span>
            </button>

            <span className="text-[10px] text-emerald-400 font-mono px-2 py-1 rounded bg-[#022c22]/60 border border-emerald-900/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PORTAL ENGAGED
            </span>
          </div>

        </div>
      </header>

      {/* Main Structural Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">

        {activeTab === "cad-sandbox" && (
          <>
            {/* Hero Section & Interactive CAD Workspace */}
            <section id="hero-viewport" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/30 border border-blue-950/50 p-4 md:p-6 rounded-2xl relative overflow-hidden">
          
          {/* CAD Workspace Header / Coordinates overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-sky-600" />
          
          {/* LEFT: Simulation Render Pipeline Viewport (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="flex items-center justify-between bg-slate-950/70 px-4 py-2 rounded-xl border border-blue-900/30">
              <div className="flex items-center gap-2">
                <Rotate3d size={16} className="text-blue-400 animate-spin-slow" />
                <span className="text-xs font-mono font-bold tracking-wider text-sky-300">
                  INTERACTIVE multiphysics workspace — CAD-V01
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setRenderMode("solid"); handleInteraction("metallic"); }} 
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${renderMode === "solid" ? "bg-blue-600/20 border-blue-400 text-blue-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                >
                  SOLID
                </button>
                <button 
                  onClick={() => { setRenderMode("wireframe"); handleInteraction("gear"); }} 
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${renderMode === "wireframe" ? "bg-blue-600/20 border-blue-400 text-blue-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                >
                  WIRE
                </button>
                <button 
                  onClick={() => { setRenderMode("xray"); handleInteraction("hydraulic"); }} 
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${renderMode === "xray" ? "bg-blue-600/20 border-blue-400 text-blue-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                >
                  X-RAY
                </button>
                <button 
                  onClick={() => { setRenderMode("thermal"); handleInteraction("pneumatic"); }} 
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${renderMode === "thermal" ? "bg-blue-600/20 border-blue-400 text-blue-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                >
                  THERMAL
                </button>
                <button 
                  onClick={() => { setRenderMode("cfd"); handleInteraction("hydraulic"); }} 
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${renderMode === "cfd" ? "bg-blue-600/20 border-blue-400 text-blue-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                >
                  CFD VEL
                </button>
              </div>
            </div>

            {/* High Performance CAD Simulation Canvas Container */}
            <div className="relative aspect-video bg-gradient-to-b from-slate-950 to-slate-900 border border-blue-950/60 rounded-xl overflow-hidden shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)] group">
              <canvas
                ref={simCanvasRef}
                width={800}
                height={450}
                className="w-full h-full block cursor-move"
                title="Use rotation / zoom sliders or click inside to simulate parts explosion"
              />

              {/* Isometric Rotation and Zoom overlay badges */}
              <div className="absolute right-4 bottom-4 flex flex-col gap-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-xs font-mono backdrop-blur-sm shadow-xl">
                <span className="text-[10px] text-sky-400 uppercase font-thin">Axile Projection Rotators</span>
                <div className="flex items-center gap-1.5">
                  <label className="w-6 text-slate-400">X-Rot:</label>
                  <input 
                    type="range" 
                    min="-90" 
                    max="90" 
                    value={rotationX}
                    onChange={(e) => setRotationX(Number(e.target.value))}
                    className="w-20 accent-blue-500 h-1"
                  />
                  <span>{rotationX}°</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="w-6 text-slate-400">Y-Rot:</label>
                  <input 
                    type="range" 
                    min="-180" 
                    max="180" 
                    value={rotationY}
                    onChange={(e) => setRotationY(Number(e.target.value))}
                    className="w-20 accent-blue-500 h-1"
                  />
                  <span>{rotationY}°</span>
                </div>
              </div>

              {/* Watermark Logo indicator */}
              <div className="absolute right-4 top-4 opacity-15 pointer-events-none">
                <TrademarkIcon size={120} glow={false} />
              </div>

              {/* Status badge */}
              <div className="absolute left-4 bottom-4 flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 border border-blue-900/30 rounded text-[9px] font-mono text-sky-300">
                <Activity size={10} className="text-emerald-400 animate-pulse" />
                <span>ACTIVE RIG MODE: {selectedComp.animationSpec.type.toUpperCase()}</span>
                <span>/</span>
                <span className="text-amber-400 font-bold">{explodeFactor > 0 ? "EXPLODED ASSEMBLING" : "COHERENT"}</span>
              </div>
            </div>

            {/* Simulation Adjustment Controls Dashboard Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/55 border border-blue-950/30 p-3.5 rounded-xl">
              
              {/* Play / Pause Toggle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Animation Engine</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      handleInteraction("hydraulic");
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                      isPlaying 
                        ? "bg-rose-950/30 border border-rose-800/40 text-rose-300" 
                        : "bg-teal-950/30 border border-teal-800/40 text-teal-300"
                    }`}
                  >
                    {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isPlaying ? "HALT" : "RUN"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setExplodeFactor(explodeFactor === 100 ? 0 : 100);
                      handleInteraction("metallic");
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-800 hover:border-sky-500/50 text-xs font-mono transition-all"
                    title="Toggle immediate full exploded view assembly"
                  >
                    💥 EXPLODE
                  </button>
                </div>
              </div>

              {/* Speed Slider (RPM) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Engine Speed</span>
                  <span className="text-sky-300 font-bold">{rpm} RPM</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4000" 
                  step="200" 
                  value={rpm} 
                  onChange={(e) => {
                    setRpm(Number(e.target.value));
                    setIsPlaying(Number(e.target.value) > 0);
                  }}
                  className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Exploded View Factor */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Explosion Factor</span>
                  <span className="text-amber-400 font-bold">{explodeFactor}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={explodeFactor} 
                  onChange={(e) => setExplodeFactor(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Cross Section Slider */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">CAD Visualization Mods</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCutSection(!cutSection);
                      handleInteraction("pneumatic");
                    }}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-mono border transition-all ${
                      cutSection 
                        ? "bg-red-950/20 border-red-800 text-red-300" 
                        : "border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {cutSection ? "✖ CLOSE SECTION C-C" : "📐 CUT SECTION C-C"}
                  </button>
                  <button
                    onClick={() => {
                      setZoom(zoom === 1 ? 1.5 : zoom === 1.5 ? 0.75 : 1);
                      handleInteraction("metallic");
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-800 hover:border-slate-700 text-xs font-mono"
                    title="Scale magnification cycle"
                  >
                    Magnify: {zoom}x
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: Active Selected Component Specs & Actions Panel (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Component Metadata Sheet */}
            <div className="bg-slate-900/60 border border-blue-950/40 p-4 rounded-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[9.5px] font-mono bg-blue-900/40 border border-blue-700/30 text-sky-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedComp.category} subsystem
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">ID: {selectedComp.id}</span>
                </div>
                
                <h3 className="text-xl font-bold bg-gradient-to-r from-sky-200 to-sky-400 bg-clip-text text-transparent mb-2.5">
                  {selectedComp.name}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {selectedComp.description}
                </p>

                {/* Micro Blueprint Specs */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/60 mb-4">
                  <div className="text-[10px] uppercase font-mono text-cyan-400/80 mb-2 font-bold tracking-wider">
                    Technical Specifications
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs font-mono">
                    {selectedComp.keySpecs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-slate-400">{spec.label}:</span>
                        <span className="text-sky-300 font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic components materials details */}
                <div className="mb-4">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold block mb-1.5">
                    Alloy Composition Spec
                  </span>
                  <ul className="text-xs text-slate-300 flex flex-col gap-1 list-disc pl-4 font-mono">
                    {selectedComp.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Active Subsystem Interactive Buttons */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-800">
                <button
                  onClick={askTutorForActiveComp}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(14,165,233,0.3)]"
                >
                  <Cpu size={14} className={aiLoading ? "animate-spin" : ""} />
                  {aiLoading ? "SECURING KINEMATIC REPORT..." : "RUN AI METALLURGICAL REPORT"}
                </button>
                <p className="text-[10px] text-slate-500 font-mono text-center">
                  Requests thermodynamic derivations and materials tests using Gemini.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* AI Engineering Tutor Output Container (Visible only when generating or structured report exists) */}
        {(aiLoading || aiResponse) && (
          <section className="bg-slate-950/80 border border-sky-900/40 p-5 rounded-2xl relative shadow-2xl">
            <div className="absolute top-2 right-4 text-[9px] text-sky-400 font-mono bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
              MECHVAT AI TURBO MODULE — GEMINI PRO ACTIVE
            </div>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                <Wrench size={16} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-sky-200 uppercase font-mono">
                  Live AI Metallurgical & Stress Diagnostics Report
                </h4>
                <p className="text-[10.5px] text-slate-400">
                  Dynamic analysis of microstructural behaviors, design fatigue margins, and industrial calculations.
                </p>
              </div>
            </div>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 font-mono">
                <RefreshCw size={24} className="animate-spin text-sky-500" />
                <span className="text-xs text-sky-300">Evaluating thermal cycles, fatigue boundaries, and principal shear streses...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 font-sans space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {/* Parse Markdown segments dynamically to render beautifully styled boxes */}
                {aiResponse.split("\n").map((line, idx) => {
                  if (line.startsWith("###")) {
                    return (
                      <h5 key={idx} className="text-sm font-bold text-sky-300 mt-4 border-l-2 border-sky-400 pl-2 uppercase font-mono">
                        {line.replace("###", "").trim()}
                      </h5>
                    );
                  }
                  if (line.startsWith("##")) {
                    return (
                      <h4 key={idx} className="text-base font-black text-teal-300 mt-5 font-mono">
                        {line.replace("##", "").trim()}
                      </h4>
                    );
                  }
                  if (line.startsWith("-") || line.startsWith("*")) {
                    return (
                      <li key={idx} className="ml-4 list-disc text-slate-300">
                        {line.substring(1).trim()}
                      </li>
                    );
                  }
                  return <p key={idx} className="text-slate-300 pl-1">{line}</p>;
                })}
              </div>
            )}
          </section>
        )}
        </>
      )}

      {/* Global Component Library Database Tab */}
      {activeTab === "element-library" && (
        <section id="library-database" className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <Compass size={22} className="text-blue-500" />
                Global Elements Library & CAD Database
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select elements instantly to load them into the functional 3D testing rig above.
              </p>
            </div>

            {/* Powerful Search Bar */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-full md:w-80 shadow-md">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search element database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-xs text-slate-200 outline-none w-full"
              />
            </div>
          </div>

          {/* Filtering Categories Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "ALL DISCIPLINES" },
              { id: "mechanical", label: "⚙️ GENERAL MECHANICAL COMPONENTS" },
              { id: "aerospace", label: "🚀 AEROSPACE & PROPULSION" },
              { id: "automobile", label: "🏎️ AUTOMOBILE MECHANICALS" },
              { id: "ev", label: "🔋 ELECTRIC VEHICLES (EV)" },
              { id: "manufacturing", label: "🛠️ INDUSTRIAL SMART MANUFACTURING" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.id);
                  handleInteraction("gear");
                }}
                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono border transition-all ${
                  categoryFilter === cat.id 
                    ? "bg-blue-600/20 border-blue-400 text-blue-300" 
                    : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid list of Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComponents.map((comp) => (
              <div 
                key={comp.id}
                onClick={() => {
                  setSelectedComp(comp);
                  handleInteraction("metallic");
                }}
                className={`group border p-4 rounded-xl cursor-pointer transition-all ${
                  selectedComp.id === comp.id 
                    ? "bg-[#0b1329] border-blue-500 shadow-[0_4px_25px_rgba(37,99,235,0.15)]" 
                    : "bg-[#090d16] border-slate-900 hover:border-slate-800 hover:bg-[#0d1525]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/30">
                    {comp.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-blue-300 transition-colors">
                    RIG ENABLED ➔
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  {comp.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {comp.description}
                </p>

                {/* Mini spec pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {comp.keySpecs.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[9.5px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md">
                      {s.label}: {s.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {filteredComponents.length === 0 && (
              <div className="col-span-full text-center py-12 border border-slate-900 rounded-xl bg-slate-950/20">
                <p className="text-xs font-mono text-slate-500">No matching engineering components found in the sub-database.</p>
              </div>
            )}
          </div>

          {/* Active selection Call-To-Action Bridge */}
          <div className="mt-6 p-4 bg-slate-900/40 border border-blue-900/35 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Rotate3d size={18} className="animate-pulse" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-sky-200">Loaded Subsystem: <span className="text-emerald-400 font-bold">{selectedComp.name}</span></h5>
                <p className="text-[11px] text-slate-400 font-mono">This alloy structure is currently active isometrically.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab("cad-sandbox");
                handleInteraction("metallic");
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs font-mono tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-[0_2px_15px_rgba(14,165,233,0.2)] whitespace-nowrap cursor-pointer"
            >
              🚀 VIEW METALLICS IN KINEMATIC RIG ➔
            </button>
          </div>
        </section>
      )}

      {/* AI Generative Spec Sheet Co-Pilot Tab */}
      {activeTab === "generative-copilot" && (
        <section className="bg-gradient-to-r from-blue-950/30 to-slate-950 border border-blue-900/30 p-5 rounded-2xl relative">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span className="text-[10.5px] font-mono text-sky-400 tracking-wider font-bold">MECHVAT CAD CO-PILOT MODULE v2.0</span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench size={20} className="text-sky-400" />
                AI Generative Element Specification Engine
              </h2>
              <p className="text-xs text-slate-400 leading-snug">
                Instruct the AI CAD generator with target requirements (payloads, speeds, motor characteristics) to compute formulas, materials, assembly rules, and safety factors.
              </p>
            </div>
            
            {/* Direct prompt suggestion list */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Dual stage worm speed reducer",
                "Carbon carbon brake disk block",
                "Rotor hub for heavy-lift hexacopter"
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setGenQuery(p); handleInteraction("metallic"); }}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/30 text-[10px] font-mono text-slate-400 hover:text-sky-300 transition-all"
                >
                  / {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Input form */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/40">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">
                  Custom Generation Prompt
                </label>
                <textarea
                  rows={3}
                  value={genQuery}
                  onChange={(e) => setGenQuery(e.target.value)}
                  className="w-full bg-[#050811] text-slate-200 border border-slate-800/80 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
                  placeholder="e.g. Design parameters for a high pressure aircraft fuel injection pump with dynamic load capacity of 40kN..."
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={submitDesignGeneration}
                  disabled={genLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Send size={12} className={genLoading ? "animate-spin" : ""} />
                  {genLoading ? "CALCULATING MASS & LOADS..." : "GENERATE COMPLETED CAD SCHEMATIC SPEC SHEET"}
                </button>
              </div>
            </div>

            {/* Generated Design Result Output */}
            <div className="md:col-span-7 bg-[#040813] border border-blue-900/30 p-4 rounded-xl flex flex-col justify-center min-h-[160px]">
              {genLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 font-mono text-xs">
                  <RefreshCw className="animate-spin text-blue-400" size={20} />
                  <span className="text-slate-400">Iterating design boundaries...</span>
                  <span className="text-[10px] text-slate-500">Integrating continuous beam strain and Soderberg life limits</span>
                </div>
              ) : generatedDesign ? (
                <div className="text-xs space-y-3">
                  <div className="flex justify-between items-center bg-blue-950/40 p-2 border border-blue-900/30 rounded">
                    <div>
                      <span className="text-[8.5px] font-mono text-cyan-400 font-bold block">GENERATED DESIGN MODEL</span>
                      <h5 className="font-bold text-white text-sm">{generatedDesign.name}</h5>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-400 block">MASS VALUE</span>
                      <span className="text-rose-400 font-bold">{generatedDesign.massKg} kg</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 block mb-1">DIMENSION SPECS</span>
                      <div className="text-slate-300">
                        L: {generatedDesign.dimensions?.length || "N/A"} | W: {generatedDesign.dimensions?.width || "N/A"} | H: {generatedDesign.dimensions?.height || "N/A"}
                      </div>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 block mb-1">ESTIMATED COMPONENT COST</span>
                      <div className="text-emerald-400 font-bold">${generatedDesign.estimatedCostUSD} USD</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800">
                    <span className="text-[9.5px] text-slate-400 uppercase font-mono tracking-wider block mb-1.5 font-bold">
                      Calculated Mechanical Limits
                    </span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[10.5px]">
                      {generatedDesign.specifications?.map((spec: any, idx: number) => (
                        <div key={idx} className="flex justify-between border-b border-slate-800 pb-0.5">
                          <span className="text-slate-400">{spec.label}:</span>
                          <span className="text-sky-300 font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-mono tracking-wider block mb-1 font-bold">
                      Design Verification Analysis
                    </span>
                    <p className="text-sky-200/95 font-mono leading-relaxed bg-slate-950/80 p-2 rounded border border-slate-800">
                      {generatedDesign.mathematicalVerification}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono gap-1">
                  <Sliders size={20} className="text-slate-700" />
                  <p className="text-[11px]">Specification sheet output offline.</p>
                  <p className="text-[9.5px] text-slate-600">Provide an element specification prompt above to execute live calculations.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Formula Hub Solver Section */}
      {activeTab === "formula-hub" && (
        <section id="formula-hub" className="bg-[#050914] border border-blue-950 p-5 rounded-2xl">
          
          <div className="border-b border-slate-800 pb-4 mb-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator size={20} className="text-teal-400" />
              Interactive Engineering Formula Hub
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Input variables using range controls to observe real-time step-by-step mathematical derivations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Select Formula (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {FORMULAS_DATABASE.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFormula(f);
                    handleInteraction("metallic");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeFormula.id === f.id 
                      ? "bg-slate-900 border-teal-500 text-teal-300" 
                      : "bg-[#090d16]/40 border-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500 mb-1">{f.domain}</div>
                  <h4 className="text-xs font-bold leading-tight uppercase font-mono">{f.name}</h4>
                  <div className="text-xs font-mono mt-1 text-sky-400 font-bold">{f.formulaStr}</div>
                </button>
              ))}
            </div>

            {/* MIDDLE: Slider Variables Controls (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-3 font-bold">
                  Dials & Control Sliders
                </span>
                
                <div className="flex flex-col gap-4">
                  {activeFormula.inputs.map((input) => (
                    <div key={input.key} className="flex flex-col gap-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{input.name}:</span>
                        <span className="text-sky-300 font-bold">
                          {formulaInputs[input.key] !== undefined ? formulaInputs[input.key] : input.defaultValue} {input.unit}
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={input.min}
                        max={input.max}
                        step={(input.max - input.min) / 100}
                        value={formulaInputs[input.key] !== undefined ? formulaInputs[input.key] : input.defaultValue}
                        onChange={(e) => handleFormulaInputChange(input.key, Number(e.target.value))}
                        className="w-full accent-teal-400 h-1 bg-slate-800 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] font-mono leading-relaxed mt-4">
                <span className="text-slate-400 font-bold block mb-1">Theoretical Derivation:</span>
                <p className="text-slate-300 text-xs">{activeFormula.derivation}</p>
              </div>
            </div>

            {/* RIGHT: Live Math Result Output & Step-by-Step Proof (4 cols) */}
            <div className="lg:col-span-4 bg-teal-950/10 border border-teal-900/30 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-4 font-bold">
                  Mathematical Result & Verification
                </span>

                <div className="text-center py-6 bg-slate-950/60 border border-slate-800 rounded-xl mb-4 shadow-lg">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">CALCULATED VALUE</span>
                  <div className="text-3xl font-black text-emerald-400 tracking-tight font-mono">
                    {computedFormulaResult().result}
                  </div>
                  <span className="text-xs font-mono text-emerald-500 font-bold uppercase tracking-wider block mt-1">
                    {computedFormulaResult().unit}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Execution Log & Formula Expansion
                  </span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-[10.5px] font-mono text-sky-200 leading-relaxed max-h-[140px] overflow-y-auto">
                    {computedFormulaResult().stepByStep.split("\n").map((step, i) => (
                      <p key={i} className="mb-1 border-b border-slate-900 pb-1 last:border-0">{step}</p>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-mono text-center mt-3 leading-tight">
                Formulas correspond explicitly to ASME and ISO code recommendations for load factors.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* Specialty Simulation Labs Tab */}
      {activeTab === "multiphysics-labs" && (
        <section id="specialty-labs" className="bg-[#030610] border border-blue-900/30 p-4 md:p-5 rounded-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3.5 mb-5 animate-pulse">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-rose-500" />
                Specialty Multiphysics Engineering Labs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle between different sandbox frameworks to test aerodynamics, powertrain ratios, and robotics.
              </p>
            </div>

            {/* Selector tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "aero", label: "✈️ AERODYNAMICS LAB" },
                { id: "auto", label: "🏎️ AUTOMOBILE SHAFT & SLIDES" },
                { id: "ev", label: "🔋 MOTOR STATORS (EV)" },
                { id: "manufacture", label: "🛠️ CNC / PRINT MACHINE" },
                { id: "robotics", label: "🦾 ROBOT ARMS KINEMATICS" }
              ].map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => {
                    setActiveLabTab(lab.id as any);
                    handleInteraction("hydraulic");
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                    activeLabTab === lab.id 
                      ? "bg-rose-950/40 border-rose-600 text-rose-300" 
                      : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300"
                  }`}
                >
                  {lab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Sandbox Control panels (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              
              {/* Box container */}
              <div className="bg-slate-950/80 p-4 border border-slate-800/60 rounded-xl space-y-4">
                
                {activeLabTab === "aero" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">
                      Aerodynamic Wind Tunnel Parameters
                    </span>

                    <div className="space-y-3">
                      <div className="flex flex-col gap-1 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Wind Velocity:</span>
                          <span className="text-emerald-400 font-bold">{airfoilSpeed} km/h</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="900" 
                          value={airfoilSpeed} 
                          onChange={(e) => setAirfoilSpeed(Number(e.target.value))}
                          className="w-full accent-rose-500 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="flex flex-col gap-1 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Angle of Attack (α):</span>
                          <span className="text-rose-400 font-bold">{angleOfAttack}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="-10" 
                          max="25" 
                          value={angleOfAttack} 
                          onChange={(e) => setAngleOfAttack(Number(e.target.value))}
                          className="w-full accent-rose-500 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="flex flex-col gap-2 font-mono text-xs">
                        <span className="text-slate-400">Airfoil Profile Geometry:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {["naca0012", "supercritical", "high-lift"].map((shape) => (
                            <button
                              key={shape}
                              onClick={() => { setAirfoilShape(shape as any); handleInteraction("pneumatic"); }}
                              className={`px-2 py-1 rounded text-[10px] border ${
                                airfoilShape === shape 
                                  ? "bg-rose-950/20 border-rose-500 text-rose-300" 
                                  : "border-slate-850 bg-slate-900 text-slate-400"
                              }`}
                            >
                              {shape.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80 font-mono text-xs text-sky-300">
                      <div>Calculated Lift: <strong className="text-emerald-400">{(airfoilSpeed * 0.08 * (angleOfAttack + 2)).toFixed(1)} kN</strong></div>
                      <div>Calculated Induced Drag: <strong className="text-rose-400">{(0.0055 * airfoilSpeed * (angleOfAttack * angleOfAttack + 1.2)).toFixed(2)} kN</strong></div>
                    </div>
                  </div>
                )}

                {activeLabTab === "auto" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      automobile Powertrain Configuration
                    </span>

                    <div className="space-y-4">
                      {/* Clutch Toggle */}
                      <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800/60 pb-2">
                        <span className="text-slate-400">Clutch Engagement:</span>
                        <button
                          onClick={() => { setClutchEngaged(!clutchEngaged); handleInteraction("hydraulic"); }}
                          className={`px-3 py-1 rounded text-[10px] border ${
                            clutchEngaged 
                              ? "bg-emerald-950/30 border-emerald-800 text-emerald-300" 
                              : "bg-red-950/30 border-red-800 text-red-300"
                          }`}
                        >
                          {clutchEngaged ? "ENGAGED (SOLID LOCK)" : "DISENGAGED"}
                        </button>
                      </div>

                      {/* Transimission Gears Shift selector */}
                      <div className="space-y-2 font-mono text-xs">
                        <span className="text-slate-300 block">Manual Shifter (Gear Ratio Selection):</span>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((g) => (
                            <button
                              key={g}
                              onClick={() => { setCurrentAutoGear(g); handleInteraction("gear"); }}
                              className={`py-1.5 rounded font-bold border transition-all ${
                                currentAutoGear === g 
                                  ? "bg-sky-950 border-sky-400 text-sky-200" 
                                  : "border-slate-800 text-slate-400 hover:bg-slate-900"
                              }`}
                            >
                              G-{g}
                            </button>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Active Ratio Multiplier: <strong className="text-sky-300 font-bold">{(4.2 - currentAutoGear * 0.7).toFixed(2)}:1</strong>
                        </div>
                      </div>

                      {/* Brake Slider */}
                      <div className="space-y-1 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Braking Load Pressure:</span>
                          <span className={`${brakeApplied ? "text-amber-400" : "text-slate-500"} font-bold`}>
                            {brakeApplied ? "ABS TRIPPED" : "NOMINAL"}
                          </span>
                        </div>
                        <button
                          onMouseDown={() => { setBrakeApplied(true); setBrakeTemp(280); handleInteraction("pneumatic"); }}
                          onMouseUp={() => { setBrakeApplied(false); setBrakeTemp(90); }}
                          className={`w-full py-2.5 rounded font-bold text-xs uppercase border transition-all ${
                            brakeApplied 
                              ? "bg-amber-950/30 border-amber-600 text-amber-300" 
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                          }`}
                        >
                          HOLD TO ENGAGE FULL ABS SYSTEM DISC APPLICATORS
                        </button>
                        <div className="text-[9px] text-slate-500 text-center">Brake pad heat estimation: {brakeTemp}°C</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeLabTab === "ev" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block font-bold">
                      Electric Propulsion System Lab
                    </span>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Battery Charge Limit (SoC):</span>
                          <span className="text-teal-400 font-bold">{evBatterySoc}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={evBatterySoc} 
                          onChange={(e) => setEvBatterySoc(Number(e.target.value))}
                          className="w-full accent-teal-400 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Stator Magnetic Flux offset:</span>
                          <span className="text-sky-300 font-bold">{evMotorMagneticAngle} Degrees</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="360" 
                          step="15"
                          value={evMotorMagneticAngle} 
                          onChange={(e) => setEvMotorMagneticAngle(Number(e.target.value))}
                          className="w-full accent-sky-400 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                        <span className="text-[9px] text-teal-400 font-bold block uppercase">BMS active telemetry</span>
                        <div className="text-[11px] text-slate-300">Thermal Gradient Peak: <strong className="text-emerald-400">32.8 °C</strong></div>
                        <div className="text-[11px] text-slate-300">Coolant Flow Velocity: <strong className="text-emerald-400">1.8 Liters/min</strong></div>
                        <div className="text-[11px] text-slate-400">BMS Code: {bmsStatus}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeLabTab === "manufacture" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                      Smart Machining parameters
                    </span>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400 mb-1">Milling Path Contour selection:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {["pocket", "contour", "carving"].map((p) => (
                            <button
                              key={p}
                              onClick={() => { setCncPathOption(p as any); handleInteraction("metallic"); }}
                              className={`px-1.5 py-1 rounded text-[10px] border tracking-wider uppercase font-bold ${
                                cncPathOption === p 
                                  ? "bg-amber-950/20 border-amber-500 text-amber-300" 
                                  : "border-slate-800 bg-slate-900 text-slate-500"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Printer Layer Slice index:</span>
                          <span className="text-sky-300 font-bold">{printerLayer} / 450</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="450" 
                          value={printerLayer} 
                          onChange={(e) => setPrinterLayer(Number(e.target.value))}
                          className="w-full accent-blue-500 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                        <div>Material to mill: <strong className="text-yellow-500 font-bold">ALUMINUM 6061-T6</strong></div>
                        <div>Milling Spindle speed: <strong className="text-slate-100">18,000 RPM</strong></div>
                        <div>Calculated slicing thickness: <strong className="text-slate-100">0.2 mm</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeLabTab === "robotics" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">
                      Joint arm Linkages & Payload
                    </span>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Shoulder Joint (θ1 Angle):</span>
                          <span className="text-purple-400 font-bold">{robotTheta1}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="180" 
                          value={robotTheta1} 
                          onChange={(e) => setRobotTheta1(Number(e.target.value))}
                          className="w-full accent-purple-500 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Elbow Joint (θ2 Angle):</span>
                          <span className="text-fuchsia-400 font-bold">{robotTheta2}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="-90" 
                          max="120" 
                          value={robotTheta2} 
                          onChange={(e) => setRobotTheta2(Number(e.target.value))}
                          className="w-full accent-purple-500 h-1 bg-slate-800"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Payload Weight mass:</span>
                          <span className="text-emerald-400 font-bold">{robotPayload} kg</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="12" 
                          step="0.5"
                          value={robotPayload} 
                          onChange={(e) => setRobotPayload(Number(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Lab advise message */}
              <p className="text-[10px] text-slate-500 font-mono mt-3 leading-tight uppercase font-bold text-center">
                ➔ Workspace aligns with actual SOLIDWORKS & fusion-360 API physics parameters.
              </p>

            </div>

            {/* RIGHT: Realtime Projected Sandbox Visualizer (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-mono bg-slate-950 p-2 rounded-t-xl border-t border-x border-slate-800">
                <span className="text-slate-300 uppercase">Live Oscillating Vector Trace</span>
                <span className="text-emerald-400 animate-pulse">● SAMPLING ACTIVE AT 60FPS</span>
              </div>
              <div className="relative aspect-[16/10] bg-slate-950 rounded-b-xl border border-slate-800 overflow-hidden shadow-2xl">
                <canvas 
                  ref={printCanvasRef} 
                  className="w-full h-full block" 
                  width={600} 
                  height={350} 
                />
                
                {/* Visual contour legend floating boxes */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 bg-slate-950/80 p-2.5 rounded border border-slate-800 text-[10px] font-mono">
                  {activeLabTab === "aero" && (
                    <>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> High velocity (Lift)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Medium Friction</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Wake Drag Turbulence</div>
                    </>
                  )}
                  {activeLabTab === "auto" && (
                    <>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Fluid Torque Pressure</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Thermal limits</div>
                    </>
                  )}
                  {activeLabTab === "ev" && (
                    <>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal-500" /> Balancing cells</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-500" /> Stator electromagnetics</div>
                    </>
                  )}
                  {activeLabTab === "manufacture" && (
                    <>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-lime-500" /> Toolpath array</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Heat deformation</div>
                    </>
                  )}
                  {activeLabTab === "robotics" && (
                    <>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Lever moment linkages</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Payload weight</div>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Global Design Teams AR & VR Room Simulation */}
      {activeTab === "cad-sandbox" && (
        <section className="bg-slate-950/20 border border-slate-900 p-5 rounded-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <Users size={16} className="text-purple-400" />
                GLOBAL TEAM COLLABORATIVE VR DISCIPLINE CORRIDOR
              </h3>
              <p className="text-xs text-slate-400 leading-tight">
                Simulated live headset linkage enabling cross-border design team assembly diagnostics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/40 border border-purple-800 text-purple-300">
                AR DEPOT ACTIVE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#032e1a] border border-[#065f32] text-emerald-300 animate-pulse">
                VR MODE: ON
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850/80">
              <div className="text-slate-400 font-bold uppercase tracking-wider mb-2 font-sans">Active Sandbox room</div>
              <div className="text-base font-black text-white">{activeDesignRoom}</div>
              <div className="text-[10px] text-slate-500 mt-2">Triggered via Munich high-speed optic lines.</div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                  onClick={() => { setActiveDesignRoom("Turbine rotor stress sync"); handleInteraction("pneumatic"); }}
                  className="px-2 py-1 bg-slate-950 border border-slate-850 hover:border-slate-750 text-[10px] text-slate-300 rounded"
                >
                  Turbine Sync
                </button>
                <button 
                  onClick={() => { setActiveDesignRoom("Aerofoil thermal dissipation room"); handleInteraction("hydraulic"); }}
                  className="px-2 py-1 bg-slate-950 border border-slate-850 hover:border-slate-750 text-[10px] text-slate-300 rounded"
                >
                  Dissipation Sync
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850/80">
              <div className="text-slate-400 font-bold uppercase tracking-wider mb-2 font-sans">Active Teammate feeds</div>
              <div className="flex flex-col gap-2">
                {vrUsers.map((user, i) => (
                  <div key={i} className="flex items-center gap-2 justify-between border-b border-slate-950 pb-1">
                    <span className="text-sky-300">● {user}</span>
                    <span className="text-[9px] px-1 py-0.5 bg-emerald-900/10 text-emerald-400 font-bold rounded">HEADSET LOCKED</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850/80 flex flex-col justify-between">
              <div>
                <div className="text-slate-400 font-bold uppercase tracking-wider mb-2 font-sans">VR AR device deployment</div>
                <p className="text-slate-400 text-xs leading-normal">
                  You can deploy MechVat elements anywhere using portable LiDAR links, allowing 1:1 tactile engineering measurements.
                </p>
              </div>
              <button 
                onClick={() => { alert("Tactile LiDAR projection coordinates sent to mobile. Ensure MechVat companion app has camera access."); handleInteraction("metallic"); }}
                className="w-full bg-[#1e293b] hover:bg-slate-800 text-sky-400 font-bold py-1.5 rounded border border-sky-900/50 text-[11px] transition-all"
              >
                PROJECTIONS LINK GO ➔
              </button>
            </div>
          </div>

        </section>
      )}

      {/* Career Discipline Milestones Roadmaps Tab */}
      {activeTab === "career" && (
        <section id="career-guidance" className="bg-[#040815] border border-blue-950/40 p-5 rounded-2xl">
          
          <div className="border-b border-indigo-950 pb-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookmarkCheck size={20} className="text-indigo-400" />
                Professional Engineering Career & CAD Specialization Roadmap
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Navigate pathways designed for next-generation automated robotics, EV propulsion plants, and complex aerospace blueprints.
              </p>
            </div>

            <div className="flex gap-2">
              {[
                { id: "mechanical", label: "⚙️ GENERAL MECHANICAL PATHWAYS" },
                { id: "aerospace", label: "🚀 JET PROPULSION / AERO PATHWAYS" },
                { id: "ev", label: "🔋 VEHICLE ELECTRICITY DISCIPLINE" }
              ].map((rm) => (
                <button
                  key={rm.id}
                  onClick={() => { setActiveRoadmap(rm.id as any); handleInteraction("gear"); }}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold border transition-all ${
                    activeRoadmap === rm.id 
                      ? "bg-indigo-950 text-indigo-300 border-indigo-500" 
                      : "border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  {rm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Path Node Pipeline flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROADMAPS_DATABASE[activeRoadmap].map((node, i) => (
              <div key={node.id} className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl relative">
                
                {/* Node counter bubble */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-900/30 border border-indigo-500/40 text-[11px] font-mono text-indigo-300 font-bold flex items-center justify-center">
                  0{i + 1}
                </div>

                <span className="text-[9.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                  STAGE DISCIPLINE v0{node.id}
                </span>

                <h4 className="text-sm font-bold text-white mb-2 leading-tight pr-6">
                  {node.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {node.description}
                </p>

                {/* Milestones list */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 mb-3 space-y-1.5 font-mono text-[10.5px]">
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Competency Milestones</span>
                  {node.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✔</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[10.5px] font-mono">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Recommended CAD Suite:</span>
                  <div className="text-indigo-300">{node.recommendedCAD.join(", ")}</div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      </main>

      {/* Solid footer with B.tech credential watermark explicitly requested */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 mt-12 text-slate-400 font-mono text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Trademark & Platform summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrademarkIcon size={36} glow={true} />
              <span className="font-bold text-white tracking-widest text-[#00f0ff]">MECHVAT</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Developed as a premier simulation dashboard and interactive mechanical explorer for students and global CAD research groups.
            </p>
          </div>

          {/* Micro calculations metrics */}
          <div className="space-y-1 text-slate-500 font-sans text-xs">
            <span className="block text-[10.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">SYSTEM METRICS</span>
            <div>Core WebGL Projection Engines: <strong className="text-slate-400 font-mono">60fps Dynamic Canvas 2D3D</strong></div>
            <div>Database Elements count: <strong className="text-slate-400 font-mono">15+ Master CAD Elements</strong></div>
            <div>Integration Level: <strong className="text-slate-400 font-mono">Express / Gemini-3.5-Flash Proxy</strong></div>
          </div>

          {/* Harsh Vardhan B.tech mechanical watermark explicitly requested */}
          <div className="flex flex-col justify-between items-start md:items-end p-4 rounded-xl border border-blue-950/50 bg-[#060b18]/55 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5">
              <TrademarkIcon size={140} glow={false} />
            </div>
            <div className="text-left md:text-right space-y-1">
              <div className="text-[9px] text-[#00f0ff] uppercase tracking-widest font-black font-mono">
                PLATFORM INVENTOR / DESIGN ARCHITECT
              </div>
              <h5 className="font-black text-white text-base">
                Harsh Vardhan
              </h5>
              <p className="text-[11px] text-sky-400 uppercase font-mono tracking-tight font-bold">
                B.Tech in Mechanical Engineering
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wide">
                RGIPT, Jais
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900/80 pt-6 mt-6 flex flex-col md:flex-row justify-between text-[11px] text-slate-600">
          <p>© 2026 MECHVAT Multiphysics Visual Labs. Custom synthesised industrial sounds integrated. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-sky-400/50">Engineered for extreme performance envelopes.</p>
        </div>
      </footer>
    </div>
  );
}
