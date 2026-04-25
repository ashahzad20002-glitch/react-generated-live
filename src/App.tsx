import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  AnimatePresence,
  useMotionValue,
  useInView,
  useMotionValueEvent,
} from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Mail,
  Phone,
  Maximize,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PresentationControls,
  Grid,
} from "@react-three/drei";
import * as THREE from "three";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [studioMode, setStudioMode] = useState(false);
  const { scrollY } = useScroll();
  const noiseScale = useTransform(scrollY, [0, 5000], [1, 3]);

  return (
    <React.Fragment>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} key="preloader" />
        )}
      </AnimatePresence>

      {/* Feature 1 & 2: Material Noise Overlay & Blueprint View */}
      <motion.div
        style={{ scale: noiseScale }}
        className="fixed inset-0 pointer-events-none z-[120] opacity-[0.04] bg-noise mix-blend-difference invert origin-center"
      ></motion.div>

      <AnimatePresence>
        {blueprintMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[140] pointer-events-none"
            style={{
              backdropFilter:
                "invert(1) sepia(100%) hue-rotate(180deg) saturate(3)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Feature 3: Structural Screen Grid Columns */}
      <StructuralGrid />

      {/* Feature 4: Engineering Compass & Dynamic Scale Bar */}
      <EngineeringCompass />
      <ScaleBar />

      <div
        className={`relative min-h-screen bg-stone-50 text-charcoal font-sans selection:bg-stone-200 selection:text-charcoal ${isLoading ? "h-screen overflow-hidden" : ""} ${studioMode ? "theme-studio" : ""} cinematic-frame pointer-events-none`}
      >
        {/* Global Kinetic Film Grain Vignette */}
        <div className="fixed inset-0 pointer-events-none z-[120] mix-blend-overlay opacity-40 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_120%)] transition-opacity duration-1000"></div>

        {/* CAD HUD Frame Dimension Lines */}
        <div className="fixed inset-6 border border-stone-300/20 z-[110] pointer-events-none flex flex-col justify-between p-4 mix-blend-difference hidden lg:flex">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-1 h-3 border-l border-white/50"></div>
              <span className="font-mono text-[8px] tracking-[0.2em] text-white">
                X:VIEW
              </span>
              <div className="w-12 h-px bg-white/20"></div>
            </div>
            <span className="font-mono text-[8px] text-white opacity-50">
              0.00
            </span>
          </div>
          <div className="h-full flex flex-col justify-between items-start py-8 absolute left-0 top-0">
            <div className="flex flex-col items-center gap-4 opacity-50 pl-4">
              <span
                className="font-mono text-[8px] tracking-[0.2em] text-white"
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                }}
              >
                Y:AXIS
              </span>
              <div className="h-12 w-px bg-white/20"></div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          <FloorplanMap />
          <GlobalClocks />
          <IBeamScrollbar />
          <CustomCursor blueprintMode={blueprintMode} />
          <RefractiveGlassNodes />
          <Navbar
            toggleBlueprint={() => setBlueprintMode(!blueprintMode)}
            blueprintMode={blueprintMode}
            toggleStudio={() => setStudioMode(!studioMode)}
            studioMode={studioMode}
          />

          <main>
            <HeroSection />
            <ManifestoSection />
            <KineticMarquee />
            <PhilosophySection />
            <PrinciplesSection />
            <GridSection />
            <SiteContextSection />
            <MaterialitySection />
            <ExhibitionSection />
            <ReviewsSection />
            <HorizontalProjects />
            <ProcessSection />
            <IntegratedExpertiseSection />
            <ServicesSection />
            <TimelineSection />
            <ArchiveSection />
          </main>

          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
}

// -----------------------------------------
// NEW FEATURE COMPONENTS
// -----------------------------------------
function SpatialTiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY }}
      className="w-full h-full transform-gpu"
    >
      {children}
    </motion.div>
  );
}

function StructuralGrid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex justify-between px-6 lg:px-12 max-w-7xl mx-auto opacity-[0.03] mix-blend-difference invert">
      <div className="w-px h-full bg-white"></div>
      <div className="w-px h-full bg-white hidden md:block"></div>
      <div className="w-px h-full bg-white hidden md:block"></div>
      <div className="w-px h-full bg-white"></div>
    </div>
  );
}

function FloorplanMap() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[145] w-8 h-48 border border-charcoal/10 hidden lg:block mix-blend-difference invert opacity-50 pointer-events-none">
      <div className="absolute inset-0 grid grid-rows-4 divide-y divide-charcoal/10">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <motion.div
        style={{ y }}
        className="absolute top-0 left-0 w-full h-12 bg-white"
      ></motion.div>
    </div>
  );
}

function EngineeringCompass() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div
      style={{ rotate }}
      className="fixed right-12 bottom-12 z-40 mix-blend-difference pointer-events-none hidden lg:block opacity-40 text-white"
    >
      <svg
        width="60"
        height="60"
        viewBox="0 0 100 100"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      >
        <circle cx="50" cy="50" r="45" strokeDasharray="2 6" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
        <path d="M50 5 L50 95 M5 50 L95 50" />
        <polygon points="50,20 54,46 50,50 46,46" fill="currentColor" />
      </svg>
    </motion.div>
  );
}

function ScaleBar() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed bottom-12 left-12 z-40 pointer-events-none hidden lg:flex flex-col gap-2 mix-blend-difference text-white">
      <div className="text-[9px] uppercase tracking-widest flex justify-between w-[200px] font-mono">
        <span>01</span>
        <span>1:100</span>
        <span>100m</span>
      </div>
      <div className="w-[200px] h-[1px] bg-white/20 relative">
        <motion.div
          style={{ width }}
          className="absolute left-0 top-0 h-full bg-white"
        ></motion.div>
      </div>
    </div>
  );
}

function SplitText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const words = children.split(" ");
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="overflow-hidden inline-flex mr-[0.25em]">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{
              delay: i * 0.08,
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// -----------------------------------------
// EXISTING COMPONENTS (ENHANCED)
// -----------------------------------------
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [stats, setStats] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setStats(Math.floor(Math.random() * 999999)),
      50,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="absolute inset-0 flex overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            exit={{ y: i % 2 === 0 ? "-100%" : "100%" }}
            transition={{
              duration: 1.2,
              delay: i * 0.1,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="flex-1 h-full bg-charcoal pointer-events-auto border-r border-[#1a1715]"
          >
            {/* Added structural details on blades */}
            <div className="absolute bottom-12 left-4 mix-blend-difference font-mono text-[8px] text-white/50 tracking-widest rotate-90 origin-left opacity-30">
              [LNK_PT_{i}]
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-white">
        <div className="font-mono text-[9px] mb-8 opacity-50 tracking-widest gap-4 flex pointer-events-none">
          <span>VOL: {stats}</span>
          <span>MEM: {Math.floor(stats / 3)}</span>
          <span>SYS: BOOT</span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
          className="h-px bg-white"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xs tracking-[0.3em] uppercase font-light"
        >
          DiagramX Studio
        </motion.div>
      </div>
    </motion.div>
  );
}

function CustomCursor({ blueprintMode }: { blueprintMode: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState("default");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target) {
        setCursorType(target.getAttribute("data-cursor") || "default");
      } else {
        setCursorType("default");
      }
    };
    if (typeof window !== "undefined")
      window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isMobile) return null;

  const variants = {
    default: {
      x: mousePos.x - 6,
      y: mousePos.y - 6,
      width: 12,
      height: 12,
      backgroundColor: blueprintMode ? "#fff" : "#121212",
      mixBlendMode: "difference" as const,
    },
    hover: {
      x: mousePos.x - 24,
      y: mousePos.y - 24,
      width: 48,
      height: 48,
      backgroundColor: "transparent",
      border: "1px solid #121212",
      mixBlendMode: "difference" as const,
    },
    project: {
      x: mousePos.x - 40,
      y: mousePos.y - 40,
      width: 80,
      height: 80,
      backgroundColor: "transparent",
      mixBlendMode: "normal" as const,
    },
  };

  return (
    <>
      {/* Real-time Coordinate HUD */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[145] text-[9px] font-mono mix-blend-difference text-white opacity-40 flex-col gap-32 hidden lg:flex pointer-events-none">
        <div className="rotate-[-90deg] whitespace-nowrap tracking-widest">
          LAT X: {mousePos.x.toFixed(1)}
        </div>
        <div className="rotate-[-90deg] whitespace-nowrap tracking-widest">
          LON Y: {mousePos.y.toFixed(1)}
        </div>
      </div>

      {/* Live Topographical Crosshairs (Feature) */}
      <div className="pointer-events-none fixed inset-0 z-[99] mix-blend-difference hidden lg:block overflow-hidden opacity-30 text-white">
        <motion.div
          className="absolute top-0 left-0 w-full h-[1px] bg-white/40"
          animate={{ y: mousePos.y }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
        />
        <motion.div
          className="absolute top-0 left-0 w-[1px] h-full bg-white/40"
          animate={{ x: mousePos.x }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
        />
        <motion.div
          className="absolute text-[8px] font-mono whitespace-nowrap"
          animate={{ x: mousePos.x + 10, y: mousePos.y - 15 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
        >
          {mousePos.x}px &#x2715; {mousePos.y}px
        </motion.div>
      </div>

      <motion.div
        variants={variants}
        animate={cursorType}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 1 }}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[150] flex items-center justify-center ${blueprintMode ? "invert" : ""}`}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <AnimatePresence>
          {cursorType === "project" && (
            <>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[10px] uppercase tracking-widest font-semibold text-charcoal bg-stone-50 px-3 py-1 rounded-full z-10 mix-blend-normal"
              >
                Explore
              </motion.span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pointer-events-none mix-blend-difference"
              >
                <div className="absolute top-1/2 left-[calc(-50vw+40px)] w-[100vw] h-px bg-white/40"></div>
                <div className="absolute left-1/2 top-[calc(-50vh+40px)] h-[100vh] w-px bg-white/40"></div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function Navbar({
  toggleBlueprint,
  blueprintMode,
  toggleStudio,
  studioMode,
}: {
  toggleBlueprint: () => void;
  blueprintMode: boolean;
  toggleStudio: () => void;
  studioMode: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${isScrolled ? "nav-progressive-blur py-4" : "bg-transparent py-8"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <a
          href="#"
          data-cursor="hover"
          className="text-xl font-serif tracking-[0.2em] uppercase text-charcoal"
        >
          DiagramX
        </a>

        <div className="hidden md:flex items-center space-x-12 text-xs font-semibold tracking-widest uppercase text-charcoal">
          {["Studio", "Expertise", "Selected Works"].map((item) => (
            <MagneticLink key={item}>
              <a
                href={`#${item.toLowerCase().split(" ")[0]}`}
                data-cursor="hover"
                className="hover-line-through"
              >
                {item}
              </a>
            </MagneticLink>
          ))}
          <button
            onClick={toggleBlueprint}
            data-cursor="hover"
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <Maximize className="w-3 h-3" />
            <span>{blueprintMode ? "Exit X-Ray" : "X-Ray View"}</span>
          </button>
          <button
            onClick={toggleStudio}
            data-cursor="hover"
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <span>{studioMode ? "☼ Env Light" : "⚡ Studio Light"}</span>
          </button>
          <MagneticButton>
            <a
              href="#contact"
              data-cursor="hover"
              className="px-6 py-3 border border-charcoal/20 hover:bg-charcoal hover:text-white transition-colors duration-500 rounded-full"
            >
              Inquire
            </a>
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPosition({
      x: (clientX - (left + width / 2)) * 0.15,
      y: (clientY - (top + height / 2)) * 0.15,
    });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 1 }}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 1000], [0, 260]);
  const yText = useTransform(scrollY, [0, 1000], [0, 110]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  const scaleText = useTransform(scrollY, [0, 800], [1, 1.05]);

  // Feature: Scroll Lens Blur
  const backgroundBlur = useTransform(
    scrollY,
    [0, 500],
    ["blur(0px)", "blur(20px)"],
  );

  const [mouse, setMouse] = useState({ x: -100, y: -100 });

  return (
    <section
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      className="sticky top-0 h-screen w-full overflow-hidden bg-charcoal flex items-center justify-center shadow-2xl z-0 rounded-b-[40px]"
    >
      <div className="absolute inset-0 z-0 bg-blueprint-dark opacity-20 mix-blend-screen"></div>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-stone-50/65 via-stone-50/15 to-transparent z-30 pointer-events-none"></div>

      {/* Ambient Sunlight Simulator */}
      <div className="absolute inset-0 z-[5] mix-blend-overlay ambient-sunlight opacity-60"></div>

      {/* Feature 5: Volumetric Mouse Lighting Spotlight */}
      <motion.div
        animate={{ x: mouse.x, y: mouse.y }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        className="absolute left-0 top-0 w-[40vh] h-[40vh] rounded-full bg-white opacity-25 blur-[120px] pointer-events-none mix-blend-overlay z-20 -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />

      <motion.div
        style={{ y: yImage, opacity, filter: backgroundBlur }}
        className="absolute inset-0 w-full h-full p-3 md:p-8 lg:p-12 z-10 pointer-events-none"
      >
        <div className="w-full h-full overflow-hidden rounded-2xl relative bg-charcoal">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/5 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10 z-10"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:25%_100%,100%_33.333%] mix-blend-overlay opacity-25 z-10"></div>
          <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1774516534779-b787e82ff1e6?auto=format&fit=crop&q=88&w=2560"
            alt="Contemporary concrete residence set into a rugged landscape"
            className="w-full h-[118%] object-cover object-[center_68%] translate-y-[-7%] saturate-[0.85] contrast-[1.08]"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      <motion.div
        style={{ y: yText, scale: scaleText }}
        className="relative z-20 w-full h-full pointer-events-none px-6 md:px-12 lg:px-20 flex flex-col justify-end pb-24 md:pb-28 lg:pb-32 origin-bottom"
      >
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="mb-6 flex flex-wrap items-center gap-4 text-[10px] md:text-xs uppercase font-mono tracking-[0.24em] text-white/70"
          >
            <span className="h-px w-12 bg-white/45"></span>
            <span>Architecture & Interiors for Private Residences</span>
          </motion.div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-7xl xl:text-8xl tracking-normal leading-[0.95] text-white max-w-7xl drop-shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <span className="block">Homes shaped by</span>
            <span className="block italic font-light text-stone-200">
              site, light, and material.
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: [0.76, 0, 0.24, 1] }}
            className="mt-8 flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16"
          >
            <p className="max-w-xl text-base md:text-lg leading-relaxed text-stone-100/85 font-light">
              DiagramX is a London architecture and design studio creating
              refined residences, extensions, and interiors with structural
              clarity, quiet luxury, and enduring spatial calm.
            </p>

            <div className="pointer-events-auto flex flex-wrap gap-4">
              <a
                href="#contact"
                data-cursor="hover"
                className="inline-flex h-12 items-center gap-3 bg-stone-50 px-5 md:px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal transition-colors duration-500 hover:bg-white"
              >
                Start a Project
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#projects"
                data-cursor="hover"
                className="inline-flex h-12 items-center border border-white/30 px-5 md:px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:border-white hover:bg-white/10"
              >
                Selected Works
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 border-t border-white/20 pt-5 text-[9px] uppercase tracking-[0.22em] text-white/60 sm:grid-cols-3">
          {[
            ["01", "Site-Specific Homes"],
            ["02", "Interiors & Materiality"],
            ["03", "Extensions & Reworking"],
          ].map(([num, label]) => (
            <div
              key={num}
              className="flex items-center justify-between gap-4 border-white/15 sm:border-r sm:pr-6 last:border-r-0"
            >
              <span className="font-mono text-white/35">{num}</span>
              <span className="font-mono text-right text-white/70">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute top-[30%] left-12 z-30 hidden lg:flex flex-col gap-8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 1.5 }}
          className="h-px bg-white/40"
        ></motion.div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 writing-vertical-rl transform rotate-180">
          EST. 2004 / LONDON
        </span>
      </div>
    </section>
  );
}

function KineticMarquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-8, 8]);

  return (
    <div className="w-full bg-charcoal py-12 overflow-hidden text-stone-50 border-y border-stone-800 relative z-20 flex flex-col gap-6">
      <motion.div
        style={{ skewX }}
        className="flex w-[200%] animate-marquee opacity-30 text-xs"
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center whitespace-nowrap px-8">
            <h2 className="font-mono tracking-[0.2em] uppercase mr-8">
              Structural Engineering
            </h2>
            <div className="w-2 h-2 rounded-full bg-stone-50 mr-8"></div>
            <h2 className="font-mono tracking-[0.2em] uppercase mr-8">
              Contextual Design
            </h2>
            <div className="w-2 h-2 rounded-full bg-stone-50 mr-8"></div>
          </div>
        ))}
      </motion.div>

      <motion.div
        style={{ skewX }}
        className="flex w-[200%] animate-marquee-reverse"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center whitespace-nowrap px-8">
            <h2 className="text-4xl md:text-6xl font-serif text-outline-dark italic font-light tracking-wide mr-8">
              ARCHITECTURE
            </h2>
            <div className="w-4 h-4 rounded-full bg-stone-50 mr-8"></div>
            <h2 className="text-4xl md:text-6xl font-sans font-semibold tracking-tighter uppercase mr-8">
              Bespoke Design
            </h2>
            <div className="w-4 h-4 rounded-full bg-stone-50 mr-8"></div>
            <h2 className="text-4xl md:text-6xl font-serif tracking-widest uppercase mr-8 text-stone-400">
              London
            </h2>
            <div className="w-4 h-4 rounded-full bg-stone-50 mr-8"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function PhilosophySection() {
  const containerRef = useRef(null);

  const pillars = [
    {
      id: "01",
      title: "Space & Volume",
      quote:
        "Space is not a void to be filled, but a tactile medium to be sculpted.",
      body: "We believe architecture must move beyond shelter. It must orchestrate a sequence of spatial events that heighten human awareness. Every threshold, corridor, and antechamber is designed as a psychological transition.",
      img1: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=85&w=1200",
      img2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=900",
    },
    {
      id: "02",
      title: "Light & Resonance",
      quote: "Before we draw a wall, we study the trajectory of the sun.",
      body: "Light is our most profound building material. It defines the volumetric qualities of our structures, carving mass and establishing rhythm. We treat shadows not as an absence of light, but as an active component of the architectural composition.",
      img1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=85&w=1200",
      img2: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=85&w=900",
    },
    {
      id: "03",
      title: "Honest Materiality",
      quote:
        "Materials should express their inherent truth and register the passage of time.",
      body: "We strip away the extraneous. Our palette relies on the elemental: board-formed concrete, untreated timber, oxidized steel, and quarried stone. These materials do not degrade; they achieve patina, rooting the architecture to its geological context.",
      img1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1200",
      img2: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=900",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative bg-stone-100 text-charcoal py-32 z-20 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-charcoal/10" />
      {/* Background blueprint lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-between px-6 lg:px-12 opacity-10">
        <div className="w-px h-full bg-charcoal" />
        <div className="w-px h-full bg-charcoal hidden md:block" />
        <div className="w-px h-full bg-charcoal" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-32">
          <h2 className="text-[10px] uppercase font-mono tracking-[0.2em] mb-4 md:mb-0 relative inline-flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-charcoal"></span>
            Studio Philosophy
            <br />
            [Vol. 01]
          </h2>
          <div className="max-w-xl">
            <SplitText className="font-serif text-3xl md:text-5xl leading-[1.1] mb-8 block font-light tracking-tight">
              A pursuit of essential form, defining the quiet luxury of the
              unseen.
            </SplitText>
            <p className="text-[10px] text-stone-500 uppercase font-mono tracking-widest leading-loose">
              We approach each site as a geographical artifact, demanding a
              highly specific structural response. Our methodology bridges
              rigorous engineering with poetic spatial arrangements.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="flex flex-col gap-32 md:gap-48 mt-16">
          {pillars.map((pillar, idx) => (
            <PhilosophyPillar key={pillar.id} pillar={pillar} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophyPillar({ pillar, idx }: { pillar: any; idx: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <div
      ref={ref}
      className={`flex flex-col ${idx % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-24 relative`}
    >
      {/* Background monumental number */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 md:top-1/2 left-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 text-[15rem] md:text-[28rem] font-serif italic text-stone-200/40 pointer-events-none select-none z-0 mix-blend-multiply"
      >
        {pillar.id}
      </motion.div>

      <div className="flex-1 w-full relative z-10">
        <div className="relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden shrink-0 group">
          <motion.img
            style={{ scale: 1.15, y: y1 }}
            src={pillar.img1}
            alt={pillar.title}
            className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-700" />
        </div>
        {/* Secondary smaller offset image */}
        <motion.div
          style={{ y: y2 }}
          className={`absolute bottom-[-15%] ${idx % 2 !== 0 ? "left-[-15%]" : "right-[-15%]"} w-3/5 aspect-[4/3] overflow-hidden border-8 border-stone-100 hidden md:block shadow-2xl z-20`}
        >
          <img
            src={pillar.img2}
            alt={`${pillar.title} detail`}
            className="w-full h-full object-cover grayscale opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 border border-white/50 mix-blend-overlay m-2 pointer-events-none" />
        </motion.div>
      </div>

      <div className="flex-1 z-10 flex flex-col justify-center bg-stone-50/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none shadow-xl md:shadow-none">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] border border-charcoal/20 text-charcoal px-4 py-2 rounded-full bg-white/50">
            {pillar.id}
          </span>
          <div className="h-px bg-charcoal/20 w-16" />
        </div>
        <h4 className="text-4xl md:text-6xl font-serif mb-6 md:mb-8 tracking-tighter text-stone-900">
          {pillar.title}
        </h4>
        <p className="font-serif text-xl md:text-3xl italic text-stone-500 mb-8 border-l-2 border-charcoal/20 pl-6 md:pl-8 leading-relaxed max-w-xl">
          "{pillar.quote}"
        </p>
        <div className="font-sans text-sm md:text-base text-stone-600 leading-relaxed max-w-lg font-light">
          {pillar.body}
        </div>
      </div>
    </div>
  );
}

function PrinciplesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const principles = [
    {
      id: "01",
      name: "Clarity",
      label: "Spatial Legibility",
      desc: "The deliberate reduction of visual noise. We believe a space must be instantly comprehensible, guiding the occupant through intuitive geometric logic without reliance on arbitrary ornamentation.",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=85&w=2000",
    },
    {
      id: "02",
      name: "Proportion",
      label: "Mathematical Harmony",
      desc: "Every dimension is rigorously calculated. We employ ancient mathematical ratios and the Fibonacci sequence to ensure the scale of the structure resonates perfectly with the human body.",
      img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=2000",
    },
    {
      id: "03",
      name: "Light",
      label: "Volumetric Carving",
      desc: "Light is treated as a physical building material. The precise orientation of apertures captures the solar trajectory, carving mass with shadow and fundamentally altering the perception of time.",
      img: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=85&w=2000",
    },
    {
      id: "04",
      name: "Environment",
      label: "Climatic Response",
      desc: "True sustainability is invisible. We engineer passive thermal regulation, strategic airflow, and deep environmental integration so the structure functions organically within its specific biosphere.",
      img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=85&w=2000",
    },
    {
      id: "05",
      name: "Structure",
      label: "Tectonic Truth",
      desc: "We do not hide the load paths. The engineering of the building is exposed and celebrated. Beams, columns, and joints are expressed honestly as primary aesthetic elements.",
      img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=85&w=2000",
    },
    {
      id: "06",
      name: "Detail",
      label: "Micro-Scale Resolution",
      desc: "God is in the intersection. How a steel column meets a concrete slab is given the same obsessive scrutiny as the overall urban massing. The detail reveals the underlying integrity.",
      img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=2000",
    },
    {
      id: "07",
      name: "Livability",
      label: "Human Centricity",
      desc: "Architecture must serve its inhabitants. Beyond sculptural ambition, we prioritize psychological comfort, ergonomic flow, and the tangible enhancement of daily human rituals.",
      img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=85&w=2000",
    },
  ];

  return (
    <section className="relative min-h-screen bg-stone-100 flex items-center justify-center overflow-hidden py-32 z-20 shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
      {/* Background Images Crossfade Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            src={principles[activeIndex].img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-100/90 to-transparent"></div>
        <div className="absolute inset-0 bg-noise mix-blend-multiply opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-8 min-h-[70vh]">
        {/* Left Stats/Description Panel */}
        <div className="w-full md:w-1/3 flex flex-col justify-end pb-12 relative h-full">
          <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-stone-400 mb-8 flex items-center gap-4">
            <div className="w-8 h-px bg-stone-400"></div>
            Signature Canons
          </div>

          <div className="relative h-[200px] md:h-[250px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="font-serif italic text-4xl text-stone-300 pointer-events-none select-none">
                    {principles[activeIndex].id}
                  </span>
                  <h4 className="text-2xl md:text-3xl font-serif text-charcoal tracking-tight mt-1">
                    {principles[activeIndex].label}
                  </h4>
                </div>
                <p className="font-mono text-[10px] md:text-[11px] leading-[2] tracking-widest text-stone-500 uppercase border-l-2 border-charcoal/20 pl-6 text-justify">
                  {principles[activeIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Massive Typographic List */}
        <div
          className="w-full md:w-2/3 flex flex-col justify-center items-end"
          onMouseLeave={() => setActiveIndex(0)}
        >
          {principles.map((p, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setActiveIndex(i)}
                className="relative cursor-pointer group w-full text-right"
                data-cursor="hover"
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.15,
                    x: isActive ? 0 : "2%",
                    clipPath: isActive ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                  }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 flex items-center justify-end text-[10vw] md:text-[7vw] font-serif uppercase tracking-tighter leading-[0.85] text-charcoal"
                  style={{ WebkitTextStroke: "0px transparent" }}
                >
                  {p.name}
                </motion.div>

                {/* Outline Outline Version Always visible */}
                <motion.div
                  animate={{ x: isActive ? 0 : "2%" }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  className="text-[10vw] md:text-[7vw] font-serif uppercase tracking-tighter leading-[0.85] text-transparent"
                  style={{ WebkitTextStroke: "1px rgba(28,25,23,0.3)" }}
                >
                  {p.name}
                </motion.div>

                <div className="absolute right-0 bottom-0 w-full h-[1px] bg-charcoal/10 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-700 ease-out"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GridSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const yFast = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);

  // Feature: Massive Watermark Parallax
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section
      ref={containerRef}
      id="studio"
      className="py-32 lg:py-48 bg-stone-50 relative overflow-hidden z-20 rounded-t-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
    >
      <motion.div
        style={{ y: watermarkY }}
        className="absolute pt-[15%] left-0 w-full text-center text-[20vw] font-serif leading-none tracking-tighter text-charcoal/[0.03] pointer-events-none whitespace-nowrap overflow-hidden"
      >
        DIAGRAMX
      </motion.div>
      <div className="absolute inset-0 bg-blueprint opacity-[0.15] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-smoke mb-8 block">
              The Studio
            </span>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.2] mb-10">
              <SplitText>
                We orchestrate light, proportion, and materiality into
              </SplitText>{" "}
              <span className="italic text-stone-400">
                <SplitText>living art.</SplitText>
              </span>
            </h2>
            <p className="text-smoke leading-relaxed text-lg max-w-md mb-12">
              Our discipline stems from a rigorous pursuit of purity. We believe
              every space should respond directly to its environmental context
              while framing the lives of those within it.
            </p>
            <MagneticButton>
              <a
                href="#projects"
                data-cursor="hover"
                className="inline-flex items-center space-x-4 text-xs font-semibold uppercase tracking-widest text-charcoal border-b border-charcoal/20 pb-2 hover:border-charcoal transition-colors w-max"
              >
                <span>View Methodology</span>
              </a>
            </MagneticButton>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-8 order-1 lg:order-2 h-[60vh] lg:h-[80vh] perspective-1000 relative">
            {/* Feature: Principal's Redline Markup */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-30"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                d="M30,20 Q40,10 60,15 T80,30"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.5"
                strokeDasharray="1 1"
              />
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                d="M78,28 l4,2 l-1,4"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
            </svg>

            <SpatialTiltCard>
              <motion.div
                style={{ y: yFast }}
                className="w-full h-[80%] mt-auto overflow-hidden"
              >
                <motion.div
                  initial={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                  }}
                  whileInView={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="w-full h-full"
                >
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1400"
                    alt="Interior Detail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </motion.div>
            </SpatialTiltCard>

            <SpatialTiltCard>
              <motion.div
                style={{ y: ySlow }}
                className="w-full h-[90%] overflow-hidden group/scanner relative"
              >
                <motion.div
                  initial={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                  }}
                  whileInView={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.2,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="w-full h-full relative"
                >
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=1400"
                    alt="Architecture Facade"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Feature: Active Blueprint Scanning */}
                  <motion.div
                    className="absolute inset-0 mix-blend-difference pointer-events-none filter invert grayscale contrast-200 overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: "-100%" }}
                      animate={{ y: "200%" }}
                      transition={{
                        duration: 8,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 h-1/4"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=1400"
                        alt=""
                        className="w-full h-[400%] max-w-none object-cover"
                        style={{ marginTop: "0%" }}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-full left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_red]"></div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </SpatialTiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExhibitionSection() {
  const works = [
    {
      id: "IX-01",
      title: "The Nebelhaus",
      category: "Alpine Residence",
      location: "Swiss Alps, CH",
      year: "2024",
      desc: "Anchored into the bedrock, the structure acts as a thermal mass, absorbing solar radiation during the day and radiating it into the living quarters at night. A stark concrete monolith against the snow.",
      img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=85&w=2400",
      layout: "left",
    },
    {
      id: "IX-02",
      title: "Silica Pavilion",
      category: "Cultural Center",
      location: "Kyoto, JP",
      year: "2023",
      desc: "An exploration of translucency. Ribbed glass and impossibly thin steel define a pavilion that filters the surrounding forest light, creating an interior atmosphere of total suspension.",
      img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=85&w=2400",
      layout: "right",
    },
    {
      id: "IX-03",
      title: "Corten Tower",
      category: "Commercial High-Rise",
      location: "Oslo, NO",
      year: "2022",
      desc: "Designed to age. The weathering steel facade records the atmospheric memory of the city, shifting from bright orange to deep umber as it oxidizes in the coastal air.",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=2400",
      layout: "center",
    },
  ];

  return (
    <section className="bg-[#f5f5f3] relative z-20 py-32 md:py-48 text-stone-900 border-b border-stone-300">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 md:mb-48 border-b border-stone-300 pb-12 gap-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-stone-500 mb-6 block">
              Curated Exhibition
            </span>
            <h2 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.9]">
              Selected{" "}
              <span className="italic font-light text-stone-500">Works</span>
            </h2>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-stone-500 leading-loose max-w-xs uppercase flex flex-col gap-2">
            <span>[ Exhibit / 2022&mdash;2024 ]</span>A physical manifestation
            of our core tectonic principles preserved in a gallery format.
          </div>
        </div>

        {/* Gallery Items */}
        <div className="flex flex-col gap-32 md:gap-64">
          {works.map((work, idx) => (
            <ExhibitionArtwork key={work.id} work={work} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExhibitionArtwork({ work, index }: { work: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Immersive Parallax Math
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col ${work.layout === "right" ? "md:flex-row-reverse" : work.layout === "center" ? "md:flex-col items-center" : "md:flex-row"} items-center gap-12 md:gap-24 group`}
    >
      {/* Massive Image Container */}
      <div
        className={`relative overflow-hidden w-full ${work.layout === "center" ? "md:w-3/4 aspect-video" : "md:w-3/5 aspect-[3/4] md:aspect-[4/5]"} bg-stone-200`}
      >
        <motion.div
          style={{ y: imageY, height: "130%" }}
          className="absolute inset-x-0 top-[-15%] origin-center"
        >
          <img
            src={work.img}
            alt={work.title}
            className="w-full h-full object-cover filter grayscale-[0.3] contrast-[1.05] group-hover:grayscale-0 group-hover:contrast-110 transition-all duration-1000 ease-[0.19,1,0.22,1]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        {/* Glass Glare Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
      </div>

      {/* Museum Plaque Detailing */}
      <motion.div
        style={{ y: textY }}
        className={`flex flex-col z-10 w-full ${work.layout === "center" ? "md:w-3/4 md:-mt-16" : "md:w-2/5"}`}
      >
        <div className="bg-[#f0eee9] p-8 md:p-12 shadow-2xl border border-stone-200 flex flex-col gap-8 relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-charcoal text-white px-3 py-1 font-mono text-[9px] tracking-widest uppercase">
            {work.id}
          </div>

          <h3 className="text-4xl md:text-6xl font-serif tracking-tighter leading-none text-charcoal">
            {work.title}
          </h3>

          <div className="flex flex-col gap-2 font-mono text-[10px] tracking-widest text-stone-400 uppercase">
            <div className="flex justify-between border-b border-stone-300 pb-2">
              <span>Category</span>
              <span className="text-charcoal">{work.category}</span>
            </div>
            <div className="flex justify-between border-b border-stone-300 pb-2">
              <span>Location</span>
              <span className="text-charcoal">{work.location}</span>
            </div>
            <div className="flex justify-between border-b border-stone-300 pb-2">
              <span>Completion</span>
              <span className="text-charcoal">{work.year}</span>
            </div>
          </div>

          <p className="font-mono text-[11px] leading-loose tracking-wider text-charcoal/70 uppercase">
            {work.desc}
          </p>
        </div>
      </motion.div>

      {/* Background Outline Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden md:block">
        <span
          className="text-[20vw] font-serif uppercase tracking-tighter leading-none text-transparent"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.03)" }}
        >
          {index + 1}
        </span>
      </div>
    </div>
  );
}

function ReviewsSection() {
  const reviews = [
    {
      text: "A profound understanding of mass and void. They don't just build, they sculpt space.",
      author: "Architectural Digest",
    },
    {
      text: "The most thoughtful residential execution we've seen this decade. Pure tectonic truth.",
      author: "Wallpaper* Magazine",
    },
    {
      text: "Minimalism with a soul. Every shadow feels intentionally orchestrated.",
      author: "Eleanor Vance, Client",
    },
    {
      text: "They challenged our brief and delivered a masterpiece of concrete and light.",
      author: "The Foundation Arts",
    },
    {
      text: "Uncompromising precision. A studio that operates at the highest echelon of design.",
      author: "Dezeen",
    },
    {
      text: "The structural honesty of their work is unparalleled in today's landscape.",
      author: "Global Design Review",
    },
    {
      text: "Living in one of their homes alters your psychological state for the better.",
      author: "Marcus Thorne, Client",
    },
    {
      text: "A brutal yet beautiful intervention in the alpine landscape.",
      author: "Alpine Heritage Trust",
    },
    {
      text: "Flawless integration of environmental systems within high aesthetic purity.",
      author: "Green Building Intl",
    },
    {
      text: "They bend light like an architectural material. Utterly mesmerizing spaces.",
      author: "Design Anthology",
    },
    {
      text: "We asked for a house, they gave us a physical manifestation of peace.",
      author: "Sarah Jenkins, Client",
    },
    {
      text: "The details are not the details, they are the design. Extraordinary execution.",
      author: "Architecture Now",
    },
  ];

  const row1 = [...reviews].splice(0, 4);
  const row2 = [...reviews].splice(4, 4);
  const row3 = [...reviews].splice(8, 4);

  return (
    <section className="bg-[#050505] relative z-20 py-32 md:py-48 overflow-hidden text-stone-200 border-t border-white/5">
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-screen pointer-events-none"></div>

      <div className="px-6 md:px-12 mb-24 md:mb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-cyan-500 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
          Critical Reception
        </div>
        <h2 className="text-4xl md:text-7xl font-serif tracking-tighter leading-tight">
          Client Perspectives <br /> &amp;{" "}
          <span className="italic text-stone-600 font-light">
            Industry Discourse
          </span>
        </h2>
      </div>

      <div className="flex flex-col gap-8 md:gap-16 w-[150vw] md:w-full md:px-0 -ml-[25vw] md:ml-0 rotate-[-2deg] md:rotate-0 origin-center scale-[0.8] md:scale-100">
        {/* Row 1 - Left to Right */}
        <div className="relative w-full flex overflow-hidden">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            className="flex w-max gap-8 md:gap-16 px-4 md:px-8"
          >
            {[...row1, ...row1, ...row1].map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="relative w-full flex overflow-hidden">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{ ease: "linear", duration: 50, repeat: Infinity }}
            className="flex w-max gap-8 md:gap-16 px-4 md:px-8 pl-32"
          >
            {[...row2, ...row2, ...row2].map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Row 3 - Left to Right */}
        <div className="relative w-full flex overflow-hidden">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{ ease: "linear", duration: 45, repeat: Infinity }}
            className="flex w-max gap-8 md:gap-16 px-4 md:px-8 pr-24"
          >
            {[...row3, ...row3, ...row3].map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="flex flex-col w-[300px] md:w-[450px] shrink-0 border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 md:p-10 hover:bg-white/5 transition-colors duration-500 cursor-default">
      <span className="text-4xl text-stone-600 font-serif leading-none mb-4">
        &ldquo;
      </span>
      <p className="font-serif text-xl md:text-2xl leading-snug tracking-tight mb-8">
        {review.text}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
          Source
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500">
          {review.author}
        </span>
      </div>
    </div>
  );
}

function HorizontalProjects() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  const projects = [
    {
      title: "The Glass Pavilion",
      location: "Surrey",
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=85&w=2400",
      year: "2025",
    },
    {
      title: "Kensington Townhouse",
      location: "London",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=85&w=2400",
      year: "2024",
    },
    {
      title: "Brutal Minimal",
      location: "Swiss Alps",
      img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=85&w=2400",
      year: "2023",
    },
  ];

  return (
    <section
      ref={targetRef}
      id="projects"
      className="h-[300vh] bg-charcoal relative z-30"
    >
      <div className="absolute inset-0 bg-blueprint-dark opacity-[0.05] pointer-events-none"></div>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-charcoal text-stone-50">
        <div className="absolute top-32 left-6 lg:left-12 z-20">
          <SplitText className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-400 block">
            Selected Works
          </SplitText>
        </div>

        <motion.div
          style={{ x }}
          className="flex w-[300vw] h-[60vh] lg:h-[70vh] items-center"
        >
          {projects.map((p, i) => (
            <ProjectCard key={i} p={p} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ p, index }: { p: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlarePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div className="w-[100vw] px-6 lg:px-24 flex items-center justify-center shrink-0">
      <div className="w-full max-w-7xl flex gap-8 lg:gap-24 items-center">
        <motion.div
          animate={{ width: isHovered && !is3D ? "75%" : "66.666%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="w-3/5 lg:w-2/3 aspect-[4/3] lg:aspect-[16/9] overflow-hidden group relative bg-stone-200"
          data-cursor={!is3D ? "project" : "default"}
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            {!is3D ? (
              <motion.div
                key="2d"
                initial={{
                  clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
                  filter: "invert(1) grayscale(1) contrast(1.5)",
                }}
                whileInView={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  filter: "invert(0) grayscale(0) contrast(1)",
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full h-full relative"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {!is3D && (
                  <motion.div
                    animate={{ x: glarePos.x - 300, y: glarePos.y - 300 }}
                    className="absolute top-0 left-0 w-[600px] h-[600px] z-10 pointer-events-none opacity-0 group-hover:opacity-100 mix-blend-overlay"
                    style={{
                      background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)`,
                    }}
                  />
                )}
                {/* Glass Sheen */}
                <div className="glass-sheen hidden md:block"></div>
              </motion.div>
            ) : (
              <motion.div
                key="3d"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full relative cursor-grab active:cursor-grabbing bg-[#f0edea]"
              >
                <Canvas camera={{ position: [5, 4, 6], fov: 45 }} shadows>
                  <ambientLight intensity={0.6} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={1024}
                  />
                  <PresentationControls
                    global
                    rotation={[0, -Math.PI / 4, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI, Math.PI]}
                  >
                    <MassingModel type={index} />
                  </PresentationControls>
                  <Environment preset="city" />
                  <Grid
                    infiniteGrid
                    fadeDistance={40}
                    sectionColor="#d6d3d1"
                    cellColor="#e7e5e4"
                    cellSize={1}
                    sectionSize={5}
                  />
                  <ContactShadows
                    position={[0, -0.99, 0]}
                    opacity={0.6}
                    scale={20}
                    blur={2.5}
                    far={10}
                    color="#1c1917"
                  />
                </Canvas>

                {/* Live 3D Overlay Elements */}
                <div className="absolute top-4 right-4 text-[9px] uppercase font-mono tracking-widest text-smoke flex flex-col gap-1 text-right pointer-events-none mix-blend-difference">
                  <span>Interactive Mode Active</span>
                  <span className="text-white">
                    Drag to rotate • Scroll to zoom
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIs3D(!is3D)}
            className="absolute bottom-6 left-6 z-30 px-5 py-3 bg-charcoal text-white text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-stone-800 transition shadow-xl border border-white/10"
            data-cursor="hover"
          >
            {is3D ? "Close 3D Viewer" : "Explore 3D Model"}
          </button>
        </motion.div>

        <div className="w-2/5 lg:w-1/3 flex flex-col">
          <span className="text-xs font-mono text-stone-400 mb-6 flex flex-col gap-2 overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              0{index + 1} &mdash; <ScrambleText text={p.year} />
            </motion.span>
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[9px] uppercase opacity-50"
            >
              <ScrambleText
                text={`ID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
              />
            </motion.span>
          </span>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-6">
            <SplitText>{p.title}</SplitText>
          </h3>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-stone-400">
            <MapPin className="w-3 h-3" />
            {p.location}
          </div>
        </div>
      </div>
    </div>
  );
}

function MassingModel({ type }: { type: number }) {
  const material = (
    <meshStandardMaterial color="#f5f5f4" roughness={0.2} metalness={0.1} />
  );
  const glassMaterial = (
    <meshPhysicalMaterial
      color="#ffffff"
      transmission={0.9}
      opacity={1}
      transparent
      roughness={0.1}
      ior={1.3}
      thickness={0.5}
      clearcoat={1}
    />
  );
  const darkMaterial = <meshStandardMaterial color="#292524" roughness={0.5} />;

  if (type === 0) {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.9, 0]} receiveShadow castShadow>
          <boxGeometry args={[7, 0.2, 5]} />
          {material}
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[4, 1.8, 2.5]} />
          {glassMaterial}
        </mesh>
        <mesh position={[0.5, 1.1, -0.5]} castShadow>
          <boxGeometry args={[5, 0.2, 4]} />
          {material}
        </mesh>
        <mesh position={[-1.5, -0.1, -1]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2]} />
          {material}
        </mesh>
        <mesh position={[2, -0.1, -1]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (type === 1) {
    return (
      <group position={[0, -0.5, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 4, 3]} />
          {material}
        </mesh>
        <mesh position={[0.5, 2.2, 1.6]} castShadow>
          <boxGeometry args={[2.6, 1.5, 0.5]} />
          {darkMaterial}
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 0.2, 4]} />
          {material}
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, -0.2, 0]}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3, 2.5]} />
        {material}
      </mesh>
      <mesh position={[1.5, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 2]} />
        {material}
      </mesh>
    </group>
  );
}

function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sketchClip = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);
  const sketchClipPath = useTransform(
    sketchClip,
    (val) => `inset(0% 0% 0% ${val})`,
  );

  const blueprintClip = useTransform(
    scrollYProgress,
    [0.5, 0.8],
    ["0%", "100%"],
  );
  const blueprintClipPath = useTransform(
    blueprintClip,
    (val) => `inset(0% 0% 0% ${val})`,
  );

  // Fixed NaN by mapping directly from scroll scrollYProgress instead of percentage strings
  const sketchScannerOp = useTransform(
    scrollYProgress,
    [0.1, 0.115, 0.385, 0.4],
    [0, 1, 1, 0],
  );
  const blueprintScannerOp = useTransform(
    scrollYProgress,
    [0.5, 0.515, 0.785, 0.8],
    [0, 1, 1, 0],
  );

  const text1Op = useTransform(
    scrollYProgress,
    [0, 0.1, 0.35, 0.4],
    [1, 1, 0, 0],
  );
  const text1Y = useTransform(scrollYProgress, [0, 0.4], ["0px", "-20px"]);

  const text2Op = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.75, 0.8],
    [0, 1, 1, 0],
  );
  const text2Y = useTransform(
    scrollYProgress,
    [0.35, 0.5, 0.8],
    ["20px", "0px", "-20px"],
  );

  const text3Op = useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1]);
  const text3Y = useTransform(scrollYProgress, [0.75, 0.85], ["20px", "0px"]);

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const imgUrl =
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=2400";

  return (
    <section
      ref={containerRef}
      className="h-[400vh] bg-stone-100 relative z-30"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden bg-stone-100 text-charcoal shadow-2xl">
        <div className="w-full md:w-1/3 h-[40vh] md:h-full relative flex items-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-charcoal/10 overflow-hidden bg-stone-100/90 backdrop-blur-md z-30">
          <div className="absolute left-8 md:left-16 top-24 bottom-24 w-px bg-charcoal/10">
            <motion.div
              style={{ height: progressHeight }}
              className="w-full bg-charcoal origin-top flex flex-col justify-end items-center"
            >
              <div className="w-2 h-2 rounded-full border border-charcoal bg-stone-100 translate-y-1"></div>
            </motion.div>
          </div>

          <div className="relative w-full ml-8 md:ml-12 h-full flex flex-col justify-center">
            <motion.div
              style={{ opacity: text1Op, y: text1Y }}
              className="absolute inset-x-0 font-serif"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 mb-6 flex items-center gap-3">
                Phase 01 &mdash; The Sketch
              </div>
              <h3 className="text-3xl md:text-5xl leading-tight mb-6 tracking-tighter">
                Tracing <span className="italic text-stone-500">Volume</span>
              </h3>
              <p className="font-sans text-sm md:text-base font-light leading-relaxed text-stone-600 md:pr-12">
                Every structure begins as a kinetic motion of the hand. We
                search for raw geometry, testing the boundaries of light and
                mass before physics demands a compromise.
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: text2Op, y: text2Y }}
              className="absolute inset-x-0 font-serif pointer-events-none"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-700 mb-6 flex items-center gap-3">
                Phase 02 &mdash; Schematic
              </div>
              <h3 className="text-3xl md:text-5xl leading-tight mb-6 tracking-tighter text-charcoal">
                Structural <span className="italic text-cyan-800">Truth</span>
              </h3>
              <p className="font-sans text-sm md:text-base font-light leading-relaxed text-stone-600 md:pr-12">
                Translating intention into absolute precision. Here, we define
                the Cartesian grid, calculate load distributions, and
                orchestrate the invisible circulatory systems of the building.
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: text3Op, y: text3Y }}
              className="absolute inset-x-0 font-serif pointer-events-none"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 mb-6 flex items-center gap-3">
                Phase 03 &mdash; Reality
              </div>
              <h3 className="text-3xl md:text-5xl leading-tight mb-6 tracking-tighter">
                Built <span className="italic text-stone-500">Permanence</span>
              </h3>
              <p className="font-sans text-sm md:text-base font-light leading-relaxed text-stone-600 md:pr-12">
                The inevitable massing of materials. Ideas calcify into
                concrete, steel, and glass&mdash;establishing a permanent and
                commanding dialogue with their geographical context.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="w-full md:w-2/3 h-[60vh] md:h-full relative overflow-hidden bg-charcoal isolate z-10">
          {/* Base Layer: 03 Reality */}
          <div className="absolute inset-0 z-0">
            <img
              src={imgUrl}
              alt="Final Structure"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 mix-blend-multiply pointer-events-none"></div>
          </div>

          {/* Middle Layer: 02 Blueprint */}
          <motion.div
            style={{ clipPath: blueprintClipPath }}
            className="absolute inset-0 z-10 bg-[#061124] overflow-hidden"
          >
            <img
              src={imgUrl}
              alt="Blueprint Mask"
              className="w-full h-full object-cover opacity-60 mix-blend-lighten filter invert grayscale contrast-[1.2] brightness-125 saturate-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-color"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none"></div>

            <div className="absolute top-[20%] left-[10%] right-[10%] h-[1px] bg-cyan-400/30 flex justify-between items-center text-[8px] font-mono text-cyan-400/50 uppercase tracking-widest">
              <span className="-translate-y-4">Elev. 34.20M</span>
              <span className="-translate-y-4">Section AA</span>
            </div>
            <div className="absolute top-[60%] left-[10%] right-[10%] h-[1px] bg-cyan-400/30"></div>
            <div className="absolute top-[20%] bottom-[20%] left-[25%] w-[1px] bg-cyan-400/30"></div>
            <div className="absolute top-[20%] bottom-[20%] right-[25%] w-[1px] bg-cyan-400/30"></div>
          </motion.div>

          {/* Top Layer: 01 Sketch */}
          <motion.div
            style={{ clipPath: sketchClipPath }}
            className="absolute inset-0 z-20 bg-[#e3e1db] overflow-hidden"
          >
            <img
              src={imgUrl}
              alt="Sketch Mask"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay filter grayscale contrast-[2] brightness-[0.8]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-noise opacity-40 mix-blend-multiply"></div>
            <svg
              className="absolute inset-0 w-full h-full opacity-30 pointer-events-none stroke-charcoal mix-blend-multiply"
              strokeWidth="1"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M -10 10 L 110 90 M 20 -10 L 100 110 M -10 20 L 90 110"
                strokeWidth="0.5"
                className="hidden md:block"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 50 0 L 50 100 C 60 80 40 60 50 50"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="5,10"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                strokeDasharray="2,6"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
              <path 
                d="M 0 50 L 100 50" 
                strokeWidth="0.5" 
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-charcoal/20 font-serif italic text-4xl transform -rotate-12 select-none mix-blend-multiply border border-charcoal/20 p-8 pt-10 rounded-sm">
              Study <br />
              #04
            </div>
          </motion.div>

          {/* Scanner Lines */}
          <motion.div
            style={{ left: sketchClip, opacity: sketchScannerOp }}
            className="absolute top-0 bottom-0 w-[1px] bg-charcoal/50 z-[25] shadow-[0_0_15px_rgba(0,0,0,0.3)] pointer-events-none"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 rounded-full border border-charcoal bg-[#e3e1db]"></div>
            <div className="absolute top-1/4 -translate-y-1/2 left-4 text-[8px] font-mono text-charcoal tracking-widest rotate-90 origin-left whitespace-nowrap hidden md:block">
              SCAN_TO_SCHEMATIC
            </div>
          </motion.div>

          <motion.div
            style={{ left: blueprintClip, opacity: blueprintScannerOp }}
            className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 z-[15] shadow-[0_0_30px_rgba(34,211,238,0.8)] pointer-events-none"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -left-[3px] w-2 h-2 bg-cyan-400 skew-x-12"></div>
            <div className="absolute top-3/4 -translate-y-1/2 right-4 text-[8px] font-mono text-cyan-400 tracking-widest -rotate-90 origin-right whitespace-nowrap drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] hidden md:block">
              RENDER_COMPUTE_ENGINE
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function IntegratedExpertiseSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const activeIndexFramer = useTransform(
    scrollYProgress,
    [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
    [0, 0, 1, 2, 3, 3, 3],
  );

  const [active, setActive] = useState(0);

  useMotionValueEvent(activeIndexFramer, "change", (latest) => {
    setActive(Math.round(latest));
  });

  const gap = useTransform(scrollYProgress, [0, 0.2], [0, 80]); // Full scroll gap between layers
  const gapSpring = useSpring(gap, { stiffness: 100, damping: 20 });

  const z0 = useTransform(gapSpring, (v) => v * -1.5);
  const z1 = useTransform(gapSpring, (v) => v * -0.5);
  const z2 = useTransform(gapSpring, (v) => v * 0.5);
  const z3 = useTransform(gapSpring, (v) => v * 1.5);

  const disciplines = [
    {
      id: "01",
      title: "Architecture & Flow",
      desc: "The experiential boundary. We design the volumetric sequence, orchestrating natural light, human proportion, and spatial rhythm into a cohesive form.",
      z: z3, // Top
      theme: "white",
      content: (
        <svg className="w-full h-full opacity-80" viewBox="0 0 100 100">
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="1"
          />
          <path
            d="M10,40 L60,40 L60,10"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="1"
          />
          <path
            d="M70,90 L70,60 L90,60"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="1"
          />
          <circle
            cx="60"
            cy="40"
            r="8"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="0.5"
            strokeDasharray="1 2"
          />
          <circle cx="50" cy="50" r="3" fill="#e7e5e4" />
          <path
            d="M10,5 L90,5"
            fill="none"
            stroke="#a8a29e"
            strokeWidth="0.2"
          />
          <text
            x="50"
            y="4.5"
            fontSize="2.5"
            fill="#a8a29e"
            textAnchor="middle"
            fontFamily="monospace"
          >
            AXIS / 12000 MM
          </text>
        </svg>
      ),
    },
    {
      id: "02",
      title: "Structural Engineering",
      desc: "The tectonic skeleton. Resolving complex gravitational and lateral forces while expressing the physical load paths as primary aesthetic elements.",
      z: z2,
      theme: "orange",
      content: (
        <svg className="w-full h-full opacity-70" viewBox="0 0 100 100">
          <pattern
            id="gridPat"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="#f97316"
              strokeWidth="0.1"
            />
          </pattern>
          <rect width="100" height="100" fill="url(#gridPat)" />
          <path
            d="M20,20 L80,80 M20,80 L80,20"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.5"
          />
          <rect x="18" y="18" width="4" height="4" fill="#f97316" />
          <rect x="78" y="18" width="4" height="4" fill="#f97316" />
          <rect x="18" y="78" width="4" height="4" fill="#f97316" />
          <rect x="78" y="78" width="4" height="4" fill="#f97316" />
          <rect
            x="48"
            y="48"
            width="4"
            height="4"
            fill="#f97316"
            className="animate-pulse"
          />
        </svg>
      ),
    },
    {
      id: "03",
      title: "MEP Coordination",
      desc: "The nervous system. Embedding mechanical, electrical, and plumbing infrastructure flawlessly into the structure without sacrificing visual purity.",
      z: z1,
      theme: "cyan",
      content: (
        <svg className="w-full h-full opacity-70" viewBox="0 0 100 100">
          <path
            d="M10,10 L30,10 L40,20 L40,80 L60,80"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
          />
          <circle cx="10" cy="10" r="1.5" fill="#06b6d4" />
          <circle cx="60" cy="80" r="1.5" fill="#06b6d4" />
          <path
            d="M90,90 L70,90 L60,80 L60,20 L40,20"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <circle cx="90" cy="90" r="1.5" fill="#06b6d4" />
          <path
            d="M20,50 L80,50"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <rect
            x="45"
            y="45"
            width="10"
            height="10"
            stroke="#06b6d4"
            fill="none"
            strokeWidth="0.4"
          />
        </svg>
      ),
    },
    {
      id: "04",
      title: "Energy & Environmental",
      desc: "The organic synthesis. Engineering passive thermal regulation, optimizing solar gain, and ensuring the architecture functions as a regenerative ecological engine.",
      z: z0, // Bottom
      theme: "green",
      content: (
        <svg className="w-full h-full opacity-70" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="heat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#heat)" />
          <path
            d="M-10,50 Q25,30 50,50 T110,50"
            fill="none"
            stroke="#22c55e"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <path
            d="M-10,70 Q25,50 50,70 T110,70"
            fill="none"
            stroke="#22c55e"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <path
            d="M-10,30 Q25,10 50,30 T110,30"
            fill="none"
            stroke="#22c55e"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <circle
            cx="80"
            cy="20"
            r="8"
            stroke="#22c55e"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="1 1"
          />
          <circle cx="80" cy="20" r="2" fill="#22c55e" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="h-[400vh] bg-[#0a0a0a] relative z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden isolate">
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>

        {/* Left Side: Editorial Content */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-20">
          <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-stone-400 mb-8 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-stone-400" />
            Integrated Expertise
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tighter text-white mb-12">
            Total <br />{" "}
            <span className="italic text-stone-500">Synthesis</span>
          </h2>

          <div className="flex flex-col gap-6 md:gap-10 max-w-xl">
            {disciplines.map((disc, i) => {
              const isActive = active === i;
              return (
                <div
                  key={i}
                  className={`transition-all duration-700 border-l-2 pl-6 md:pl-8 py-2 ${isActive ? "opacity-100 border-white" : "opacity-30 border-white/20"}`}
                >
                  <h4
                    className={`text-2xl md:text-3xl font-serif tracking-tight mb-3 flex items-center gap-4 ${isActive ? "text-white" : "text-stone-400"}`}
                  >
                    <span className="font-mono text-xs md:text-sm text-stone-500">
                      {disc.id}
                    </span>{" "}
                    {disc.title}
                  </h4>
                  <div
                    className={`grid transition-all duration-700 ease-in-out ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <p className="font-sans text-sm md:text-base font-light text-stone-300 leading-relaxed md:pr-12 overflow-hidden">
                      {disc.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: 3D Exploded Axonometric View */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex items-center justify-center p-4">
          {/* Ambient underlying grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] perspective-[2000px] pointer-events-none">
            <motion.div
              initial={{ rotateX: 65, rotateZ: -45 }}
              animate={{ rotateX: 65, rotateZ: -45 }}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Render Bottom to Top (Energy -> Arch) to ensure DOM stacking supplements Z-depth */}
              {[...disciplines].reverse().map((disc) => {
                const ogIndex = disciplines.indexOf(disc);
                const isActive = active === ogIndex;

                let colorThemeStr = "";
                let borderThemeStr = "";
                let textThemeStr = "";
                if (disc.theme === "white") {
                  colorThemeStr = "bg-stone-100/5";
                  borderThemeStr = "border-stone-100/30";
                  textThemeStr = "text-stone-100";
                }
                if (disc.theme === "orange") {
                  colorThemeStr = "bg-orange-500/5";
                  borderThemeStr = "border-orange-500/30";
                  textThemeStr = "text-orange-500";
                }
                if (disc.theme === "cyan") {
                  colorThemeStr = "bg-cyan-500/5";
                  borderThemeStr = "border-cyan-500/30";
                  textThemeStr = "text-cyan-500";
                }
                if (disc.theme === "green") {
                  colorThemeStr = "bg-green-500/5";
                  borderThemeStr = "border-green-500/30";
                  textThemeStr = "text-green-500";
                }

                return (
                  <motion.div
                    key={disc.id}
                    style={{ z: disc.z }}
                    className={`absolute inset-0 border ${colorThemeStr} ${isActive ? borderThemeStr.replace("30", "80") : borderThemeStr} backdrop-blur-[2px] flex items-center justify-center transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.1)]`}
                    animate={{
                      opacity: isActive ? 1 : 0.15,
                    }}
                  >
                    {disc.content}

                    {/* Corner Framing Elements */}
                    <div
                      className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${borderThemeStr} ${isActive ? "opacity-100" : "opacity-50"} -translate-x-1 -translate-y-1 transition-opacity duration-700`}
                    ></div>
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${borderThemeStr} ${isActive ? "opacity-100" : "opacity-50"} translate-x-1 translate-y-1 transition-opacity duration-700`}
                    ></div>

                    {/* Layer Label */}
                    <div
                      className={`absolute top-4 left-4 text-[7px] md:text-[9px] font-mono tracking-widest ${textThemeStr} uppercase ${isActive ? "opacity-100" : "opacity-50"} transition-opacity duration-700`}
                    >
                      L-0{ogIndex + 1}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left - 160,
        y: e.clientY - rect.top - 200,
      });
    }
  };

  const smoothX = useSpring(mousePos.x, {
    damping: 25,
    stiffness: 200,
    mass: 1,
  });
  const smoothY = useSpring(mousePos.y, {
    damping: 25,
    stiffness: 200,
    mass: 1,
  });

  const services = [
    {
      title: "Residential Architecture",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1000",
    },
    {
      title: "Interior Orchestration",
      img: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=85&w=1000",
    },
    {
      title: "Bespoke Extensions",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=85&w=1000",
    },
    {
      title: "Commercial Spaces",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=85&w=1000",
    },
  ];

  return (
    <section
      id="expertise"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-32 lg:py-48 bg-charcoal relative overflow-hidden z-30"
    >
      {/* Feature 6: Abstract Floating Monoliths */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20 mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          <AbstractGeometry />
        </Canvas>
      </div>
      <motion.div
        className="pointer-events-none absolute left-0 w-80 aspect-[3/4] z-[100] overflow-hidden hidden md:block shadow-2xl"
        style={{ x: smoothX, y: smoothY, top: 0 }}
      >
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              initial={{
                clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
                opacity: 0,
              }}
              animate={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                opacity: 1,
              }}
              exit={{
                clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
                opacity: 0,
              }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={services[hoveredIdx].img}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20">
        <div className="mb-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500 mb-6 block">
            Our Expertise
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white max-w-2xl">
            Disciplines of{" "}
            <span className="italic text-stone-400">Excellence</span>
          </h2>
        </div>

        <div className="border-t border-white/10 relative pt-px">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-px bg-white origin-left"
          />
          {services.map((service, idx) => {
            const isActive = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                data-cursor="hover"
                className={`group border-b py-8 lg:py-12 px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] z-30 relative overflow-hidden ${
                  isActive
                    ? "bg-stone-50 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] scale-[1.02] lg:scale-[1.03] lg:-mx-12 border-transparent"
                    : "bg-transparent border-white/10"
                }`}
              >
                <div className="flex items-center gap-8 lg:gap-16 w-full relative z-10 h-full">
                  <span
                    className={`font-mono text-xs w-8 hidden md:block transition-colors duration-500 ${isActive ? "text-stone-400" : "text-stone-500"}`}
                  >
                    0{idx + 1}
                  </span>
                  <h3
                    className={`font-serif text-3xl md:text-5xl lg:text-6xl transition-colors duration-500 tracking-tight flex-1 flex items-center h-full ${isActive ? "text-stone-900 font-medium" : "text-stone-500 font-light group-hover:text-stone-300"}`}
                  >
                    {service.title}
                  </h3>
                </div>

                <div className="relative z-10 hidden md:flex items-center justify-end w-24 h-full">
                  <ArrowRight
                    className={`w-8 h-8 transition-all duration-700 ease-[0.16,1,0.3,1] ${isActive ? "text-charcoal opacity-100 translate-x-0 scale-100" : "text-white opacity-0 -translate-x-12 scale-75"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <footer
      ref={ref}
      onMouseMove={handleMouseMove}
      id="contact"
      className="bg-charcoal text-stone-50 pt-32 pb-12 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-blueprint-dark opacity-10 pointer-events-none z-0"></div>

      {/* Feature: Abstract Schematic X-Ray Mask on Footer hover */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none mix-blend-overlay z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="footer-blueprint"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="white"
            strokeWidth="0.2"
          />
          <path
            d="M 0 0 L 100 100 M 100 0 L 0 100"
            fill="none"
            stroke="white"
            strokeWidth="0.2"
          />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#footer-blueprint)"
        />
      </svg>
      {/* Feature: Cinematic Footer Spotlight */}
      <motion.div
        animate={{ x: mousePos.x - 400, y: mousePos.y - 400 }}
        className="absolute top-0 left-0 w-[800px] h-[800px] pointer-events-none opacity-0 group-hover:opacity-100 mix-blend-screen z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)",
        }}
      >
        <div className="w-full h-full border border-white/10 rounded-full scale-[0.3]"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/10"></div>
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/10"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-32 flex flex-col items-center">
          <h2 className="font-serif text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] text-white mb-16 mix-blend-overlay">
            Let's Shape <br />
            <span className="italic font-light text-stone-400">
              The Future.
            </span>
          </h2>

          <MagneticButton>
            <a
              href="mailto:info@diagramx.uk"
              data-cursor="hover"
              className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-stone-50 text-charcoal font-semibold text-xs tracking-widest uppercase hover:scale-110 transition-transform duration-500"
            >
              Start a Project
            </a>
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-stone-800 text-sm">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-smoke">
              Contact
            </span>
            <a
              href="mailto:info@diagramx.uk"
              className="hover:text-white transition-colors hover-line-through w-max"
            >
              info@diagramx.uk
            </a>
            <a
              href="tel:+4407974143456"
              className="hover:text-white transition-colors hover-line-through w-max"
            >
              +44 (0) 7974 143 456
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-smoke">
              Studio
            </span>
            <p className="text-stone-300 pointer-events-none">
              The Design House
              <br />
              Chelsea, London
              <br />
              SW3 5QX
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-12">
            <div className="flex gap-8">
              <a
                href="#"
                className="text-xs uppercase tracking-widest hover:text-white transition-colors hover-line-through"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-xs uppercase tracking-widest hover:text-white transition-colors hover-line-through"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex gap-4 text-smoke text-xs pointer-events-none">
              <span>&copy; {new Date().getFullYear()} DiagramX</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AbstractGeometry() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[-4, 0, 0]}>
        <octahedronGeometry args={[2, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.1}
        />
      </mesh>
      <mesh position={[4, 2, -2]}>
        <boxGeometry args={[1.5, 3, 1.5]} />
        <meshStandardMaterial color="#292524" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -2, 2]}>
        <torusGeometry args={[1.5, 0.4, 16, 100]} />
        <meshPhysicalMaterial color="#d6d3d1" clearcoat={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function GlobalClocks() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(time);
    } catch {
      return "00:00:00";
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[145] text-[9px] font-mono mix-blend-difference text-white opacity-50 gap-6 pointer-events-none hidden md:flex">
      <div className="w-20">LON {formatTime("Europe/London")}</div>
      <div className="w-20">NYC {formatTime("America/New_York")}</div>
      <div className="w-20">TYO {formatTime("Asia/Tokyo")}</div>
    </div>
  );
}

function MagneticLink({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.2;
    const y = (e.clientY - (top + height / 2)) * 0.2;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function IBeamScrollbar() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-[2px] h-1/2 z-[160] hidden lg:block mix-blend-difference pointer-events-none">
      <div className="absolute inset-0 bg-white/10"></div>
      <motion.div
        style={{ height, top: 0 }}
        className="absolute w-full bg-white"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-white bg-transparent rounded-full opacity-50 shadow-[0_0_10px_white]"></div>
      </motion.div>
    </div>
  );
}

function ManifestoSection() {
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = (containerRef.current as HTMLElement).getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - Math.max(0, rect.top),
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[150vh] w-full bg-black z-20"
    >
      <div
        onMouseMove={handleMouseMove}
        className="sticky top-0 h-screen w-full bg-black overflow-hidden flex items-center justify-center text-stone-50 shadow-2xl rounded-b-[40px] cursor-none"
      >
        {/* Autogenous SVG Blueprint */}
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M10,90 L10,10 L90,10 L90,90 Z M10,30 L90,30 M30,10 L30,90 M70,10 L70,90 M40,40 L60,40 L60,60 L40,60 Z"
            stroke="#ffffff"
            strokeWidth="0.1"
            fill="none"
            style={{ pathLength }}
          />
          <motion.path
            d="M0,0 L100,100 M0,100 L100,0"
            stroke="#ffffff"
            strokeWidth="0.05"
            fill="none"
            style={{ pathLength }}
          />
        </motion.svg>

        <div className="relative z-20 max-w-5xl px-6 text-center select-none">
          <span className="text-[10px] md:text-[11px] uppercase font-mono tracking-[0.3em] mb-12 block text-stone-500">
            The Manifesto
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tighter text-stone-500 bg-clip-text text-transparent bg-gradient-to-r from-stone-500/30 to-stone-500/20">
            Architecture is the physical <br />
            <span className="italic font-light text-stone-500/30">
              manifestation
            </span>{" "}
            of human intention.
          </h2>
        </div>

        {/* Spotlight Masking Layer */}
        <div
          className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center transition-all duration-75"
          style={{
            maskImage: `radial-gradient(circle 250px at ${mouse.x}px ${mouse.y}px, black 10%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 250px at ${mouse.x}px ${mouse.y}px, black 10%, transparent 100%)`,
          }}
        >
          <div className="relative z-20 max-w-5xl px-6 text-center w-full h-full flex flex-col justify-center items-center bg-black">
            <span className="text-[10px] md:text-xs uppercase font-mono tracking-[0.3em] mb-12 block text-stone-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              The Manifesto
            </span>
            <motion.h2
              style={{
                background: useTransform(
                  scrollYProgress,
                  [0.4, 0.6],
                  [
                    "linear-gradient(to right, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 0%)",
                    "linear-gradient(to right, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 100%)",
                  ],
                ),
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Architecture is the physical <br />
              <span className="italic font-light">manifestation</span> of human
              intention.
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteContextSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax and fading for the background map
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const mapOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
  );

  // Overlay Opacities
  const topoOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.7, 0.8],
    [0, 1, 1, 0],
  );
  const solarOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.7, 0.8],
    [0, 1, 1, 0],
  );
  const windOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 0.8],
    [0, 1, 1, 0],
  );

  // Labels translations
  const topoY = useTransform(scrollYProgress, [0.1, 0.2], [20, 0]);
  const solarY = useTransform(scrollYProgress, [0.3, 0.4], [20, 0]);
  const windY = useTransform(scrollYProgress, [0.5, 0.6], [20, 0]);

  const mapUrl =
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=85&w=2400";

  return (
    <section ref={containerRef} className="h-[300vh] bg-charcoal relative z-20">
      <div className="sticky top-0 h-screen w-full bg-charcoal flex flex-col md:flex-row overflow-hidden text-stone-100 shadow-[0_-30px_60px_rgba(0,0,0,0.5)]">
        {/* Editorial Left Side */}
        <div className="w-full md:w-1/3 h-[40vh] md:h-full relative flex flex-col justify-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden bg-charcoal/90 backdrop-blur-md z-30">
          <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-cyan-500 mb-6 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
            Macro Context
          </div>

          <h3 className="text-4xl md:text-6xl font-serif tracking-tighter mb-8 leading-[1.1]">
            Site <br />
            <span className="italic text-stone-500">Intelligence</span>
          </h3>

          <p className="font-sans text-sm md:text-base font-light text-stone-300 leading-relaxed border-l-2 border-white/20 pl-6 py-2 relative max-w-md">
            <span className="absolute -left-[2px] top-0 w-1 h-1 bg-white"></span>
            A structure cannot exist in isolation. We analyze topography, solar
            trajectories, and microclimates mathematically before placing a
            single wall. Form is dictated by geography.
            <span className="absolute -left-[2px] bottom-0 w-1 h-1 bg-white"></span>
          </p>

          <div className="mt-16 text-[9px] font-mono text-stone-500 uppercase tracking-[0.2em] flex flex-col gap-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Elevation Level</span>
              <span className="text-white">+ 420.5m</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Solar Exposure</span>
              <span className="text-white">Optimal SSW</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Prevailing Wind</span>
              <span className="text-white">NW &middot; 14 knots</span>
            </div>
          </div>
        </div>

        {/* Tactical Map Right Side */}
        <div className="w-full md:w-2/3 h-[60vh] md:h-full relative overflow-hidden bg-black isolate z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          <motion.div
            style={{ scale: mapScale, opacity: mapOpacity }}
            className="absolute inset-0 z-0"
          >
            <img
              src={mapUrl}
              alt="Satellite Topography"
              className="w-full h-full object-cover filter grayscale contrast-125 brightness-50 mix-blend-screen opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-charcoal mix-blend-multiply"></div>
          </motion.div>

          {/* Central Site Marker */}
          <div className="absolute z-40 w-32 h-32 flex items-center justify-center pointer-events-none">
            <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping"
              style={{ animationDuration: "3s" }}
            ></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-400/30 -translate-x-1/2"></div>
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-400/30 -translate-y-1/2"></div>
            <span className="absolute top-2 right-2 text-[8px] font-mono text-cyan-400 tracking-widest bg-charcoal/50 px-1 backdrop-blur-sm">
              TARGET_SITE
            </span>
          </div>

          {/* Layer 1: Topography */}
          <motion.div
            style={{ opacity: topoOpacity }}
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          >
            <svg
              className="w-full h-full stroke-orange-500/30 mix-blend-screen"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
              strokeWidth="0.1"
              fill="none"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="50"
                  rx={10 + i * 8}
                  ry={6 + i * 5}
                  transform={`rotate(${i * 12} 50 50)`}
                />
              ))}
            </svg>
            <motion.span
              style={{ y: topoY }}
              className="absolute bottom-[25%] left-[20%] text-[8px] font-mono uppercase tracking-[0.3em] text-orange-500/80 bg-black/50 px-2 py-1 backdrop-blur border border-orange-500/20"
            >
              01 &middot; Topographic Mapping
            </motion.span>
          </motion.div>

          {/* Layer 2: Solar Path */}
          <motion.div
            style={{ opacity: solarOpacity }}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          >
            <svg
              className="w-[80%] h-[80%] overflow-visible"
              viewBox="0 0 100 100"
            >
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(250,204,21,0.2)"
                strokeWidth="0.2"
                strokeDasharray="1,1"
              />
              <path
                d="M 20 60 A 45 45 0 0 1 80 60"
                fill="none"
                stroke="rgba(250,204,21,0.4)"
                strokeWidth="0.2"
              />
              {/* Sun Nodes */}
              <circle cx="20" cy="60" r="1" fill="#facc15" />
              <circle
                cx="50"
                cy="15"
                r="1"
                fill="#facc15"
                className="shadow-[0_0_10px_#facc15]"
              />
              <circle cx="80" cy="60" r="1" fill="#facc15" />
            </svg>
            <motion.span
              style={{ y: solarY }}
              className="absolute bottom-[20%] right-[20%] text-[8px] font-mono uppercase tracking-[0.3em] text-yellow-500/80 bg-black/50 px-2 py-1 backdrop-blur border border-yellow-500/20 text-right"
            >
              02 &middot; Solar Trajectory [Summer Solstice]
            </motion.span>

            {/* Angle Measurements */}
            <div className="absolute top-[30%] left-[50%] h-px w-32 bg-yellow-400/20 origin-left -rotate-45"></div>
            <span className="absolute top-[28%] left-[65%] text-[7px] font-mono text-yellow-500/70">
              72.5&deg; ELEV // 12:00 PM
            </span>
          </motion.div>

          {/* Layer 3: Prevailing Wind */}
          <motion.div
            style={{ opacity: windOpacity }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            <div className="absolute top-[15%] left-[20%] flex flex-col gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center text-cyan-400/40 text-[8px] gap-2 transform translate-x-8 origin-left -rotate-12 w-48"
                >
                  <span className="h-px bg-current flex-1"></span>
                  <span>&gt;</span>
                </div>
              ))}
            </div>
            <motion.span
              style={{ y: windY }}
              className="absolute top-[10%] left-[20%] text-[8px] font-mono uppercase tracking-[0.3em] text-cyan-400/80 bg-black/50 px-2 py-1 backdrop-blur border border-cyan-400/20"
            >
              03 &middot; Prevailing Microclimate
            </motion.span>
          </motion.div>

          {/* Scale Bar */}
          <div className="absolute bottom-6 left-6 md:left-auto md:right-12 flex flex-col gap-1 items-end z-40 opacity-50">
            <div className="flex gap-4 items-end h-2 border-b border-white/40">
              <div className="h-full w-px bg-white/40"></div>
              <div className="h-1/2 w-px bg-white/40"></div>
              <div className="h-full w-px bg-white/40"></div>
              <div className="h-1/2 w-px bg-white/40"></div>
              <div className="h-full w-px bg-white/40 mr-12"></div>
            </div>
            <span className="text-[7px] font-mono text-white tracking-[0.2em]">
              0 &mdash; 50M &mdash; 100M
            </span>
          </div>

          {/* Coordinates */}
          <div className="absolute top-6 left-6 text-[8px] font-mono text-white/40 tracking-[0.2em] transform origin-top-left flex flex-col">
            <span>LAT 45.4642 N</span>
            <span>LNG 9.1900 E</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MaterialitySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMat, setActiveMat] = useState<number | null>(0);

  const materials = [
    {
      name: "Cast Concrete",
      desc: "Raw, unyielding structure. Establishing a permanent and commanding dialogue.",
      spec: "Density: 2400 kg/m³",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=85&w=2000",
    },
    {
      name: "Travertine Stone",
      desc: "Timeless warmth and texture. Echoing archaic geology through precise cuts.",
      spec: "Finish: Honed & Filled",
      img: "https://images.unsplash.com/photo-1618219744061-9b7f25e8a56a?q=85&w=2000",
    },
    {
      name: "Ribbed Glass",
      desc: "Luminous distortion. Filtering light while protecting privacy and mystery.",
      spec: "Transmittance: 85%",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=2000",
    },
    {
      name: "Oak Timber",
      desc: "Living geometry. Introducing biological warmth into the Cartesian grid.",
      spec: "Grain: Rift Sawn",
      img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=85&w=2000",
    },
    {
      name: "Corten Steel",
      desc: "Oxidized permanence. A material that matures, recording atmospheric time.",
      spec: "Alloy: Weathering",
      img: "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=85&w=2000",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="h-screen w-full bg-[#121212] text-white flex flex-col z-20 sticky top-0 overflow-hidden shadow-2xl rounded-t-[40px]"
    >
      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none"></div>

      {/* Header */}
      <div className="pt-24 px-6 md:px-12 flex justify-between items-end pb-8 relative z-10 shrink-0">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-stone-500 mb-4 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full border border-white"></div>
            Tactile Context
          </span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tighter">
            Material <span className="italic text-stone-400">Palette</span>
          </h2>
        </div>
        <div className="text-[10px] font-mono tracking-widest text-stone-500 text-right hidden md:block">
          Selection & Specification
          <br />
          Studio Library
        </div>
      </div>

      {/* Accordion */}
      <div className="flex-1 flex w-full relative z-10 p-6 md:p-12 pt-0 gap-2 md:gap-4 pb-12">
        {materials.map((mat, i) => {
          const isActive = activeMat === i;
          return (
            <motion.div
              layout
              key={i}
              onMouseEnter={() => setActiveMat(i)}
              onClick={() => setActiveMat(i)}
              className="relative h-full overflow-hidden cursor-pointer rounded-sm transition-all ease-out"
              animate={{
                flex: isActive ? 6 : 1,
                filter: isActive
                  ? "grayscale(0%) contrast(1.1) brightness(1)"
                  : "grayscale(100%) contrast(0.8) brightness(0.6)",
              }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              style={{ flexBasis: "0" }}
              data-cursor="hover"
            >
              {/* Image */}
              <motion.img
                src={mat.img}
                alt={mat.name}
                className="absolute inset-0 w-full h-[150%] object-cover origin-center"
                animate={{
                  scale: isActive ? 1 : 1.15,
                  y: isActive ? "0%" : "-10%",
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0 transition-opacity duration-700 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/80"
                style={{ opacity: isActive ? 1 : 0.4 }}
              ></div>

              {/* Vertical Title (Inactive) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-end justify-center pb-8"
                  >
                    <span
                      className="text-[10px] font-mono tracking-[0.2em] transform -rotate-180 whitespace-nowrap text-stone-300"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {mat.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <motion.span
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-mono text-[9px] uppercase tracking-widest border border-white/20 px-3 py-1.5 bg-black/20 backdrop-blur-md text-white/80 hidden md:block"
                      >
                        {mat.spec}
                      </motion.span>
                      <span className="font-mono text-[10px] tracking-widest text-white/50 ml-auto block">
                        0{i + 1}
                      </span>
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      <h3 className="text-3xl md:text-5xl lg:text-7xl font-serif tracking-tighter mb-4 md:mb-6">
                        {mat.name}
                      </h3>
                      <p className="font-mono text-[9px] md:text-[10px] tracking-widest text-white/70 uppercase max-w-md w-[80%] leading-loose border-l flex flex-col border-white/20 pl-4 py-1 relative">
                        <span className="absolute -left-1 top-0 w-2 h-px bg-white"></span>
                        {mat.desc}
                        <span className="absolute -left-1 bottom-0 w-2 h-px bg-white"></span>
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function TimelineSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const timelineSteps = [
    {
      num: "01",
      category: "Discovery",
      title: "Site Consultation",
      desc: "Assessing topographic reality, atmospheric conditions, and client intent to establish a rigorous feasibility matrix.",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1400",
    },
    {
      num: "02",
      category: "Form Finding",
      title: "Spatial Massing",
      desc: "Translating program into volume. We sculpt initial raw geometry using light, shadow, and primitive structural forms.",
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=85&w=1400",
    },
    {
      num: "03",
      category: "Architecture",
      title: "Master Planning",
      desc: "Codifying the circulation. Defining the Cartesian grid, load paths, and the exact dimensional relationships of the layout.",
      img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=85&w=1400",
    },
    {
      num: "04",
      category: "Micro Scale",
      title: "Technical Detailing",
      desc: "God is in the intersection. Engineering tectonic connections, material transitions, and hyper-precise micro-resolutions.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=85&w=1400",
    },
    {
      num: "05",
      category: "Integration",
      title: "Systems Coordination",
      desc: "Synchronizing mechanical, electrical, and structural systems organically within the architectural cavity without visual compromise.",
      img: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=85&w=1400",
    },
    {
      num: "06",
      category: "Completion",
      title: "Physical Handover",
      desc: "The transition from theoretical diagram to permanent reality. The architecture ceases to be a drawing and becomes a living organism.",
      img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=85&w=1400",
    },
  ];

  const totalHeight = `${timelineSteps.length * 100}vh`;

  return (
    <section
      ref={containerRef}
      style={{ height: totalHeight }}
      className="bg-[#0a0a0a] relative z-20"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center isolate perspective-[1200px]">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* HUD Elements */}
        <div className="absolute top-8 left-6 md:left-12 flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
          <div className="w-8 h-px bg-white/40"></div>
          Project Chronology
        </div>

        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 text-[9px] font-mono uppercase tracking-widest text-white/30 hidden md:flex">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span>{step.category}</span>
              <span className="w-4 h-px bg-white/20"></span>
            </div>
          ))}
          <motion.div
            style={{
              y: useTransform(
                scrollYProgress,
                [0, 1],
                ["0%", `${(timelineSteps.length - 1) * 100}%`],
              ),
            }}
            className="absolute right-0 top-0 w-4 h-px bg-white z-10 hidden md:block"
          />
        </div>

        {/* Spatial Cards */}
        {timelineSteps.map((step, i) => {
          const stepSize = 1 / timelineSteps.length;
          // Calculate exactly when this card should be fully in center
          const centerPos = i * stepSize + stepSize / 2;

          // Card states: Deep Background -> Center Foreground -> Flown Past
          const scale = useTransform(
            scrollYProgress,
            [centerPos - stepSize * 1.5, centerPos, centerPos + stepSize].map(v => Math.max(0, Math.min(1, v))),
            [0.6, 1, 1.4],
          );
          const opacity = useTransform(
            scrollYProgress,
            [
              centerPos - stepSize,
              centerPos,
              centerPos + stepSize / 2,
              centerPos + stepSize,
            ].map(v => Math.max(0, Math.min(1, v))),
            [0, 1, 1, 0],
          );
          const blurNum = useTransform(
            scrollYProgress,
            [centerPos - stepSize * 1.2, centerPos, centerPos + stepSize].map(v => Math.max(0, Math.min(1, v))),
            [15, 0, 15],
          );
          const filter = useTransform(blurNum, (val) => `blur(${val}px)`);
          const y = useTransform(
            scrollYProgress,
            [centerPos - stepSize, centerPos, centerPos + stepSize].map(v => Math.max(0, Math.min(1, v))),
            ["20vh", "0vh", "-30vh"],
          );

          return (
            <motion.div
              key={i}
              style={{
                scale,
                opacity,
                filter,
                y,
                transformStyle: "preserve-3d",
              }}
              className="absolute w-[90%] md:w-[75%] max-w-5xl shadow-[0_30px_100px_rgba(0,0,0,1)] bg-[#eceae6] border border-stone-300 flex flex-col md:flex-row will-change-transform"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-[30vh] md:h-[60vh] relative overflow-hidden group border-b md:border-b-0 md:border-r border-stone-300 p-2 md:p-4">
                <div className="w-full h-full relative overflow-hidden bg-stone-300 isolate">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover filter grayscale sepia-[0.3] contrast-125"
                    referrerPolicy="no-referrer"
                  />
                  {/* Analytical Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] mix-blend-overlay pointer-events-none"></div>
                  <div className="absolute top-4 left-4 border border-stone-800/30 px-2 py-1 bg-white/80 backdrop-blur-sm text-[8px] font-mono tracking-widest text-charcoal">
                    STUDIO_ARCHIVE / {step.num}
                  </div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-900/20"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-stone-900/20"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-stone-900/30"></div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
                {/* Background watermark */}
                <div className="absolute top-8 right-8 font-serif italic text-5xl md:text-8xl text-stone-900/10 select-none pointer-events-none mix-blend-overlay">
                  {step.num}
                </div>

                <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-stone-500 mb-6 flex items-center gap-4">
                  <div className="w-2 h-2 bg-charcoal rounded-full opacity-60"></div>
                  Phase {step.num} &mdash; {step.category}
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tighter text-stone-800 mb-6 md:mb-8 leading-tight">
                  {step.title}
                </h3>

                <p className="font-sans text-sm md:text-base leading-relaxed font-light text-stone-600 border-l-2 border-charcoal/20 pl-6">
                  {step.desc}
                </p>

                {/* Footer diagram */}
                <div className="mt-12 pt-6 border-t border-charcoal/10 flex justify-between items-end">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, barIdx) => (
                      <div
                        key={barIdx}
                        className={`w-1 bg-charcoal/20`}
                        style={{ height: `${(barIdx + 1) * 3}px` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-[7px] font-mono tracking-widest text-charcoal/40 uppercase">
                    STATUS / ACTIVE
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function ArchiveSection() {
  const items = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=1000",
      top: "20%",
      left: "10%",
      rotation: -5,
      label: "ELEVATION 01 / CRAWFORD",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=85&w=1000",
      top: "15%",
      left: "55%",
      rotation: 8,
      label: "ROOF PARAMÈTRE",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=85&w=1000",
      top: "50%",
      left: "30%",
      rotation: -2,
      label: "INTERIOR COMP. 04",
    },
  ];

  return (
    <section className="h-screen w-full sticky top-0 bg-[#e3e1db] overflow-hidden flex items-center justify-center z-30 shadow-[0_-30px_60px_rgba(0,0,0,0.15)] rounded-t-[40px] cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

      <div className="absolute top-24 left-6 md:left-12 text-[10px] uppercase font-mono tracking-widest text-charcoal/50 flex flex-col gap-2">
        <span>Studio Archive</span>
        <span className="font-semibold text-charcoal">
          Drag physical files to explore
        </span>
      </div>

      {items.map((item) => (
        <ArchiveItem key={item.id} item={item} />
      ))}
    </section>
  );
}

function ArchiveItem({ item }: { item: any }) {
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setLoupePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
      className="absolute w-[280px] md:w-[450px] p-4 bg-stone-50 shadow-2xl group border border-stone-200"
      style={{ top: item.top, left: item.left, rotate: item.rotation }}
      whileDrag={{ scale: 1.05, rotate: 0, zIndex: 50, cursor: "grabbing" }}
      whileHover={{ scale: 1.02, zIndex: 40 }}
    >
      <div
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="w-full aspect-[4/3] bg-stone-200 overflow-hidden relative cursor-crosshair"
      >
        <img
          src={item.src}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
          referrerPolicy="no-referrer"
        />

        {/* Feature: Infinite Drafting Lines on Hover */}
        <div className="absolute top-1/2 left-0 w-[200vw] h-[1px] bg-white mix-blend-difference -translate-x-1/2 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none" />
        <div className="absolute left-1/2 top-0 h-[200vh] w-[1px] bg-white mix-blend-difference -translate-y-1/2 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none" />

        {/* Feature: Photographic Magnifying Loupe */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute w-48 h-48 rounded-full border-[1px] border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden pointer-events-none z-10 bg-black backdrop-blur-md"
              style={{
                left: loupePos.x - 96,
                top: loupePos.y - 96,
                backgroundImage: `url(${item.src})`,
                backgroundPosition: `${(loupePos.x / (imgRef.current?.offsetWidth || 1)) * 100}% ${(loupePos.y / (imgRef.current?.offsetHeight || 1)) * 100}%`,
                backgroundSize: "200%",
              }}
            >
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/50 mix-blend-difference"></div>
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 h-4 w-[1px] bg-white/50 mix-blend-difference"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[6px] font-mono tracking-[0.2em] text-white/50">
                200% ZOOM
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-stone-400">
        <span>Diag. {item.id}</span>
        <span>{item.label}</span>
      </div>
    </motion.div>
  );
}

function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, "0"));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let iteration = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join(""),
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text, isInView]);

  return (
    <span ref={ref} className="font-mono">
      {display}
    </span>
  );
}

function RefractiveGlassNodes() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 5000], [0, -2500]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -3500]);
  const rotate1 = useTransform(scrollY, [0, 5000], [0, 180]);
  const rotate2 = useTransform(scrollY, [0, 5000], [45, -135]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[15]">
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[120vh] -left-[10%] w-[40vw] h-[60vh] rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-[16px] shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
      />
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-[180vh] right-[5%] w-[25vw] h-[40vh] rounded-[2rem] bg-black/5 border border-black/5 backdrop-blur-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
      />
    </div>
  );
}
