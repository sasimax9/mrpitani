import { motion } from "framer-motion";

/**
 * Elegant floating shapes using pure CSS/Framer Motion
 * Replaces heavy Three.js 3D scene for better performance
 */
const shapes = [
  { size: 120, x: "75%", y: "15%", color: "hsl(192 80% 40% / 0.12)", delay: 0, duration: 12 },
  { size: 80, x: "85%", y: "65%", color: "hsl(160 45% 40% / 0.10)", delay: 1, duration: 14 },
  { size: 60, x: "65%", y: "80%", color: "hsl(25 95% 53% / 0.08)", delay: 2, duration: 10 },
  { size: 140, x: "90%", y: "40%", color: "hsl(192 70% 45% / 0.06)", delay: 0.5, duration: 16 },
  { size: 40, x: "70%", y: "30%", color: "hsl(160 45% 50% / 0.10)", delay: 1.5, duration: 11 },
];

const HeroScene = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
    {shapes.map((s, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: s.size,
          height: s.size,
          left: s.x,
          top: s.y,
          background: `radial-gradient(circle, ${s.color}, transparent 70%)`,
          filter: "blur(1px)",
        }}
        animate={{
          y: [0, -30, 0, 20, 0],
          x: [0, 15, -10, 5, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
          rotate: [0, 45, -20, 30, 0],
        }}
        transition={{
          duration: s.duration,
          delay: s.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
    {/* Decorative rings */}
    {[
      { size: 200, x: "80%", y: "20%", delay: 0 },
      { size: 150, x: "60%", y: "70%", delay: 2 },
    ].map((ring, i) => (
      <motion.div
        key={`ring-${i}`}
        className="absolute rounded-full border border-primary-foreground/[0.06]"
        style={{
          width: ring.size,
          height: ring.size,
          left: ring.x,
          top: ring.y,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, delay: ring.delay, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    ))}
  </div>
);

export default HeroScene;
