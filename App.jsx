import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Sparkles,
  Cpu,
  Layers,
  Stethoscope,
  Play,
  Cloud,
  Activity,
  BarChart as BarIcon,
  ShieldCheck,
  HeartPulse,
  Zap,
  TrendingUp,
  AlertTriangle,
  Clock3,
  FileText,
  UserCircle,
  Eye,
  Share2,
} from "lucide-react";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const firstNames = [
  "Riya", "Asha", "Nisha", "Kavya", "Maya",
  "Aarav", "Rohan", "Kiran", "Vikram", "Dev",
  "Leela", "Nina", "Anita", "Priya", "Sara",
  "Ajay", "Rakesh", "Sunil", "Vijay", "Kunal",
];
const lastNames = [
  "Sharma", "Patel", "Reddy", "Nair", "Verma",
  "Singh", "Iyer", "Khan", "Gupta", "Joshi",
  "Kaur", "Bose", "Mehta", "Chopra", "Rao",
];
const apoeOptions = ["Non-carrier", "ε3/ε4", "ε4 Carrier", "ε4/ε4"];
const stageOptions = ["Normal", "Subjective Decline", "MCI", "Early AD", "Moderate AD"];
const mriFindingsOptions = [
  "Hippocampal atrophy", "Temporal lobe thinning",
  "Ventricular enlargement", "Parietal hypometabolism",
  "Diffuse cortical atrophy", "Posterior cingulate signal",
];

const randomBetween = (min, max) => Math.round(min + Math.random() * (max - min));
const randomChoice = (list) => list[Math.floor(Math.random() * list.length)];
const weightedChoice = (items) => {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let pick = Math.random() * total;
  for (const item of items) {
    if (pick < item.weight) return item.value;
    pick -= item.weight;
  }
  return items[items.length - 1].value;
};

const generatePatients = (count = 1500) => {
  return Array.from({ length: count }, (_, index) => {
    const id = `PT-AD-${String(index + 1).padStart(4, "0")}`;
    const sex = Math.random() > 0.48 ? "Female" : "Male";
    const age = randomBetween(55, 90);
    const apoe = weightedChoice([
      { value: "Non-carrier", weight: 40 },
      { value: "ε3/ε4", weight: 35 },
      { value: "ε4 Carrier", weight: 20 },
      { value: "ε4/ε4", weight: 5 },
    ]);
    const stage = weightedChoice([
      { value: "Normal", weight: 20 },
      { value: "Subjective Decline", weight: 25 },
      { value: "MCI", weight: 25 },
      { value: "Early AD", weight: 20 },
      { value: "Moderate AD", weight: 10 },
    ]);

    const memory = randomBetween(45, 95);
    const sleep = randomBetween(38, 92);
    const activity = randomBetween(20, 90);
    const diet = randomBetween(45, 96);
    const social = randomBetween(22, 88);
    const stress = randomBetween(18, 92);
    const loneliness = randomBetween(12, 82);
    const isolation = randomBetween(10, 78);
    const depression = randomBetween(5, 80);
    const support = randomBetween(15, 88);

    const cognitiveRisk = clamp(100 - memory + randomBetween(-8, 8), 10, 95);
    const lifestyleRisk = clamp(100 - ((sleep + activity + social) / 3) + randomBetween(-10, 10), 10, 95);
    const psychosocialRisk = clamp((stress * 0.35) + (loneliness * 0.2) + (depression * 0.25) + (isolation * 0.2) + randomBetween(-8, 8), 12, 95);
    const geneticRisk = apoe === "ε4/ε4" ? randomBetween(75, 95) : apoe === "ε4 Carrier" ? randomBetween(60, 85) : apoe === "ε3/ε4" ? randomBetween(45, 70) : randomBetween(15, 40);
    const mriRisk = clamp((stageOptions.indexOf(stage) + 1) * 16 + randomBetween(-12, 14), 15, 95);
    const finalRisk = Math.round(clamp((mriRisk * 0.34) + (psychosocialRisk * 0.26) + (cognitiveRisk * 0.2) + (geneticRisk * 0.14) + (lifestyleRisk * 0.06), 10, 99));

    return {
      id,
      name: `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
      age,
      sex,
      apoe,
      stage,
      baseline: {
        mmse: randomBetween(20, 30),
        education: randomBetween(6, 18),
      },
      memory,
      sleep,
      activity,
      diet,
      social,
      stress,
      loneliness,
      isolation,
      depression,
      support,
      mriRisk,
      psychosocialRisk,
      cognitiveRisk,
      geneticRisk,
      lifestyleRisk,
      finalRisk,
      riskCategory:
        finalRisk > 75 ? "High risk" :
        finalRisk > 55 ? "Elevated risk" :
        finalRisk > 40 ? "Moderate risk" :
        "Low risk",
      mriFindings: randomChoice(mriFindingsOptions),
      diseaseTrajectory: Array.from({ length: 6 }, (_, i) => ({
        x: `T${i + 1}`,
        risk: clamp(finalRisk + randomBetween(-12, 12) + i * 2, 5, 98),
      })),
      monitoring: {
        heartRate: randomBetween(60, 92),
        oxygen: randomBetween(92, 99),
        motion: randomChoice(["Low", "Moderate", "Elevated"]),
        sleepQuality: randomBetween(45, 95),
      },
    };
  });
};

const tabs = [
  "Dashboard",
  "MRI Intelligence",
  "Psychosocial Intelligence",
  "Live Monitoring",
  "Explainability + AI Fusion",
  "Clinical Intelligence",
];

const viewModes = ["Axial", "Sagittal", "Coronal", "PET Overlay", "3D Reconstruction"];
const processingSteps = ["Preprocessing", "Segmentation", "Model inference", "Fusion analysis", "Report generation"];
const diseaseStages = [
  { stage: "Healthy", value: 20 },
  { stage: "MCI", value: 40 },
  { stage: "Early AD", value: 60 },
  { stage: "Moderate AD", value: 80 },
  { stage: "Advanced AD", value: 100 },
];

const sampleAlerts = [
  { id: 1, title: "New PET abnormality detected", detail: "Heatmap focus in temporal lobe." },
  { id: 2, title: "Sleep risk elevated", detail: "Patient sleep score dropped below 60%." },
  { id: 3, title: "Follow-up due", detail: "MoCA screening recommended in 2 weeks." },
];

const fusionData = [
  { name: "MRI", value: 47 },
  { name: "PET", value: 28 },
  { name: "Cognition", value: 13 },
  { name: "Behavior", value: 12 },
];

const modalityData = [
  { name: "MRI", value: 32, meaning: "Structural and metabolic imaging signals" },
  { name: "Psychosocial", value: 27, meaning: "Lifestyle, sleep and social health markers" },
  { name: "Cognitive", value: 18, meaning: "Memory, attention and clinical testing" },
  { name: "Genetic", value: 13, meaning: "APOE and hereditary risk factors" },
  { name: "Lifestyle", value: 10, meaning: "Activity, diet and daily routines" },
];

const modalityColors = ["#38bdf8", "#a78bfa", "#f97316", "#22c55e", "#facc15"];

const shapData = [
  { feature: "Hippocampal volume", value: 82 },
  { feature: "Temporal atrophy", value: 74 },
  { feature: "Sleep quality", value: 59 },
  { feature: "Cognitive score", value: 48 },
];

const rocData = [
  { x: 0, y: 0 },
  { x: 0.2, y: 0.18 },
  { x: 0.4, y: 0.48 },
  { x: 0.6, y: 0.72 },
  { x: 0.8, y: 0.86 },
  { x: 1, y: 1 },
];

const confusionData = [
  { name: "True Pos", value: 62 },
  { name: "False Pos", value: 18 },
  { name: "True Neg", value: 72 },
  { name: "False Neg", value: 12 },
];

const historyTrend = Array.from({ length: 7 }).map((_, index) => ({ name: `Day ${index + 1}`, value: 55 + Math.round(Math.random() * 20) }));

const healthScores = {
  riskFactors: [
    { label: "Stress", value: 42 },
    { label: "Sleep deficit", value: 28 },
    { label: "Social isolation", value: 45 },
  ],
  protectiveFactors: [
    { label: "Physical activity", value: 60 },
    { label: "Nutritious diet", value: 78 },
    { label: "Cognitive training", value: 68 },
  ],
};

const liveSignals = [
  { label: "Heart rate", value: "78 bpm", detail: "Stable" },
  { label: "Oxygen", value: "97%", detail: "Normal" },
  { label: "Motion", value: "Low", detail: "Quiet" },
];

const scanQuality = [
  { label: "SNR", value: "32 dB" },
  { label: "Motion", value: "Low" },
  { label: "Resolution", value: "0.9 mm" },
  { label: "Completeness", value: "96%" },
];

const ChartCard = ({ title, className = "", children }) => (
  <div className={`rounded-[32px] border border-white/10 bg-slate-950/70 p-5 ${className}`}>
    <div className="mb-4 text-sm uppercase tracking-[0.18em] text-cyan-300/70">{title}</div>
    {children}
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`rounded-[32px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.35)] ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "cyan" }) => {
  const classes = {
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-400/10",
    green: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/10",
    amber: "bg-amber-500/15 text-amber-300 border border-amber-400/10",
    rose: "bg-rose-500/15 text-rose-300 border border-rose-400/10",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[variant]}`}>{children}</span>;
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm text-slate-300">
    <span>{label}</span>
    <span className="font-semibold text-slate-100">{value}</span>
  </div>
);

const MetricCard = ({ label, value, accent = "text-cyan-300" }) => (
  <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
    <div className={`mt-3 text-2xl font-semibold ${accent}`}>{value}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="text-sm uppercase tracking-[0.18em] text-cyan-300/70">{subtitle}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{title}</div>
    </div>
    {icon}
  </div>
);

function createScanResult(patientId, view, fileName) {
  const conf = +(0.6 + Math.random() * 0.4).toFixed(2);
  const score = Math.round(conf * 100);
  const prediction = conf > 0.7 ? "Alzheimer-like" : conf > 0.55 ? "MCI-like" : "Normal";
  return {
    id: uid("scan"),
    patientId,
    timestamp: new Date().toISOString(),
    view,
    fileName,
    prediction,
    confidence: conf,
    score,
    heatmap: Math.random() > 0.35,
    details: {
      atrophyIndex: +(0.3 + Math.random() * 0.7).toFixed(2),
      hippocampalVolumeZ: +(0.5 + Math.random() * 1.5).toFixed(2),
    },
  };
}

const Gauge = ({ value }) => (
  <div className="relative h-5 rounded-full bg-slate-800/70 overflow-hidden">
    <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${clamp(value, 0, 100)}%` }} />
  </div>
);

const MRIViewer = ({ imageUrl, activeView, heatmapReady, scanning }) => {
  const viewLabels = {
    Axial: "Axial Slice",
    Sagittal: "Sagittal Side View",
    Coronal: "Coronal Front View",
    "PET Overlay": "PET Metabolic Overlay",
    "3D Reconstruction": "3D Reconstruction Simulation",
  };
  const activeLabel = viewLabels[activeView] || activeView;
  const hasImage = Boolean(imageUrl);

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-cyan-400/10 bg-slate-950/80 shadow-[0_30px_100px_rgba(14,165,233,0.14)]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 to-slate-900/50" />
      <div className="relative h-72 w-full overflow-hidden">
        {hasImage ? (
          <img
            src={imageUrl}
            alt="scan"
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${activeView === "Sagittal" ? "scale-105 skew-y-1 rotate-[3deg]" : ""} ${activeView === "Coronal" ? "brightness-110 contrast-[1.15]" : ""} ${activeView === "3D Reconstruction" ? "scale-110 rotate-[12deg]" : ""}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 text-slate-400">
            <div className="text-center">
              <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 text-cyan-300">🧠</div>
              <div className="text-sm font-semibold">No MRI selected</div>
              <div className="text-xs text-slate-500">Upload a scan to begin analysis.</div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/0" />
        {activeView === "Axial" && (
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-25">
            {Array.from({ length: 48 }).map((_, idx) => <div key={idx} className="border border-cyan-500/10" />)}
          </div>
        )}
        {activeView === "Sagittal" && (
          <>
            <div className="absolute inset-y-0 left-1/2 w-1 translate-x-[-50%] bg-pink-500/40 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent" />
          </>
        )}
        {activeView === "Coronal" && (
          <>
            <div className="absolute inset-x-1/2 top-0 h-full w-px bg-emerald-400/40" />
            <div className="absolute inset-y-1/2 left-0 h-px w-full bg-emerald-400/40" />
            <div className="absolute inset-0 bg-white/5 mix-blend-screen" />
          </>
        )}
        {activeView === "PET Overlay" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/15 via-yellow-400/10 to-transparent" />
            <div className="absolute top-14 left-12 h-28 w-28 rounded-full bg-red-500/30 blur-3xl animate-pulse" />
            <div className="absolute top-24 left-44 h-20 w-20 rounded-full bg-yellow-400/25 blur-3xl animate-pulse" />
            <div className="absolute top-36 right-16 h-14 w-14 rounded-full bg-orange-400/30 blur-3xl animate-pulse" />
          </>
        )}
        {activeView === "3D Reconstruction" && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_45%)]" />
            <div className="absolute inset-0 bg-[conic-gradient(at_top_left,rgba(14,165,233,0.12),transparent_40%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(56,189,248,0.12),transparent)]" />
          </>
        )}

        {(heatmapReady || scanning) && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-10 top-14 h-28 w-28 rounded-full bg-red-500/40 blur-3xl animate-pulse" />
            <div className="absolute top-24 right-14 h-24 w-24 rounded-full bg-yellow-400/30 blur-3xl animate-pulse" />
            <div className="absolute left-28 bottom-16 h-20 w-20 rounded-full bg-orange-400/30 blur-3xl animate-pulse" />
            <div className="absolute inset-x-0 top-1/2 h-1 bg-cyan-300/70 blur-sm animate-scanLine" />
            <div className="absolute left-6 top-10 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200">Hippocampus</div>
            <div className="absolute right-6 top-14 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-200">Temporal Lobe</div>
            <div className="absolute left-8 bottom-14 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-200">Ventricles</div>
            <div className="absolute right-10 bottom-16 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-200">Cortex</div>
          </div>
        )}
      </div>
      <div className="absolute left-6 top-6 rounded-full bg-slate-950/75 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-300">{activeLabel}</div>
      <div className="absolute inset-x-6 bottom-6 h-10 rounded-full border border-white/10 bg-slate-950/60" />
      <style>{`@keyframes scanLine {0% {transform: translateX(-120%);} 100% {transform: translateX(120%);} } .animate-scanLine{animation:scanLine 1.8s linear infinite;}`}</style>
    </div>
  );
};

const PatientSelector = ({ patients, selectedId, onSelect, filter, setFilter }) => {
  const filtered = useMemo(() => {
    const lower = filter.trim().toLowerCase();
    if (!lower) return patients.slice(0, 50);
    return patients
      .filter((patient) => patient.id.toLowerCase().includes(lower) || patient.name.toLowerCase().includes(lower))
      .slice(0, 50);
  }, [patients, filter]);

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-3">
        <div className="text-sm uppercase tracking-[0.18em] text-cyan-300/70">Search patient</div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search name or ID"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        />
        <div className="mt-3 max-h-72 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/90 p-1">
          {filtered.length === 0 ? (
            <div className="py-4 text-center text-sm text-slate-500">No matching patients</div>
          ) : (
            filtered.map((patient) => (
              <button
                key={patient.id}
                onClick={() => onSelect(patient.id)}
                className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${selectedId === patient.id ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.55)]" : "border-transparent bg-slate-900/80 text-slate-300 hover:border-white/10 hover:bg-slate-900/95"}`}>
                <div className="font-semibold">{patient.name}</div>
                <div className="text-xs text-slate-500">{patient.id} · {patient.stage} · APOE {patient.apoe}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const patients = useMemo(() => generatePatients(1500), []);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "PT-AD-0001");
  const [patientSearch, setPatientSearch] = useState("");
  const [scanImage, setScanImage] = useState("/assets/sample-mri.jpg");
  const [scanFileName, setScanFileName] = useState("Baseline MRI");
  const [scanHistory, setScanHistory] = useState([createScanResult(patients[0]?.id || "PT-AD-0001", "Axial", "Baseline MRI")]);
  const [activeMRIView, setActiveMRIView] = useState(viewModes[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [heatmapReady, setHeatmapReady] = useState(false);
  const [isPatientLoading, setIsPatientLoading] = useState(false);
  const [patientLoadProgress, setPatientLoadProgress] = useState(0);
  const [patientLoadStep, setPatientLoadStep] = useState("");
  const [patientPendingId, setPatientPendingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const fileRef = useRef(null);

  const selectedPatient = useMemo(() => patients.find((patient) => patient.id === selectedPatientId) || patients[0], [patients, selectedPatientId]);
  const psyProfile = useMemo(() => ({
    sleep: selectedPatient.sleep,
    activity: selectedPatient.activity,
    diet: selectedPatient.diet,
    social: selectedPatient.social,
    stress: selectedPatient.stress,
  }), [selectedPatient]);
  const healthScores = useMemo(() => ({
    riskFactors: [
      { label: "Stress", value: selectedPatient.stress },
      { label: "Sleep deficit", value: clamp(100 - selectedPatient.sleep, 0, 100) },
      { label: "Social isolation", value: clamp(100 - selectedPatient.social, 0, 100) },
    ],
    protectiveFactors: [
      { label: "Physical activity", value: selectedPatient.activity },
      { label: "Nutritious diet", value: selectedPatient.diet },
      { label: "Cognitive training", value: selectedPatient.memory },
    ],
  }), [selectedPatient]);
  const patientRisk = useMemo(() => Math.round(30 + Math.random() * 50), [selectedPatientId]);
  const riskLabel = patientRisk > 70 ? "High risk" : patientRisk > 50 ? "Elevated risk" : "Monitor";
  const riskVariant = patientRisk > 70 ? "rose" : patientRisk > 50 ? "amber" : "green";

  const patientLoadStages = [
    "Loading patient profile...",
    "Retrieving MRI biomarkers...",
    "Syncing psychosocial markers...",
    "Updating live monitoring stream...",
    "Generating AI clinical summary...",
  ];

  const handlePatientSelect = (patientId) => {
    if (isPatientLoading || patientId === selectedPatientId) return;
    setPatientPendingId(patientId);
    setPatientLoadProgress(0);
    setPatientLoadStep(patientLoadStages[0]);
    setIsPatientLoading(true);

    const loadDuration = 1600 + Math.random() * 900;
    const start = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.round((elapsed / loadDuration) * 100));
      setPatientLoadProgress(progress);
      const stageIndex = Math.min(patientLoadStages.length - 1, Math.floor((progress / 100) * patientLoadStages.length));
      setPatientLoadStep(patientLoadStages[stageIndex]);

      if (progress >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setSelectedPatientId(patientId);
          setIsPatientLoading(false);
          setPatientPendingId(null);
          setToastMessage(`Patient ${patientId} loaded successfully`);
          window.setTimeout(() => setToastMessage(""), 3000);
        }, 250);
      }
    }, 100);
  };

  useEffect(() => {
    if (!isAnalyzing) return;
    setAnalysisProgress(0);
    setAnalysisStep(1);
    setHeatmapReady(false);
    let elapsed = 0;
    const interval = window.setInterval(() => {
      elapsed += 200;
      const progress = Math.min(100, Math.round((elapsed / 3000) * 100));
      setAnalysisProgress(progress);
      setAnalysisStep(Math.min(processingSteps.length, Math.ceil((progress / 100) * processingSteps.length)));
      if (progress === 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setIsAnalyzing(false);
          setHeatmapReady(true);
          const result = createScanResult(selectedPatient.id, activeMRIView, scanFileName);
          setScanHistory((prev) => [result, ...prev]);
        }, 400);
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [isAnalyzing, activeMRIView, scanFileName, selectedPatient.id]);

  const PageGrid = ({ left, right, below }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 space-y-6">{left}</div>
        <div className="xl:col-span-7 space-y-6">{right}</div>
      </div>
      {below && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{below}</div>}
    </div>
  );

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setScanImage(URL.createObjectURL(file));
    setScanFileName(file.name);
  };

  const startAnalysis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
  };

  const buildHero = (title, description, badge, actionLabel) => (
    <GlassCard className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <div className="text-sm uppercase tracking-[0.18em] text-cyan-300/70">{badge}</div>
          <div className="mt-3 text-3xl font-semibold text-slate-100">{title}</div>
          <p className="mt-4 max-w-2xl text-slate-300">{description}</p>
        </div>
        <div className="xl:col-span-4 flex items-center justify-start xl:justify-end">
          <button className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_15px_40px_rgba(6,182,212,0.25)]">{actionLabel}</button>
        </div>
      </div>
    </GlassCard>
  );

  const renderDashboard = () => {
    const hero = buildHero(
      "Patient digital twin and risk overview",
      "Fast summary of imaging, psychosocial, and AI insights for your Alzheimer care pathway.",
      "Dashboard",
      "View recommendations"
    );

    const left = (
      <>
        <GlassCard className="p-5 space-y-5">
          <SectionHeader title="Patient profile" subtitle="Current record" icon={<UserCircle size={28} className="text-cyan-300" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Age" value={selectedPatient.age} />
            <MetricCard label="Sex" value={selectedPatient.sex} />
            <MetricCard label="MMSE" value={selectedPatient.baseline.mmse} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Badge variant={riskVariant}>{riskLabel}</Badge>
            <Badge variant="cyan">AI clinical copilot</Badge>
            <Badge variant="green">Action-ready</Badge>
          </div>
        </GlassCard>
        <ChartCard title="Multimodal fusion">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fusionData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip wrapperStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.15)", color: "#e2e8f0" }} />
                <Bar dataKey="value" fill="#22d3ee" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </>
    );

    const right = (
      <>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-cyan-300/70">Risk gauge</div>
              <div className="mt-2 text-4xl font-semibold text-white">{patientRisk}%</div>
            </div>
            <div className="rounded-full bg-slate-900/80 px-4 py-3 text-sm font-semibold text-cyan-300">{riskLabel}</div>
          </div>
          <div className="mt-5"><Gauge value={patientRisk} /></div>
          <div className="mt-5 text-slate-300">The risk gauge reflects combined MRI, PET, cognitive and lifestyle signals in a clinical-grade model.</div>
        </GlassCard>
        <GlassCard className="p-5 space-y-4">
          <SectionHeader title="Alert feed" subtitle="Actionable flags" icon={<AlertTriangle size={28} className="text-amber-300" />} />
          <div className="space-y-3">
            {sampleAlerts.map((alert) => (
              <GlassCard key={alert.id} className="p-4 bg-slate-950/80 border-white/10">
                <div className="text-slate-100 font-semibold">{alert.title}</div>
                <div className="mt-2 text-slate-300">{alert.detail}</div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>
      </>
    );

    const below = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Stage progression" subtitle="Clinical timeline" icon={<Clock3 size={28} className="text-cyan-300" />} />
          <div className="mt-5 space-y-4">
            {diseaseStages.map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-slate-300"><span>{stage.stage}</span><span>{stage.value}%</span></div>
                <Gauge value={stage.value} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Clinical next steps" subtitle="Plan" icon={<Stethoscope size={28} className="text-cyan-300" />} />
          <div className="mt-5 space-y-4 text-slate-300">
            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
              <div className="font-semibold text-slate-100">Schedule MoCA follow-up</div>
              <div className="mt-2 text-sm">Recommend cognitive retest in two weeks to validate strength of AI signals.</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
              <div className="font-semibold text-slate-100">Psychosocial coaching</div>
              <div className="mt-2 text-sm">Use the Psychosocial tab to target sleep, stress and social engagement improvements.</div>
            </div>
          </div>
        </GlassCard>
      </>
    );

    return (
      <div className="space-y-6">
        {hero}
        <PageGrid left={left} right={right} below={below} />
      </div>
    );
  };

  const renderMRIIntelligence = () => {
    const left = (
      <>
        <GlassCard className="p-5 space-y-5">
          <SectionHeader title="MRI workspace" subtitle="Upload and review" icon={<Sparkles size={28} className="text-cyan-300" />} />
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
              <div className="text-sm text-slate-300">MRI file</div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex cursor-pointer items-center rounded-full bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/25">Choose scan
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
                <button onClick={startAnalysis} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_15px_30px_rgba(6,182,212,0.25)]">{isAnalyzing ? "Analyzing…" : "Start analysis"}</button>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
              <div className="text-sm text-slate-300">MRI view modes</div>
              <div className="mt-4 flex flex-wrap gap-3">
                {viewModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMRIView(mode)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeMRIView === mode ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_10px_30px_rgba(14,165,233,0.25)]" : "bg-slate-900/80 text-slate-300 hover:bg-slate-900/90"}`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[36px] overflow-hidden border border-white/10">
              <MRIViewer imageUrl={scanImage} activeView={activeMRIView} heatmapReady={heatmapReady} scanning={isAnalyzing} />
            </div>
          </div>
        </GlassCard>
      </>
    );

    const right = (
      <>
        <GlassCard className="p-5 space-y-5">
          <SectionHeader title="AI processing" subtitle="Pipeline status" icon={<Cpu size={28} className="text-cyan-300" />} />
          <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
            <div className="text-sm text-slate-400">Current step</div>
            <div className="mt-3 text-xl font-semibold text-slate-100">{processingSteps[analysisStep - 1] || "Ready to begin"}</div>
            <div className="mt-4 text-slate-300">{analysisStep ? `Step ${analysisStep} of ${processingSteps.length}` : "Upload a scan and hit analyze."}</div>
            <div className="mt-5"><Gauge value={analysisProgress} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Prediction" value={scanHistory[0]?.prediction || "Pending"} />
            <MetricCard label="Confidence" value={`${Math.round((scanHistory[0]?.confidence || 0) * 100)}%`} />
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-5">
          <SectionHeader title="Grad-CAM heatmap" subtitle="Explainable overlay" icon={<Layers size={28} className="text-cyan-300" />} />
          <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4 text-slate-300">
            {heatmapReady ? (
              <>
                <div className="text-slate-100 font-semibold">Heatmap visible.</div>
                <div className="mt-2 text-sm">The model flagged hippocampus and temporal lobe regions for the current scan.</div>
              </>
            ) : (
              "Real-time heatmap will appear here once the scan analysis completes."
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {scanQuality.map((metric) => (
              <InfoRow key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>
          <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4 text-slate-300">
            <div className="text-sm uppercase tracking-[0.18em] text-cyan-300/70">AI report</div>
            <div className="mt-3 space-y-2 text-sm">
              <div><span className="font-semibold text-slate-100">Primary driver:</span> Imaging-derived hippocampal atrophy.</div>
              <div><span className="font-semibold text-slate-100">Secondary driver:</span> Metabolic PET overlay signal.</div>
              <div><span className="font-semibold text-slate-100">Recommendation:</span> Correlate with clinical exam and cognitive battery.</div>
            </div>
          </div>
        </GlassCard>
      </>
    );

    const below = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Region findings" subtitle="Lobe-specific indicators" icon={<ShieldCheck size={24} className="text-emerald-300" />} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
              <div className="text-slate-300">Frontal</div>
              <div className="mt-3 text-slate-100 font-semibold">Moderate atrophy</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
              <div className="text-slate-300">Temporal</div>
              <div className="mt-3 text-slate-100 font-semibold">High activation</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Abnormality chart" subtitle="Regional burden" icon={<BarIcon size={24} className="text-violet-300" />} />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: "Frontal", value: 70 }, { name: "Temporal", value: 85 }, { name: "Parietal", value: 55 }, { name: "Occipital", value: 35 }]} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip wrapperStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.15)", color: "#e2e8f0" }} />
                <Bar dataKey="value" fill="#a855f7" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </>
    );

    return <PageGrid left={left} right={right} below={below} />;
  };

  const renderPsychosocial = () => {
    const left = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Risk factors" subtitle="Behavioral markers" icon={<HeartPulse size={28} className="text-rose-300" />} />
          <div className="mt-5 space-y-4">
            {healthScores.riskFactors.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-slate-300"><span>{item.label}</span><span>{item.value}%</span></div>
                <Gauge value={item.value} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Protective factors" subtitle="Lifestyle supports" icon={<ShieldCheck size={28} className="text-emerald-300" />} />
          <div className="mt-5 space-y-4">
            {healthScores.protectiveFactors.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-slate-300"><span>{item.label}</span><span>{item.value}%</span></div>
                <Gauge value={item.value} />
              </div>
            ))}
          </div>
        </GlassCard>
      </>
    );

    const right = (
      <GlassCard className="sticky top-28 p-5 space-y-5">
        <SectionHeader title="Psychosocial risk" subtitle="Right-side summary" icon={<Share2 size={28} className="text-cyan-300" />} />
        <MetricCard label="Overall risk" value={`${Math.round((psyProfile.stress + (100 - psyProfile.sleep) + (100 - psyProfile.social)) / 3)}%`} />
        <GlassCard className="p-4 bg-slate-950/80 border-white/10">
          <div className="text-sm text-slate-300">Improvement potential</div>
          <div className="mt-3 text-slate-100 font-semibold">A personalized lifestyle plan can reduce risk by 15–20%.</div>
        </GlassCard>
        <GlassCard className="p-4 bg-slate-950/80 border-white/10">
          <div className="text-sm text-slate-300">Recommendation</div>
          <div className="mt-3 text-slate-100 font-semibold">Increase sleep, social activity, and cognitive training.</div>
        </GlassCard>
      </GlassCard>
    );

    const below = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Counterfactual simulator" subtitle="What-if scenarios" icon={<Zap size={24} className="text-amber-300" />} />
          <div className="mt-4 text-slate-300">Reducing stress by 10 points and improving sleep by 2 hours generates a projected psychosocial risk decrease of 12%.</div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Social health trend" subtitle="Weekly engagement" icon={<Activity size={24} className="text-cyan-300" />} />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip wrapperStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.15)" }} />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="rgba(56,189,248,0.15)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </>
    );

    return <PageGrid left={left} right={right} below={below} />;
  };

  const renderLiveMonitoring = () => {
    const left = (
      <>
        <GlassCard className="p-5 space-y-5">
          <SectionHeader title="Live vitals" subtitle="ICU-style view" icon={<HeartPulse size={28} className="text-cyan-300" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            {liveSignals.map((signal) => (
              <div key={signal.label} className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
                <div className="text-sm uppercase tracking-[0.18em] text-slate-400">{signal.label}</div>
                <div className="mt-3 text-2xl font-semibold text-slate-100">{signal.value}</div>
                <div className="mt-2 text-sm text-slate-300">{signal.detail}</div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5 bg-slate-950/80 border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-cyan-300/70">Streaming status</div>
              <div className="mt-2 text-xl font-semibold text-slate-100">Connected</div>
            </div>
            <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300 font-semibold">Live</div>
          </div>
          <div className="mt-4 text-slate-300">Telemetry is flowing from the bedside monitoring unit. No alerts are currently active.</div>
        </GlassCard>
      </>
    );

    const right = (
      <>
        <GlassCard className="p-5 space-y-5">
          <SectionHeader title="Alert center" subtitle="Critical notifications" icon={<AlertTriangle size={28} className="text-amber-300" />} />
          <div className="space-y-3">
            <GlassCard className="p-4 bg-slate-950/80 border-white/10">
              <div className="text-slate-100 font-semibold">Motion event</div>
              <div className="mt-2 text-slate-300">Patient displaced in bed.</div>
            </GlassCard>
            <GlassCard className="p-4 bg-slate-950/80 border-white/10">
              <div className="text-slate-100 font-semibold">Overnight trend</div>
              <div className="mt-2 text-slate-300">Heart rate elevated.</div>
            </GlassCard>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Event feed" subtitle="Recent logs" icon={<Clock3 size={28} className="text-cyan-300" />} />
          <div className="mt-4 text-slate-300 space-y-3">
            <div>• 12m ago — Heart rate stable at 78 bpm</div>
            <div>• 43m ago — Oxygen saturation 97%</div>
            <div>• 1h ago — Cognitive session completed</div>
          </div>
        </GlassCard>
      </>
    );

    const below = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Disease timeline" subtitle="Progress monitor" icon={<Layers size={24} className="text-violet-300" />} />
          <div className="mt-4 text-slate-300">This patient is moving through the early stage. No acute transition has occurred in the last 72 hours.</div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Recommended action" subtitle="Ward guidance" icon={<Stethoscope size={24} className="text-cyan-300" />} />
          <div className="mt-4 text-slate-100 font-semibold">Continue current monitoring and schedule a clinical review with the neurology team.</div>
        </GlassCard>
      </>
    );

    return <PageGrid left={left} right={right} below={below} />;
  };

  const renderAIExplainability = () => {
    const left = (
      <>
        <ChartCard title="SHAP feature importance">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={shapData} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="feature" tick={{ fill: "#e2e8f0", fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip wrapperStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.15)", color: "#e2e8f0" }} />
                <Bar dataKey="value" fill="#38bdf8" radius={[12, 12, 12, 12]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <GlassCard className="p-5">
          <SectionHeader title="Model pipeline" subtitle="How AI processes" icon={<Cpu size={24} className="text-cyan-300" />} />
          <ol className="mt-4 space-y-3 text-slate-300">
            <li>1. Input MRI and lifestyle features</li>
            <li>2. Extract biomarkers and volumetrics</li>
            <li>3. Fuse modalities in ensemble model</li>
            <li>4. Generate confidence-weighted prediction</li>
            <li>5. Present clinician narrative</li>
          </ol>
        </GlassCard>
      </>
    );

    const right = (
      <GlassCard className="p-5">
        <SectionHeader title="Modality contribution" subtitle="Relative weight" icon={<Layers size={28} className="text-violet-300" />} />

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(280px,_1fr)_minmax(320px,_1.2fr)] items-start">
          <div className="relative mx-auto flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-[28px] bg-slate-950/80 border border-cyan-400/10 p-4 shadow-[0_25px_70px_rgba(56,189,248,0.08)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modalityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={108}
                  paddingAngle={4}
                  labelLine={false}
                  label={({ cx, cy, midAngle, outerRadius, percent }) => {
                    const radius = outerRadius + 20;
                    const RADIAN = Math.PI / 180;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#cbd5e1" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={10}>
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {modalityData.map((entry, index) => (
                    <Cell key={entry.name} fill={modalityColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Final risk</div>
              <div className="mt-2 text-4xl font-semibold text-cyan-200">{selectedPatient.finalRisk}%</div>
              <div className="mt-1 text-sm text-slate-500">Composite score</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {modalityData.map((item, index) => (
                <div key={item.name} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: modalityColors[index] }} />
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.value}%</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs leading-5 text-slate-400">{item.meaning}</div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-cyan-400/15 bg-slate-950/80 p-4 text-slate-300 shadow-[0_15px_40px_rgba(56,189,248,0.12)]">
              <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">AI Interpretation</div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                MRI and psychosocial signals are the strongest contributors for this patient. Cognitive and lifestyle factors provide supporting evidence, while genetic risk helps refine the final clinical score.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">Primary Driver</div>
            <div className="mt-3 text-sm font-semibold text-slate-100">MRI biomarkers</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-violet-300">Secondary Driver</div>
            <div className="mt-3 text-sm font-semibold text-slate-100">Psychosocial stress</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">Protective Factor</div>
            <div className="mt-3 text-sm font-semibold text-slate-100">Lifestyle support</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-300">Model Confidence</div>
            <div className="mt-3 text-sm font-semibold text-slate-100">91%</div>
          </div>
        </div>
      </GlassCard>
    );

    const below = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Why this matters" subtitle="Clinician trust" icon={<Stethoscope size={24} className="text-cyan-300" />} />
          <div className="mt-4 text-slate-300">Explainability makes AI predictions more actionable and easier to discuss with patients and families.</div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Confidence" subtitle="Prediction stability" icon={<ShieldCheck size={24} className="text-emerald-300" />} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <MetricCard label="Sensitivity" value="87%" />
            <MetricCard label="Specificity" value="84%" />
          </div>
        </GlassCard>
      </>
    );

    return <PageGrid left={left} right={right} below={below} />;
  };

  const renderClinical = () => {
    const left = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Clinical report" subtitle="Summary" icon={<FileText size={28} className="text-cyan-300" />} />
          <div className="mt-4 text-slate-300">This report aggregates MRI, psychosocial, and model recommendations into a clinician-ready narrative.</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <MetricCard label="Report confidence" value="93%" accent="text-emerald-300" />
            <MetricCard label="Follow-up readiness" value="High" />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Imaging interpretation" subtitle="Expert summary" icon={<Eye size={28} className="text-violet-300" />} />
          <div className="mt-4 text-slate-300">Hippocampal and temporal atrophy align with early Alzheimer pathology, with high PET activation in the affected region.</div>
        </GlassCard>
      </>
    );

    const right = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="Patient profile" subtitle="Overview" icon={<UserCircle size={28} className="text-cyan-300" />} />
          <div className="mt-4 space-y-3">
            <InfoRow label="Name" value={selectedPatient.name} />
            <InfoRow label="Age" value={`${selectedPatient.age}`} />
            <InfoRow label="Sex" value={selectedPatient.sex} />
            <InfoRow label="MMSE" value={`${selectedPatient.baseline.mmse}`} />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Psychosocial interpretation" subtitle="Behavioral context" icon={<HeartPulse size={28} className="text-rose-300" />} />
          <div className="mt-4 text-slate-300">Current behavioral markers suggest moderate psychosocial stress. Recommend supportive therapy and sleep optimization.</div>
        </GlassCard>
      </>
    );

    const below = (
      <>
        <GlassCard className="p-5">
          <SectionHeader title="ROC curve" subtitle="Model performance" icon={<TrendingUp size={24} className="text-cyan-300" />} />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <XAxis dataKey="x" type="number" domain={[0, 1]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="y" type="number" domain={[0, 1]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip wrapperStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.15)" }} />
                <Line type="monotone" dataKey="y" stroke="#38bdf8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionHeader title="Confusion matrix" subtitle="Prediction accuracy" icon={<BarIcon size={24} className="text-violet-300" />} />
          <div className="mt-4 grid gap-3">
            {confusionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-3xl bg-slate-950/80 border border-white/10 p-4">
                <span className="text-slate-300">{item.name}</span>
                <span className="font-semibold text-slate-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </>
    );

    return <PageGrid left={left} right={right} below={below} />;
  };

  const navButtons = (
    <div className="inline-flex flex-wrap gap-3">{tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_15px_30px_rgba(6,182,212,0.25)]" : "bg-slate-900/70 text-slate-300 hover:bg-slate-900/90"}`}>
        {tab}
      </button>
    ))}</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-100 pb-10">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-48 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-cyan-300 shadow-[0_10px_30px_rgba(6,182,212,0.12)]">
                <Sparkles size={18} /> Alzheimer AI platform
              </div>
              <div className="mt-4 text-3xl font-semibold text-white">Clinical intelligence for modern neurodegenerative care.</div>
              <div className="mt-2 max-w-2xl text-slate-300">A polished healthcare dashboard for MRI review, psychosocial insight, and predictive clinical workflows.</div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-[320px]">
                <PatientSelector
                  patients={patients}
                  selectedId={selectedPatientId}
                  onSelect={handlePatientSelect}
                  filter={patientSearch}
                  setFilter={setPatientSearch}
                />
              </div>
              <button
                disabled={isPatientLoading}
                className={`min-w-[170px] rounded-full px-5 py-3 text-slate-950 font-semibold shadow-[0_15px_30px_rgba(6,182,212,0.25)] transition ${isPatientLoading ? "bg-slate-700/80 opacity-60 cursor-not-allowed" : "bg-gradient-to-r from-cyan-400 to-violet-500"}`}>
                {isPatientLoading ? "Loading patient..." : "Review patient"}
              </button>
            </div>
          </div>

          {isPatientLoading && (
            <div className="mb-6 rounded-[32px] border border-cyan-400/20 bg-slate-950/95 p-5 shadow-[0_30px_80px_rgba(6,182,212,0.18)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">Loading patient digital twin</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {patients.find((patient) => patient.id === patientPendingId)?.name || "Preparing patient data"}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
                  {patientLoadStep}
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900 border border-white/10">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-500 transition-all duration-200" style={{ width: `${patientLoadProgress}%` }} />
              </div>
              <div className="mt-3 text-right text-xs uppercase tracking-[0.18em] text-slate-500">{patientLoadProgress}% complete</div>
            </div>
          )}

          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-cyan-400/20 bg-slate-950/95 px-5 py-4 text-sm text-slate-100 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="font-semibold text-cyan-200">{toastMessage}</div>
            </div>
          )}

          <div className="mb-8 overflow-x-auto pb-2">{navButtons}</div>
          <div className="space-y-6">
            {activeTab === "Dashboard" && renderDashboard()}
            {activeTab === "MRI Intelligence" && renderMRIIntelligence()}
            {activeTab === "Psychosocial Intelligence" && renderPsychosocial()}
            {activeTab === "Live Monitoring" && renderLiveMonitoring()}
            {activeTab === "Explainability + AI Fusion" && renderAIExplainability()}
            {activeTab === "Clinical Intelligence" && renderClinical()}
          </div>
        </div>
      </div>
    </div>
  );
}
