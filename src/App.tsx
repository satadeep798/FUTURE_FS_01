import React, { useState, useEffect, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useLocation 
} from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Instagram,
  Mail, 
  Code2, 
  Globe, 
  Smartphone, 
  MapPin, 
  GraduationCap, 
  ArrowUpRight,
  Terminal,
  Layers,
  Sparkles,
  Menu,
  X,
  Send,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Download
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import Lenis from 'lenis';
import confetti from 'canvas-confetti';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from './lib/utils';
import { PORTFOLIO_DATA } from './data';

// --- 3D Background Components ---

function ParticleField() {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const r = 1.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  });

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// --- Global Lenis Instance ---
let lenisInstance: Lenis | null = null;

// --- UI Components ---

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        if (lenisInstance) {
          lenisInstance.scrollTo(element);
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [pathname, hash]);
  
  return null;
};

const ProjectPage = () => {
  const { slug } = useParams();
  const project = PORTFOLIO_DATA.projects.find(p => p.slug === slug);

  if (!project) return <div className="min-h-screen flex items-center justify-center text-2xl">Project not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 px-8"
    >
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              {project.tech.map(t => (
                <span key={t} className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tighter mb-8">{project.title}</h1>
            <p className="text-xl text-white/60 leading-relaxed mb-12">
              {project.longDescription}
            </p>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold font-display uppercase tracking-widest text-blue-500">Key Features</h3>
              <div className="grid gap-4">
                {project.features?.map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-6 glass rounded-2xl"
                  >
                    <CheckCircle2 className="text-blue-500 shrink-0" size={24} />
                    <span className="text-lg text-white/80">{f}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src={project.image} alt={project.title} className="w-full h-auto" referrerPolicy="no-referrer" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {project.gallery?.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/10 aspect-video">
                  <img src={img} alt={`${project.title} gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-blue-500/30 border border-blue-500 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500",
      isScrolled ? "bg-black/50 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-8"
    )}>
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-8 flex justify-between items-center">
        <Link 
          to="/"
          className="text-2xl font-bold font-display tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-black">D</div>
          <span>{PORTFOLIO_DATA.name}</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={`/${link.href}`}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link
            to="/#contact"
            className="px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:bg-blue-500 transition-colors"
          >
            Let's Talk
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 p-8 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={`/${link.href}`} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-2xl font-bold"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={container} className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleField />
        </Canvas>
      </div>

      <motion.div style={{ y, opacity }} className="max-w-7xl 2xl:max-w-screen-2xl mx-auto relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-[10rem] font-bold font-display tracking-tighter leading-[0.85] mb-8">
            <span className="block">DIGITAL</span>
            <span className="text-gradient">
              <Typewriter
                words={PORTFOLIO_DATA.hero.words}
                loop={0}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </h1>
          <div className="text-xl md:text-3xl font-light text-white/40 max-w-2xl mx-auto mb-12">
            I'm <span className="text-white font-medium">{PORTFOLIO_DATA.name}</span>, a Computer Engineering student crafting 
            <span className="text-blue-400"> high-performance</span> digital experiences.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/#projects"
              className="px-10 py-5 bg-blue-500 text-black font-black rounded-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform"
            >
              EXPLORE WORK <ArrowUpRight size={20} />
            </Link>
            <Link
              to="/#contact"
              className="px-10 py-5 glass rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform"
            >
              GET IN TOUCH
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" 
        />
      </div>
    </section>
  );
};

const BentoAbout = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <section id="about" className="py-32 px-8">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Bio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bento-card flex flex-col justify-between"
          >
            <div>
              <h2 className="text-4xl font-bold font-display mb-8">The Journey</h2>
              <p className="text-xl text-white/60 leading-relaxed mb-6">
                Currently pursuing B.Tech in Computer Engineering at <span className="text-white">{PORTFOLIO_DATA.education.university}</span>. 
                My approach combines technical precision with creative flair, ensuring every line of code serves a purpose.
              </p>
              <p className="text-xl text-white/60 leading-relaxed">
                From {PORTFOLIO_DATA.location} to the digital world, I'm building the future one pixel at a time.
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              {PORTFOLIO_DATA.education.details.map((detail, i) => (
                <div key={i} className={cn(
                  "px-4 py-2 rounded-full font-bold text-sm",
                  i === 0 ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-white/5 border border-white/10 text-white/60"
                )}>
                  {detail}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-4 bento-card p-0 overflow-hidden group"
          >
            <img 
              src={PORTFOLIO_DATA.profileImage} 
              alt={PORTFOLIO_DATA.name} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bento-card flex flex-col items-center justify-center text-center"
          >
            <div className="text-6xl font-black font-display text-blue-500 mb-2">{PORTFOLIO_DATA.age}</div>
            <div className="text-sm font-bold tracking-widest text-white/40 uppercase">Years of Age</div>
          </motion.div>

          {/* Location */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bento-card flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <MapPin size={32} />
            </div>
            <div>
              <div className="text-lg font-bold">{PORTFOLIO_DATA.location}</div>
              <div className="text-sm text-white/40">{PORTFOLIO_DATA.subLocation}</div>
            </div>
          </motion.div>

          {/* Experience/Education - Upgraded to Interactive Resume Trigger */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.4)" }}
            onClick={() => setIsResumeOpen(true)}
            className="md:col-span-4 bento-card flex items-center gap-6 cursor-pointer border border-white/5 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-black transition-colors duration-300">
              <GraduationCap size={32} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-blue-400 tracking-wider mb-1 flex items-center gap-1.5 uppercase">
                <Sparkles size={12} className="animate-pulse" /> Interactive Resume
              </div>
              <div className="text-lg font-bold group-hover:text-blue-400 transition-colors">{PORTFOLIO_DATA.education.degree}</div>
              <div className="text-sm text-white/40 flex items-center justify-between">
                <span>{PORTFOLIO_DATA.education.status}</span>
                <span className="text-[10px] font-bold text-white/20 group-hover:text-white/60 transition-colors uppercase tracking-wider">Click &rarr;</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- Beautiful Dynamic Interactive Resume Modal --- */}
      <AnimatePresence>
        {isResumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setIsResumeOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-[#080808] border border-white/10 rounded-[2rem] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col text-left shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-display uppercase tracking-tight">{PORTFOLIO_DATA.name}</h3>
                    <p className="text-xs text-white/40 font-mono tracking-wider">CURRICULUM VITAE &bull; {PORTFOLIO_DATA.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-blue-400 transition-all rounded-xl flex items-center gap-2 text-xs font-bold tracking-widest uppercase cursor-pointer"
                    title="Print / Save PDF"
                  >
                    <Download size={16} /> <span className="hidden sm:inline">PDF</span>
                  </button>
                  <button 
                    onClick={() => setIsResumeOpen(false)}
                    className="p-3 bg-white/5 hover:bg-white/20 text-white/60 hover:text-white transition-all rounded-xl cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 selection:bg-blue-500/30">
                {/* Intro */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-blue-500 font-bold uppercase tracking-wider text-xs">Professional Profile</h4>
                    <p className="text-white/70 leading-relaxed text-lg font-light">
                      I'm Deep Sata, a passionate Computer Engineering student crafting high-performance digital experiences. 
                      My work bridges professional user architectures, advanced programming paradigms, and clean design patterns.
                    </p>
                  </div>
                  <div className="glass p-6 rounded-2xl space-y-3 font-mono text-xs text-white/60">
                    <p><strong className="text-white">Role:</strong> {PORTFOLIO_DATA.role}</p>
                    <p><strong className="text-white">Email:</strong> {PORTFOLIO_DATA.socials.email}</p>
                    <p><strong className="text-white">Location:</strong> {PORTFOLIO_DATA.location}</p>
                    <p><strong className="text-white">Age:</strong> {PORTFOLIO_DATA.age} Years</p>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Grid Fields */}
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Education column */}
                  <div className="space-y-6">
                    <h4 className="text-blue-500 font-bold uppercase tracking-wider text-xs">Education</h4>
                    <div className="relative pl-6 border-l border-white/10 space-y-8">
                      {/* B.Tech */}
                      <div className="relative">
                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[30px] top-[6px] border border-black shadow-[0_0_10px_#3b82f6]" />
                        <span className="text-xs font-bold text-white/40 font-mono">Present</span>
                        <h5 className="text-lg font-bold text-white mt-1">B.Tech in Computer Engineering</h5>
                        <p className="text-sm text-blue-400 font-medium">{PORTFOLIO_DATA.education.university}</p>
                        <p className="text-xs text-white/50 mt-2">Currently in the 4th Semester focusing on Advanced Data Structures, Web App Architecture, and Object Oriented Programming.</p>
                      </div>
                      {/* Diploma */}
                      <div className="relative">
                        <div className="absolute w-3 h-3 bg-blue-500/30 rounded-full -left-[30px] top-[6px] border border-black" />
                        <span className="text-xs font-bold text-white/40 font-mono">Graduated</span>
                        <h5 className="text-lg font-bold text-white mt-1">Diploma in Computer Engineering</h5>
                        <p className="text-xs text-white/50 mt-1">Completed with a stellar <b className="text-blue-400 font-bold">7.5 CPI</b>, building strong fundamental baselines in software principles and relational programming logic.</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Specialization column */}
                  <div className="space-y-6">
                    <h4 className="text-blue-500 font-bold uppercase tracking-wider text-xs">Technical Proficiency</h4>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider">
                          <span className="text-white/80">Web Apps & Backend (Node.js, Express)</span>
                          <span className="text-blue-400">85%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider">
                          <span className="text-white/80">Java Programming & OOP</span>
                          <span className="text-blue-400">90%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider">
                          <span className="text-white/80">Cross-Platform Mobile (Flutter)</span>
                          <span className="text-blue-400">70%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider">
                          <span className="text-white/80">Database Systems & SQL/NoSQL</span>
                          <span className="text-blue-400">80%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2 font-mono">Languages knowledge</h5>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Java, JavaScript, C, .NET, HTML, CSS, C#, Dart. Well-versed with software architectures, APIs, and responsive design systems.
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Bottom Projects Highlights */}
                <div className="space-y-6">
                  <h4 className="text-blue-500 font-bold uppercase tracking-wider text-xs">Pivotal Projects</h4>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {PORTFOLIO_DATA.projects.map((proj) => (
                      <div key={proj.slug} className="glass p-6 rounded-2xl space-y-2 border border-white/5 hover:border-blue-500/20 transition-all">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-white text-base">{proj.title}</h5>
                          <div className="flex gap-1">
                            {proj.tech.slice(0, 2).map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono font-bold text-white/40 uppercase">{t}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/5 bg-black/50 text-center text-xs text-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span>Contact Email: <strong className="text-white/60">{PORTFOLIO_DATA.socials.email}</strong></span>
                <span className="font-mono text-[10px] tracking-widest text-blue-500 uppercase font-black">Certified Computer Eng. student</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-32 bg-white/[0.01]">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold font-display mb-6">Technical Stack</h2>
          <p className="text-white/40 max-w-xl mx-auto">A collection of tools and languages knowledge to build robust applications.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PORTFOLIO_DATA.skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-[2rem] flex flex-col items-center gap-4 group"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity", skill.color)}>
                {skill.icon}
              </div>
              <span className="font-bold tracking-tight">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 100, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative h-[500px] w-full perspective-1000"
    >
      <div className="absolute inset-0 bg-blue-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full w-full bento-card p-0 overflow-hidden border-white/5 group-hover:border-blue-500/50 transition-colors flex flex-col justify-end">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 group-hover:from-blue-600/30 group-hover:to-indigo-900/50 transition-colors" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-10 transform-gpu translate-z-20">
          <div className="flex gap-2 mb-4">
            {project.tech.map((t: string) => (
              <span key={t} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-white/10">
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-3xl font-bold font-display mb-4 group-hover:text-blue-400 transition-colors">{project.title}</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">{project.description}</p>
          <Link
            to={`/project/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white group/btn"
          >
            VIEW PROJECT <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-32 px-8">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-6xl font-bold font-display mb-6">Selected Works</h2>
            <p className="text-white/40 max-w-lg">A showcase of projects where I've pushed the boundaries of what's possible in the digital realm.</p>
          </div>
          <motion.a 
            href={PORTFOLIO_DATA.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 10 }}
            className="flex items-center gap-3 text-blue-400 font-bold tracking-widest text-sm"
          >
            SEE ALL ON GITHUB <Github size={20} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {PORTFOLIO_DATA.projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) {
        setSubmitted(true);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#3b82f6', '#ffffff'] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-8">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto bento-card p-12 md:p-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="grid lg:grid-cols-2 gap-20 relative z-10">
          <div>
            <h2 className="text-6xl font-bold font-display mb-8">Let's build something <span className="text-blue-500">extraordinary</span>.</h2>
            <p className="text-xl text-white/40 mb-12">
              Have a project in mind or just want to say hi? My inbox is always open.
            </p>
            
            <div className="space-y-6 text-left">
              <a href={`mailto:${PORTFOLIO_DATA.socials.email}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors justify-start">
                <Mail className="text-blue-500 flex-shrink-0" />
                <span className="text-lg text-left">{PORTFOLIO_DATA.socials.email}</span>
              </a>
              <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors justify-start">
                <Linkedin className="text-blue-500 flex-shrink-0" />
                <span className="text-lg text-left">LinkedIn Profile</span>
              </a>
            </div>
          </div>

          <div>
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8">
                  <Send size={48} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                <p className="text-white/40">I'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                  required
                  type="text" 
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                />
                <input 
                  required
                  type="email" 
                  placeholder="Your Email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formState.email}
                  onChange={e => setFormState({...formState, email: e.target.value})}
                />
                <textarea 
                  required
                  rows={4}
                  placeholder="Your Message"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Handle hash scroll on initial load or navigation
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => {
          lenis.scrollTo(el as HTMLElement);
        }, 500);
      }
    }

    setTimeout(() => setLoading(false), 2000);
    
    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-[#030303] text-white selection:bg-blue-500/30">
        <AnimatePresence>
          {loading && (
            <motion.div
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 200 }}
                  className="h-px bg-blue-500"
                />
                <div className="text-4xl font-display font-black tracking-tighter overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    className="block"
                  >
                    {PORTFOLIO_DATA.name}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CustomCursor />
        <Navbar />
        
      <Routes>
        <Route path="/" element={
          <main className={cn("transition-opacity duration-1000", loading ? "opacity-0" : "opacity-100")}>
            <Hero />
            <BentoAbout />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </main>
        } />
        <Route path="/project/:slug" element={<ProjectPage />} />
      </Routes>

        <footer className="py-20 px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-2xl font-bold font-display tracking-tighter">{PORTFOLIO_DATA.name}</div>
            <div className="flex gap-8 text-white/40 text-sm font-bold tracking-widest">
              <a href={PORTFOLIO_DATA.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GITHUB</a>
              <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
              <a href={PORTFOLIO_DATA.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
            </div>
            <div className="text-white/20 text-xs font-bold tracking-widest uppercase">
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

