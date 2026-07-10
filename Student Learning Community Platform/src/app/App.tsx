import { useState, useEffect, useRef } from "react";
import {
  Bell, Sun, Moon, Menu, X, ChevronDown, ExternalLink,
  BookOpen, Send, Trash2, ArrowLeft, MessageSquare,
  Globe, Play, GraduationCap, Database, FileSpreadsheet,
  Monitor, Users, Calendar, Star, Link2, ChevronRight,
  Upload, Filter, Smile
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Page = "home" | "course";
type CourseKey = "tin-a" | "tin-b" | "access";
type MatFilter = "all" | "tin-a" | "tin-b" | "access" | "general";

interface Lesson { id: number; title: string; videoId: string; duration: string }
interface Material { id: number; title: string; subject: MatFilter; date: string; url: string; author: string }
interface Notif { id: number; text: string; courseKey: CourseKey; lessonId: number; time: string; read: boolean }
interface Comment { id: number; name: string; date: string; content: string }

// ─── DATA ─────────────────────────────────────────────────────────────────────
const COURSE_DATA: Record<CourseKey, {
  title: string; subtitle: string; color: string; driveUrl: string; quizUrl: string; lessons: Lesson[]
}> = {
  "tin-a": {
    title: "Tin A", subtitle: "Computer Fundamentals",
    color: "indigo", driveUrl: "https://drive.google.com", quizUrl: "https://docs.google.com",
    lessons: [
      { id: 1, title: "Introduction to Computers", videoId: "Fo7Q_aW_Qpg", duration: "12:45" },
      { id: 2, title: "Windows Operating System", videoId: "GjNp0bBrjmU", duration: "18:30" },
      { id: 3, title: "File & Folder Management", videoId: "kMgSq8dpO3s", duration: "15:10" },
      { id: 4, title: "Microsoft Word Basics", videoId: "8mAITcNt710", duration: "22:05" },
      { id: 5, title: "Formatting Documents", videoId: "hWWGTHT8Mvs", duration: "19:40" },
      { id: 6, title: "Tables & Lists in Word", videoId: "ZXwEhp6L8EI", duration: "14:55" },
      { id: 7, title: "Introduction to Excel", videoId: "9NUjADJCvzE", duration: "20:20" },
      { id: 8, title: "Basic Excel Formulas", videoId: "D4K3kCWTRmI", duration: "25:15" },
    ]
  },
  "tin-b": {
    title: "Tin B", subtitle: "Office & Internet Skills",
    color: "emerald", driveUrl: "https://drive.google.com", quizUrl: "https://docs.google.com",
    lessons: [
      { id: 1, title: "Advanced Excel Functions", videoId: "RtjLSHFdUGQ", duration: "28:10" },
      { id: 2, title: "Excel Charts & Graphs", videoId: "1FpM7kIxFYA", duration: "22:35" },
      { id: 3, title: "Excel Pivot Tables", videoId: "jU1oK-X7WtA", duration: "30:00" },
      { id: 4, title: "PowerPoint Fundamentals", videoId: "AUKpO8QNSK8", duration: "18:45" },
      { id: 5, title: "Designing Slides", videoId: "CrOFHWp2PiM", duration: "20:30" },
      { id: 6, title: "Animations & Transitions", videoId: "Xo4zL-2LOFM", duration: "16:20" },
      { id: 7, title: "Internet & Email Basics", videoId: "7_LPdttKXPc", duration: "12:55" },
      { id: 8, title: "Online Research Skills", videoId: "Z9LZ3kKS0cE", duration: "14:40" },
    ]
  },
  "access": {
    title: "MS Access", subtitle: "Database Management",
    color: "amber", driveUrl: "https://drive.google.com", quizUrl: "https://docs.google.com",
    lessons: [
      { id: 1, title: "What is a Database?", videoId: "DG-UlqEy7y4", duration: "10:30" },
      { id: 2, title: "Creating Tables", videoId: "xvFZjo5PgG0", duration: "18:15" },
      { id: 3, title: "Data Types & Field Properties", videoId: "OKoK6PNR1CU", duration: "16:50" },
      { id: 4, title: "Table Relationships", videoId: "OqjmWGMJuAY", duration: "22:10" },
      { id: 5, title: "Introduction to Queries", videoId: "0YPDWOM0S1k", duration: "20:45" },
      { id: 6, title: "Select & Filter Queries", videoId: "wFBjxmhVRlU", duration: "19:30" },
      { id: 7, title: "Forms & Reports", videoId: "DG-UlqEy7y4", duration: "24:05" },
      { id: 8, title: "Building a Complete Database", videoId: "3yEBTCy3K2M", duration: "35:20" },
    ]
  }
};

const INITIAL_MATERIALS: Material[] = [
  { id: 1, title: "MS Access Lab Exercises — Chapter 3: Queries", subject: "access", date: "2024-06-28", url: "https://drive.google.com", author: "Nguyễn Văn An" },
  { id: 2, title: "Excel Formula Cheat Sheet (Tin B)", subject: "tin-b", date: "2024-06-27", url: "https://drive.google.com", author: "Trần Thị Bình" },
  { id: 3, title: "Windows Shortcuts & Tips Guide (Tin A)", subject: "tin-a", date: "2024-06-26", url: "https://drive.google.com", author: "Lê Minh Cường" },
  { id: 4, title: "General Study Guide — Midterm Prep 2024", subject: "general", date: "2024-06-25", url: "https://drive.google.com", author: "Phạm Thùy Dung" },
  { id: 5, title: "PowerPoint Design Templates Pack", subject: "tin-b", date: "2024-06-24", url: "https://drive.google.com", author: "Hoàng Đức Thịnh" },
  { id: 6, title: "MS Access Relationship Diagram Examples", subject: "access", date: "2024-06-23", url: "https://drive.google.com", author: "Vũ Thị Hoa" },
  { id: 7, title: "Computer Basics Practice Quiz Set A", subject: "tin-a", date: "2024-06-22", url: "https://drive.google.com", author: "Đinh Văn Kiên" },
  { id: 8, title: "Excel Pivot Table Tutorial Notes", subject: "tin-b", date: "2024-06-21", url: "https://drive.google.com", author: "Bùi Thanh Lan" },
  { id: 9, title: "Database Normalization Reference Sheet", subject: "access", date: "2024-06-20", url: "https://drive.google.com", author: "Phan Anh Minh" },
  { id: 10, title: "IT Exam Vocabulary Glossary", subject: "general", date: "2024-06-19", url: "https://drive.google.com", author: "Ngô Thị Ngọc" },
  { id: 11, title: "Microsoft Word Lab Practice File", subject: "tin-a", date: "2024-06-18", url: "https://drive.google.com", author: "Hà Văn Phúc" },
  { id: 12, title: "Internet Safety & Digital Ethics Notes", subject: "tin-b", date: "2024-06-17", url: "https://drive.google.com", author: "Lý Thị Quyên" },
];

const ALL_NOTIFICATIONS: Notif[] = [
  { id: 1, text: "New lesson added: Building a Complete Database in MS Access", courseKey: "access", lessonId: 8, time: "2 min ago", read: false },
  { id: 2, text: "Lesson updated: Advanced Excel Functions now includes practice file", courseKey: "tin-b", lessonId: 1, time: "1 hour ago", read: false },
  { id: 3, text: "New video live: Excel Pivot Tables — watch now!", courseKey: "tin-b", lessonId: 3, time: "3 hours ago", read: false },
  { id: 4, text: "Lesson added: Introduction to Queries in MS Access", courseKey: "access", lessonId: 5, time: "Yesterday", read: true },
  { id: 5, text: "Tin A: Lesson 8 'Basic Excel Formulas' is live!", courseKey: "tin-a", lessonId: 8, time: "Yesterday", read: true },
  { id: 6, text: "MS Access: Forms & Reports lesson uploaded", courseKey: "access", lessonId: 7, time: "2 days ago", read: true },
  { id: 7, text: "New content: Designing Slides in PowerPoint (Tin B)", courseKey: "tin-b", lessonId: 5, time: "2 days ago", read: true },
  { id: 8, text: "Tin A: File & Folder Management video is now available", courseKey: "tin-a", lessonId: 3, time: "3 days ago", read: true },
  { id: 9, text: "Lesson updated: Select Queries in MS Access", courseKey: "access", lessonId: 6, time: "3 days ago", read: true },
  { id: 10, text: "Tin B: Animations & Transitions lesson added", courseKey: "tin-b", lessonId: 6, time: "4 days ago", read: true },
];

const INITIAL_COMMENTS: Record<CourseKey, Comment[]> = {
  "tin-a": [
    { id: 1, name: "Nguyen Thi Mai", date: "Jun 28, 2024", content: "The Windows shortcuts in Lesson 2 are super useful! I didn't know about Win+E before. Thanks so much!" },
    { id: 2, name: "Tran Van Duc", date: "Jun 27, 2024", content: "Could we get more practice exercises for the Excel formulas? The video is really clear though!" },
  ],
  "tin-b": [
    { id: 1, name: "Le Minh Khoa", date: "Jun 27, 2024", content: "Pivot tables finally make sense! The visual explanation in Lesson 3 is excellent. Watched it twice." },
    { id: 2, name: "Pham Thu Huong", date: "Jun 26, 2024", content: "Can someone share their practice Excel file? I want to compare my formulas with others." },
  ],
  "access": [
    { id: 1, name: "Hoang Van Nam", date: "Jun 28, 2024", content: "The relationships lesson really clicked for me today. Thanks for the diagram approach — very clear!" },
    { id: 2, name: "Vu Thi Lan", date: "Jun 27, 2024", content: "I keep getting an error when linking tables — is there a video on fixing relationship errors specifically?" },
    { id: 3, name: "Do Thanh Trung", date: "Jun 26, 2024", content: "Lesson 8 is amazing! Building the complete database step by step is exactly what I needed for my project." },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const cn = (...cls: (string | boolean | undefined | null)[]) => cls.filter(Boolean).join(" ");

const SUBJECT_META: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  "tin-a": { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300", label: "Tin A", dot: "bg-indigo-500" },
  "tin-b": { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", label: "Tin B", dot: "bg-emerald-500" },
  "access": { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", label: "MS Access", dot: "bg-amber-500" },
  "general": { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", label: "General", dot: "bg-slate-400" },
};

const fmt = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─── HERO ILLUSTRATION ────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center select-none pointer-events-none" style={{ height: 320 }}>
      <svg viewBox="0 0 420 320" className="w-full max-w-sm md:max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hBlob1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hBlob2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hBlob3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="screenG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE"/>
            <stop offset="100%" stopColor="#4F46E5"/>
          </linearGradient>
          <linearGradient id="bezelG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF"/>
            <stop offset="100%" stopColor="#A5B4FC"/>
          </linearGradient>
          <linearGradient id="baseG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE"/>
            <stop offset="100%" stopColor="#818CF8"/>
          </linearGradient>
          <filter id="hShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#4F46E5" floodOpacity="0.22"/>
          </filter>
          <filter id="softSh" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.1"/>
          </filter>
          <filter id="cardSh" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#4F46E5" floodOpacity="0.15"/>
          </filter>
        </defs>

        {/* Background blobs */}
        <ellipse cx="210" cy="160" rx="190" ry="135" fill="url(#hBlob1)"/>
        <ellipse cx="330" cy="75" rx="85" ry="65" fill="url(#hBlob2)"/>
        <ellipse cx="70" cy="220" rx="70" ry="55" fill="url(#hBlob3)"/>

        {/* Laptop screen */}
        <g filter="url(#hShadow)">
          <rect x="95" y="65" width="230" height="148" rx="14" fill="url(#bezelG)"/>
          <rect x="104" y="74" width="212" height="130" rx="9" fill="url(#screenG)"/>
          {/* Screen UI mockup */}
          <rect x="116" y="90" width="90" height="9" rx="4.5" fill="white" fillOpacity="0.65"/>
          <rect x="116" y="108" width="130" height="7" rx="3.5" fill="white" fillOpacity="0.4"/>
          <rect x="116" y="122" width="100" height="7" rx="3.5" fill="white" fillOpacity="0.35"/>
          <rect x="116" y="136" width="70" height="7" rx="3.5" fill="white" fillOpacity="0.28"/>
          {/* Play button */}
          <circle cx="262" cy="130" r="24" fill="white" fillOpacity="0.2"/>
          <circle cx="262" cy="130" r="18" fill="white" fillOpacity="0.25"/>
          <polygon points="255,121 255,139 273,130" fill="white" fillOpacity="0.9"/>
        </g>

        {/* Laptop base */}
        <rect x="80" y="211" width="260" height="15" rx="7.5" fill="url(#baseG)"/>
        <ellipse cx="210" cy="228" rx="120" ry="6" fill="#4F46E5" fillOpacity="0.2"/>

        {/* Floating card left */}
        <g filter="url(#cardSh)" transform="rotate(-9 58 125)">
          <rect x="20" y="95" width="82" height="58" rx="12" fill="white" fillOpacity="0.95"/>
          <rect x="28" y="107" width="46" height="7" rx="3.5" fill="#4F46E5" fillOpacity="0.75"/>
          <rect x="28" y="121" width="30" height="5" rx="2.5" fill="#4F46E5" fillOpacity="0.4"/>
          <rect x="28" y="132" width="38" height="5" rx="2.5" fill="#4F46E5" fillOpacity="0.3"/>
          <rect x="28" y="143" width="24" height="5" rx="2.5" fill="#4F46E5" fillOpacity="0.2"/>
        </g>

        {/* Floating card right */}
        <g filter="url(#cardSh)" transform="rotate(7 330 148)">
          <rect x="298" y="115" width="82" height="58" rx="12" fill="white" fillOpacity="0.95"/>
          <rect x="306" y="127" width="46" height="7" rx="3.5" fill="#F59E0B" fillOpacity="0.85"/>
          <rect x="306" y="141" width="30" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.45"/>
          <rect x="306" y="152" width="38" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.3"/>
          <rect x="306" y="163" width="24" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.2"/>
        </g>

        {/* Floating badge top */}
        <g filter="url(#softSh)">
          <rect x="165" y="28" width="90" height="30" rx="15" fill="white" fillOpacity="0.95"/>
          <circle cx="182" cy="43" r="7" fill="#10B981" fillOpacity="0.9"/>
          <rect x="196" y="38" width="45" height="5" rx="2.5" fill="#0F172A" fillOpacity="0.5"/>
          <rect x="196" y="47" width="30" height="4" rx="2" fill="#0F172A" fillOpacity="0.28"/>
        </g>

        {/* Decorative dots */}
        <circle cx="78" cy="58" r="5.5" fill="#F59E0B" fillOpacity="0.85"/>
        <circle cx="345" cy="82" r="4.5" fill="#10B981" fillOpacity="0.85"/>
        <circle cx="360" cy="210" r="6" fill="#818CF8" fillOpacity="0.75"/>
        <circle cx="42" cy="210" r="4" fill="#F59E0B" fillOpacity="0.65"/>
        <circle cx="318" cy="46" r="3.5" fill="#A5B4FC" fillOpacity="0.9"/>
        <circle cx="142" cy="52" r="3" fill="#818CF8" fillOpacity="0.65"/>
        <circle cx="278" cy="258" r="4.5" fill="#10B981" fillOpacity="0.5"/>
        <circle cx="58" cy="170" r="3" fill="#F59E0B" fillOpacity="0.75"/>
        {/* Star sparkle */}
        <path d="M385 135 L387 130 L389 135 L394 137 L389 139 L387 144 L385 139 L380 137 Z" fill="#818CF8" fillOpacity="0.8"/>
        <path d="M32 85 L33.5 81 L35 85 L39 86.5 L35 88 L33.5 92 L32 88 L28 86.5 Z" fill="#F59E0B" fillOpacity="0.7"/>
      </svg>
    </div>
  );
}

// ─── 404 ILLUSTRATION ─────────────────────────────────────────────────────────
function NotFoundIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-48 h-36 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nfBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="80" rx="90" ry="65" fill="url(#nfBlob)"/>
      <rect x="55" y="40" width="90" height="70" rx="10" fill="#E0E7FF"/>
      <rect x="63" y="55" width="60" height="7" rx="3.5" fill="#818CF8" fillOpacity="0.6"/>
      <rect x="63" y="69" width="44" height="5" rx="2.5" fill="#818CF8" fillOpacity="0.35"/>
      <rect x="63" y="80" width="50" height="5" rx="2.5" fill="#818CF8" fillOpacity="0.28"/>
      <circle cx="140" cy="45" r="18" fill="#FEF3C7"/>
      <text x="133" y="51" fontSize="14" fill="#F59E0B" fontWeight="700">?</text>
      <circle cx="38" cy="110" r="6" fill="#D1FAE5"/>
      <circle cx="162" cy="108" r="5" fill="#FEE2E2"/>
    </svg>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({
  isDark, onToggleDark, onNavigate, currentPage, currentCourse, notifications, onMarkAllRead
}: {
  isDark: boolean;
  onToggleDark: () => void;
  onNavigate: (page: Page, course?: CourseKey) => void;
  currentPage: Page;
  currentCourse?: CourseKey;
  notifications: Notif[];
  onMarkAllRead: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (coursesRef.current && !coursesRef.current.contains(e.target as Node)) setCoursesOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLink = (label: string, active: boolean, onClick: () => void) => (
    <button onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
      )}>
      {label}
    </button>
  );

  const courseOptions: { key: CourseKey; label: string; sub: string; Icon: typeof Monitor; color: string }[] = [
    { key: "tin-a", label: "Tin A", sub: "Computer Fundamentals", Icon: Monitor, color: "text-indigo-500" },
    { key: "tin-b", label: "Tin B", sub: "Office & Internet Skills", Icon: FileSpreadsheet, color: "text-emerald-500" },
    { key: "access", label: "MS Access", sub: "Database Management", Icon: Database, color: "text-amber-500" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <button onClick={() => { onNavigate("home"); setMenuOpen(false); }}
          className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-150">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-slate-900 dark:text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nong Lam IT
            </span>
            <span className="hidden lg:inline text-xs text-slate-400 dark:text-slate-500 ml-1">Learning</span>
          </div>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLink("Home", currentPage === "home", () => onNavigate("home"))}

          <div className="relative" ref={coursesRef}>
            <button
              onClick={() => setCoursesOpen(!coursesOpen)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                currentPage === "course"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              )}>
              Courses
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", coursesOpen && "rotate-180")} />
            </button>
            {coursesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {courseOptions.map(({ key, label, sub, Icon, color }) => (
                  <button key={key}
                    onClick={() => { onNavigate("course", key); setCoursesOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left",
                      currentPage === "course" && currentCourse === key ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                    )}>
                    <Icon className={cn("w-4 h-4 shrink-0", color)} />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{label}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{sub}</div>
                    </div>
                    {currentPage === "course" && currentCourse === key && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* External links */}
          <div className="hidden lg:flex items-center gap-0.5">
            <a href="https://aic.hcmuaf.edu.vn" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-150">
              <Globe className="w-3.5 h-3.5" /> AIC Website
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-150">
              <ExternalLink className="w-3.5 h-3.5" /> Output Standards
            </a>
          </div>

          {/* Feedback */}
          <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs font-bold rounded-full transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95 whitespace-nowrap">
            ✉ Send Feedback
          </a>

          {/* Bell */}
          <div className="relative" ref={bellRef}>
            <button onClick={() => setBellOpen(!bellOpen)} aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Notifications</span>
                    {unread > 0 && <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">{unread} new</span>}
                  </div>
                  {unread > 0 && (
                    <button onClick={onMarkAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-72 divide-y divide-slate-50 dark:divide-slate-700/50">
                  {notifications.map(n => (
                    <button key={n.id}
                      onClick={() => { onNavigate("course", n.courseKey); setBellOpen(false); }}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors",
                        !n.read ? "bg-indigo-50/60 dark:bg-indigo-900/10" : ""
                      )}>
                      <div className="flex items-start gap-2.5">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                        <div className={cn(!n.read ? "" : "ml-4")}>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.text}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark toggle */}
          <button onClick={onToggleDark} aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150">
            {isDark
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {menuOpen ? <X className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-1">
          <button onClick={() => { onNavigate("home"); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            Home
          </button>
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Courses</div>
          {courseOptions.map(({ key, label, sub, Icon, color }) => (
            <button key={key} onClick={() => { onNavigate("course", key); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Icon className={cn("w-4 h-4", color)} />
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <a href="https://aic.hcmuaf.edu.vn" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400">
              <Globe className="w-3.5 h-3.5" /> AIC Website
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400">
              <ExternalLink className="w-3.5 h-3.5" /> Graduation Output Standards
            </a>
          </div>
          <div className="pt-1">
            <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-amber-400 text-amber-900 text-sm font-bold rounded-full">
              ✉ Send Feedback
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── SUBJECT PILL ─────────────────────────────────────────────────────────────
function SubjectPill({ subject }: { subject: string }) {
  const m = SUBJECT_META[subject] ?? SUBJECT_META["general"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", m.bg, m.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onNavigate, materials, setMaterials }: {
  onNavigate: (page: Page, course?: CourseKey) => void;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}) {
  const [filter, setFilter] = useState<MatFilter>("all");
  const [visible, setVisible] = useState(10);
  const [form, setForm] = useState({ title: "", url: "", subject: "tin-a" as MatFilter, author: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nextId = useRef(100);

  const filtered = filter === "all" ? materials : materials.filter(m => m.subject === filter);
  const shown = filtered.slice(0, visible);

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim() || !form.author.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setMaterials(prev => [{
        id: nextId.current++,
        title: form.title.trim(),
        subject: form.subject,
        date: new Date().toISOString().split("T")[0],
        url: form.url.trim(),
        author: form.author.trim(),
      }, ...prev]);
      setForm({ title: "", url: "", subject: "tin-a", author: "" });
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    }, 600);
  };

  const handleDelete = (id: number) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const courseCards = [
    { key: "tin-a" as CourseKey, label: "Tin A", sub: "Computer Fundamentals", Icon: Monitor, gradient: "from-indigo-500 to-indigo-700", light: "bg-indigo-50 dark:bg-indigo-900/20", lessons: COURSE_DATA["tin-a"].lessons.length },
    { key: "tin-b" as CourseKey, label: "Tin B", sub: "Office & Internet", Icon: FileSpreadsheet, gradient: "from-emerald-500 to-emerald-700", light: "bg-emerald-50 dark:bg-emerald-900/20", lessons: COURSE_DATA["tin-b"].lessons.length },
    { key: "access" as CourseKey, label: "MS Access", sub: "Database Management", Icon: Database, gradient: "from-amber-400 to-amber-600", light: "bg-amber-50 dark:bg-amber-900/20", lessons: COURSE_DATA["access"].lessons.length },
  ];

  const filterOptions: { key: MatFilter; label: string }[] = [
    { key: "all", label: "All Resources" },
    { key: "tin-a", label: "Tin A" },
    { key: "tin-b", label: "Tin B" },
    { key: "access", label: "MS Access" },
    { key: "general", label: "General" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 border border-indigo-200 dark:border-indigo-800">
                <Star className="w-3 h-3 fill-current" /> Nong Lam University — AIC Faculty
              </div>
              <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Learn IT.{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 bg-clip-text text-transparent">
                  Level Up.
                </span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                Watch lessons, ask questions, and share resources with your classmates — all in one place. Your journey to IT mastery starts here. 🚀
              </p>

              {/* Course CTA buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {courseCards.map(({ key, label, sub, Icon, gradient }) => (
                  <button key={key} onClick={() => onNavigate("course", key)}
                    className={cn(
                      "group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95",
                      gradient
                    )}>
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-bold">{label}</div>
                      <div className="text-xs opacity-80">{sub}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>

              {/* External links */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                <a href="https://aic.hcmuaf.edu.vn" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-150 shadow-sm">
                  <Globe className="w-3.5 h-3.5" /> AIC Website
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-150 shadow-sm">
                  <BookOpen className="w-3.5 h-3.5" /> Graduation Output Standards
                </a>
              </div>

              {/* Visitor stat */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                <div className="flex -space-x-1.5">
                  {["bg-indigo-400", "bg-emerald-400", "bg-amber-400", "bg-purple-400"].map((c, i) => (
                    <div key={i} className={cn("w-6 h-6 rounded-full border-2 border-white dark:border-slate-800", c)} />
                  ))}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">12,847</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">students visited</span>
                </div>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Course cards */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Pick Your Course
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Choose a subject and start watching lessons today.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {courseCards.map(({ key, label, sub, Icon, gradient, light, lessons }) => (
              <button key={key} onClick={() => onNavigate("course", key)}
                className={cn(
                  "group p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-card text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-800"
                )}>
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-200", gradient)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-lg text-slate-900 dark:text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{sub}</div>
                <div className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full", light)}>
                  <Play className="w-3 h-3" />
                  {lessons} lessons
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Community Materials */}
      <section className="py-12 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Community Materials
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Shared by students, for students. 📚</p>
            </div>
          </div>

          {/* Share form */}
          <div className="mb-8 bg-card rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Share a Resource
              </h3>
            </div>
            <form onSubmit={handleShare} className="grid sm:grid-cols-2 gap-4">
              <input
                className="sm:col-span-2 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                placeholder="Resource title (e.g., Excel Formulas Cheat Sheet)"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                placeholder="Google Drive link"
                value={form.url}
                onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                required
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                placeholder="Your name"
                value={form.author}
                onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                required
              />
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value as MatFilter }))}>
                <option value="tin-a">Tin A</option>
                <option value="tin-b">Tin B</option>
                <option value="access">MS Access</option>
                <option value="general">General</option>
              </select>
              <div className="sm:col-span-2">
                <button type="submit" disabled={submitting}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-150 hover:scale-105 active:scale-95",
                    submitted
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg",
                    submitting && "opacity-70 cursor-not-allowed hover:scale-100"
                  )}>
                  {submitted ? "✓ Shared!" : submitting ? "Sharing..." : <><Send className="w-4 h-4" /> Share Resource</>}
                </button>
              </div>
            </form>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Filter className="w-4 h-4 text-slate-400 self-center mr-1" />
            {filterOptions.map(({ key, label }) => (
              <button key={key} onClick={() => { setFilter(key); setVisible(10); }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150",
                  filter === key
                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600"
                )}>
                {label}
              </button>
            ))}
          </div>

          {/* Materials feed */}
          {shown.length === 0 ? (
            <div className="text-center py-16">
              <Smile className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No resources yet for this subject.</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Be the first to share something helpful! ✨</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map(mat => (
                <div key={mat.id}
                  className="group bg-card rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <SubjectPill subject={mat.subject} />
                    <button onClick={() => handleDelete(mat.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <a href={mat.url} target="_blank" rel="noopener noreferrer"
                    className="block font-semibold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2 leading-snug">
                    {mat.title}
                  </a>
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmt(mat.date)}</span>
                    <span className="truncate">by {mat.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <button onClick={() => setVisible(v => v + 10)}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-150 shadow-sm">
                Load {Math.min(10, filtered.length - visible)} more resources
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nong Lam IT Learning
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Built with ❤️ for AIC students · Nong Lam University Ho Chi Minh City
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── COURSE PAGE ──────────────────────────────────────────────────────────────
function CoursePage({ courseKey, onNavigate, comments, setComments }: {
  courseKey: CourseKey;
  onNavigate: (page: Page, course?: CourseKey) => void;
  comments: Record<CourseKey, Comment[]>;
  setComments: React.Dispatch<React.SetStateAction<Record<CourseKey, Comment[]>>>;
}) {
  const course = COURSE_DATA[courseKey];
  const [activeLesson, setActiveLesson] = useState(0);
  const [commentForm, setCommentForm] = useState({ name: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const nextCid = useRef(200);
  const lessonComments = comments[courseKey];

  const lesson = course.lessons[activeLesson];

  const colorMap: Record<string, { badge: string; glow: string; btn: string }> = {
    indigo: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", glow: "ring-indigo-400/30", btn: "from-indigo-600 to-indigo-500" },
    emerald: { badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", glow: "ring-emerald-400/30", btn: "from-emerald-600 to-emerald-500" },
    amber: { badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300", glow: "ring-amber-400/30", btn: "from-amber-500 to-amber-400" },
  };
  const colors = colorMap[course.color] ?? colorMap.indigo;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.content.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setComments(prev => ({
        ...prev,
        [courseKey]: [{
          id: nextCid.current++,
          name: commentForm.name.trim(),
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          content: commentForm.content.trim(),
        }, ...prev[courseKey]]
      }));
      setCommentForm({ name: "", content: "" });
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Course header */}
      <div className="bg-card border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("home")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-sm leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {course.title}
              </h1>
              <span className={cn("text-xs font-medium", colors.badge.split(" ").slice(-2).join(" "))}>
                {course.subtitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={course.driveUrl} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-100 dark:border-emerald-800">
              <BookOpen className="w-3.5 h-3.5" /> Practice Materials
            </a>
            <a href={course.quizUrl} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-100 dark:border-amber-800">
              <Star className="w-3.5 h-3.5" /> Quiz / Practice
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar — lesson list */}
          <aside className="md:w-72 lg:w-80 shrink-0">
            <div className="bg-card rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Lessons ({course.lessons.length})
                </h3>
              </div>
              <div className="overflow-y-auto max-h-72 md:max-h-[calc(100vh-300px)] divide-y divide-slate-50 dark:divide-slate-700/50">
                {course.lessons.map((l, i) => (
                  <button key={l.id} onClick={() => setActiveLesson(i)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors",
                      i === activeLesson
                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-500"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-2 border-transparent"
                    )}>
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors",
                      i === activeLesson
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    )}>
                      {i === activeLesson ? <Play className="w-3 h-3" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs font-semibold leading-snug truncate",
                        i === activeLesson ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {l.title}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{l.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Video player */}
            <div className={cn("relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-4 mb-4", colors.glow)}>
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  key={lesson.videoId}
                  src={`https://www.youtube.com/embed/${lesson.videoId}`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>

            {/* Video info */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {lesson.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", colors.badge)}>
                    {course.title} · Lesson {activeLesson + 1}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{lesson.duration}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a href={course.driveUrl} target="_blank" rel="noopener noreferrer"
                  className="sm:hidden flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                  <BookOpen className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Lesson navigation */}
            <div className="flex items-center justify-between mb-8">
              <button disabled={activeLesson === 0} onClick={() => setActiveLesson(i => i - 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {activeLesson + 1} / {course.lessons.length}
              </span>
              <button disabled={activeLesson === course.lessons.length - 1} onClick={() => setActiveLesson(i => i + 1)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r transition-all hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
                  colors.btn
                )}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Q&A Section */}
            <div className="bg-card rounded-3xl border border-slate-100 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Questions & Discussion
                </h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                  {lessonComments.length}
                </span>
              </div>

              {/* Comment form */}
              <form onSubmit={handleComment} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <input
                  className="w-full px-4 py-3 mb-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={e => setCommentForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
                <textarea
                  className="w-full px-4 py-3 mb-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
                  rows={3}
                  placeholder="Ask a question or share something with the class... 💬"
                  value={commentForm.content}
                  onChange={e => setCommentForm(p => ({ ...p, content: e.target.value }))}
                  required
                />
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95 hover:shadow-md disabled:opacity-60 disabled:hover:scale-100">
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Sending..." : "Post Comment"}
                </button>
              </form>

              {/* Comments list */}
              {lessonComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-400 dark:text-slate-500 text-sm">No comments yet — be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessonComments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0 text-white text-xs font-bold">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">{c.name}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{c.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── 404 PAGE ─────────────────────────────────────────────────────────────────
function NotFoundPage({ onNavigate }: { onNavigate: (page: Page, course?: CourseKey) => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <NotFoundIllustration />
        <h2 className="font-black text-4xl text-slate-900 dark:text-white mt-6 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Oops! Lost in the lesson?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          This page doesn&apos;t exist. No worries — let&apos;s get you back on track and learning! 📖
        </p>
        <button onClick={() => onNavigate("home")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-150">
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [course, setCourse] = useState<CourseKey>("tin-a");
  const [notifications, setNotifications] = useState<Notif[]>(ALL_NOTIFICATIONS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [comments, setComments] = useState<Record<CourseKey, Comment[]>>(INITIAL_COMMENTS);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, course]);

  const navigate = (p: Page, c?: CourseKey) => {
    setPage(p);
    if (c) setCourse(c);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className={cn("font-sans", isDark && "dark")} style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        *:hover { scrollbar-color: #94a3b8 transparent; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
        *:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}</style>

      <Navbar
        isDark={isDark}
        onToggleDark={() => setIsDark(d => !d)}
        onNavigate={navigate}
        currentPage={page}
        currentCourse={page === "course" ? course : undefined}
        notifications={notifications}
        onMarkAllRead={markAllRead}
      />

      {page === "home" && (
        <HomePage onNavigate={navigate} materials={materials} setMaterials={setMaterials} />
      )}
      {page === "course" && (
        <CoursePage
          courseKey={course}
          onNavigate={navigate}
          comments={comments}
          setComments={setComments}
        />
      )}
    </div>
  );
}
