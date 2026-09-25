import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import {
  FiX,
  FiUser,
  FiCode,
  FiFolder,
  FiBriefcase,
  FiMail,
  FiDownload,
  FiUpload,
  FiRotateCcw,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiLayers,
  FiCloud,
  FiDatabase,
  FiCopy,
  FiExternalLink,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

const SQL_SCHEMA_STRING = `-- ========================================================
-- Supabase Schema for Cyberpunk Portfolio
-- ========================================================
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id BIGSERIAL PRIMARY KEY,
  language TEXT UNIQUE NOT NULL,
  hero JSONB,
  about JSONB,
  skills JSONB,
  projects JSONB,
  experience JSONB,
  contact JSONB,
  settings JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_data;
CREATE POLICY "Allow public read access"
  ON public.portfolio_data FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon insert" ON public.portfolio_data;
CREATE POLICY "Allow anon insert"
  ON public.portfolio_data FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update" ON public.portfolio_data;
CREATE POLICY "Allow anon update"
  ON public.portfolio_data FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'portfolio_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_data;
  END IF;
END $$;`;

const TABS = [
  { id: "profile", label: "Profile & Bio", icon: <FiUser /> },
  { id: "skills", label: "Skills & Tech", icon: <FiCode /> },
  { id: "projects", label: "Projects", icon: <FiFolder /> },
  { id: "experience", label: "Experience", icon: <FiBriefcase /> },
  { id: "contact", label: "Contact & Links", icon: <FiMail /> },
  { id: "database", label: "Cloud Database", icon: <FiCloud /> },
  { id: "backup", label: "Import / Export", icon: <FiDownload /> },
];

const EditModal = () => {
  const {
    data,
    language,
    toggleLanguage,
    isCmsOpen,
    closeCms,
    cmsTab,
    setCmsTab,
    updateHero,
    updateAbout,
    updateSkills,
    addSkill,
    removeSkill,
    updateProjects,
    addProject,
    removeProject,
    updateExperience,
    addExperience,
    removeExperience,
    updateContact,
    exportData,
    importData,
    resetToDefault,
    isSupabaseConfigured,
    cloudConfig,
    isDbLoading,
    isDbSyncing,
    dbSyncedAt,
    saveCloudCredentials,
    removeCloudCredentials,
    testCloudConnection,
    pushToCloud,
    pullFromCloud,
  } = usePortfolio();

  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState(null);

  // Cloud Database state
  const [dbUrlInput, setDbUrlInput] = useState(cloudConfig?.url || "");
  const [dbKeyInput, setDbKeyInput] = useState(cloudConfig?.anonKey || "");
  const [testStatus, setTestStatus] = useState(null);
  const [cloudActionStatus, setCloudActionStatus] = useState(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    if (cloudConfig) {
      setDbUrlInput(cloudConfig.url || "");
      setDbKeyInput(cloudConfig.anonKey || "");
    }
  }, [cloudConfig?.url, cloudConfig?.anonKey]);

  // New Skill Form State
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 80,
    category: "Frontend",
  });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Web App",
    desc: "",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    techStr: "React, Node.js, WebGL",
    demoUrl: "",
    githubUrl: "",
    featured: true,
  });

  // New Experience Form State
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    period: "2024 - Present",
    description: "",
  });

  if (!isCmsOpen) return null;

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const res = importData(importJsonText);
    if (res.success) {
      setImportStatus({ type: "success", text: "Successfully imported portfolio data!" });
      setImportJsonText("");
    } else {
      setImportStatus({ type: "error", text: "Error importing JSON. Please check syntax." });
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = importData(content);
      if (res.success) {
        setImportStatus({ type: "success", text: "Data restored from file!" });
      } else {
        setImportStatus({ type: "error", text: "Invalid JSON file" });
      }
    };
  };

  const handleTestConnection = async () => {
    setTestStatus({ type: "loading", text: "กำลังทดสอบการเชื่อมต่อกับ Supabase..." });
    const res = await testCloudConnection();
    if (res.success) {
      setTestStatus({
        type: "success",
        text: `เชื่อมต่อสำเร็จ! ฐานข้อมูลพร้อมใช้งาน (พบข้อมูล ${res.rowsFound} แถว)`,
      });
    } else {
      setTestStatus({
        type: "error",
        text: res.error || "ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบ URL / Key หรือรัน SQL Schema",
      });
    }
  };

  const handleSaveCredentials = async () => {
    if (!dbUrlInput.trim() || !dbKeyInput.trim()) {
      setCloudActionStatus({ type: "error", text: "กรุณากรอกทั้ง Supabase URL และ Anon Key ให้ครบถ้วน" });
      return;
    }
    setCloudActionStatus({ type: "loading", text: "กำลังบันทึกและเชื่อมต่อ..." });
    await saveCloudCredentials(dbUrlInput.trim(), dbKeyInput.trim());
    setCloudActionStatus({ type: "success", text: "บันทึกและเชื่อมต่อ Cloud สำเร็จแล้ว!" });
    setTimeout(() => setCloudActionStatus(null), 4000);
  };

  const handleDisconnect = () => {
    if (window.confirm("ต้องการยกเลิกการเชื่อมต่อ Cloud Database หรือไม่? (ข้อมูลที่บันทึกไว้ในเบราว์เซอร์จะไม่สูญหาย)")) {
      removeCloudCredentials();
      setDbUrlInput("");
      setDbKeyInput("");
      setTestStatus(null);
      setCloudActionStatus({ type: "info", text: "ยกเลิกการเชื่อมต่อ Cloud แล้ว กลับสู่โหมด Local สำเร็จ" });
      setTimeout(() => setCloudActionStatus(null), 3000);
    }
  };

  const handlePushCloud = async () => {
    setCloudActionStatus({ type: "loading", text: "กำลังส่งข้อมูลทั้งหมดขึ้น Supabase..." });
    const res = await pushToCloud();
    if (res.success) {
      setCloudActionStatus({ type: "success", text: "อัพโหลดข้อมูลขึ้น Cloud สำเร็จเรียบร้อย!" });
    } else {
      setCloudActionStatus({ type: "error", text: res.error || "เกิดข้อผิดพลาดในการอัพโหลด" });
    }
    setTimeout(() => setCloudActionStatus(null), 4000);
  };

  const handlePullCloud = async () => {
    setCloudActionStatus({ type: "loading", text: "กำลังดึงข้อมูลล่าสุดจาก Supabase..." });
    const res = await pullFromCloud();
    if (res.success) {
      setCloudActionStatus({ type: "success", text: "ดึงข้อมูลจาก Cloud และอัพเดตหน้าเว็บสำเร็จ!" });
    } else {
      setCloudActionStatus({ type: "error", text: res.error || "ไม่สามารถดึงข้อมูลได้" });
    }
    setTimeout(() => setCloudActionStatus(null), 4000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_STRING);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleAddNewSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    addSkill({
      name: newSkill.name,
      level: Number(newSkill.level),
      category: newSkill.category,
      icon: "FaCode",
    });
    setNewSkill({ name: "", level: 80, category: "Frontend" });
  };

  const handleAddNewProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const tech = newProject.techStr.split(",").map((t) => t.trim()).filter(Boolean);
    addProject({
      title: newProject.title,
      category: newProject.category,
      desc: newProject.desc,
      image: newProject.image || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      tech,
      demoUrl: newProject.demoUrl || "#",
      githubUrl: newProject.githubUrl || "#",
      featured: newProject.featured,
    });
    setNewProject({
      title: "",
      category: "Web App",
      desc: "",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      techStr: "React, Node.js, WebGL",
      demoUrl: "",
      githubUrl: "",
      featured: true,
    });
  };

  const handleAddNewExp = (e) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) return;
    addExperience({
      role: newExp.role,
      company: newExp.company,
      period: newExp.period,
      description: newExp.description,
    });
    setNewExp({ role: "", company: "", period: "2024 - Present", description: "" });
  };

  return (
    <div
      className="cms-modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(3, 6, 15, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCms();
      }}
    >
      <div
        className="cms-modal-content"
        style={{
          width: "100%",
          maxWidth: "960px",
          height: "90vh",
          maxHeight: "850px",
          background: "linear-gradient(180deg, #0e1526 0%, #080c18 100%)",
          border: "1px solid rgba(0, 242, 254, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 242, 254, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#fff",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.2rem 1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(14, 21, 38, 0.8)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "var(--color-primary)", fontSize: "1.3rem" }}>
              <FiLayers />
            </span>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", letterSpacing: "0.5px" }}>
              PORTFOLIO DATA MANAGER // <span style={{ color: "var(--color-primary)" }}>LIVE CMS</span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Language Switcher in CMS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(0, 242, 254, 0.3)",
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "0.8rem",
                fontWeight: "700",
              }}
            >
              <span style={{ color: "var(--color-text-dim)", fontSize: "0.75rem" }}>Language:</span>
              <button
                onClick={toggleLanguage}
                style={{
                  background: "transparent",
                  border: "none",
                  color: language === "th" ? "var(--color-primary)" : "var(--color-text-dim)",
                  cursor: "pointer",
                  fontWeight: language === "th" ? "bold" : "normal",
                }}
              >
                TH
              </button>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <button
                onClick={toggleLanguage}
                style={{
                  background: "transparent",
                  border: "none",
                  color: language === "en" ? "var(--color-primary)" : "var(--color-text-dim)",
                  cursor: "pointer",
                  fontWeight: language === "en" ? "bold" : "normal",
                }}
              >
                EN
              </button>
            </div>

            <button
              onClick={closeCms}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "0.5rem 1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(8, 12, 24, 0.6)",
            gap: "6px",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCmsTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background:
                  cmsTab === tab.id
                    ? "linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(138, 43, 226, 0.2))"
                    : "transparent",
                color: cmsTab === tab.id ? "var(--color-primary)" : "var(--color-text-dim)",
                fontWeight: cmsTab === tab.id ? "600" : "400",
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderBottom: cmsTab === tab.id ? "2px solid var(--color-primary)" : "2px solid transparent",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem",
          }}
        >
          {/* PROFILE & BIO TAB */}
          {cmsTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>Hero Section</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">Display Name</label>
                  <input
                    className="cms-input"
                    value={data?.hero?.name || ""}
                    onChange={(e) => updateHero({ name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">Greeting / Code Tag</label>
                  <input
                    className="cms-input"
                    value={data?.hero?.greeting || ""}
                    onChange={(e) => updateHero({ greeting: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="cms-label">Professional Title / Headline</label>
                <input
                  className="cms-input"
                  value={data?.hero?.title || ""}
                  onChange={(e) => updateHero({ title: e.target.value })}
                />
              </div>

              <div>
                <label className="cms-label">Hero Tagline / Subtitle</label>
                <textarea
                  rows="2"
                  className="cms-input"
                  value={data?.hero?.tagline || ""}
                  onChange={(e) => updateHero({ tagline: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">Availability Status</label>
                  <input
                    className="cms-input"
                    value={data?.hero?.status || ""}
                    onChange={(e) => updateHero({ status: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">Avatar / Profile Image URL</label>
                  <input
                    className="cms-input"
                    value={data?.about?.avatarUrl || ""}
                    onChange={(e) => updateAbout({ avatarUrl: e.target.value })}
                  />
                </div>
              </div>

              <h3 style={{ margin: "1.5rem 0 0.5rem 0", color: "var(--color-primary)" }}>About Section</h3>
              <div>
                <label className="cms-label">About Heading</label>
                <input
                  className="cms-input"
                  value={data?.about?.heading || ""}
                  onChange={(e) => updateAbout({ heading: e.target.value })}
                />
              </div>

              <div>
                <label className="cms-label">Bio Paragraphs (1 per line)</label>
                <textarea
                  rows="4"
                  className="cms-input"
                  value={(data?.about?.paragraphs || []).join("\n\n")}
                  onChange={(e) =>
                    updateAbout({
                      paragraphs: e.target.value.split("\n\n").filter(Boolean),
                    })
                  }
                />
              </div>

              <h4 style={{ margin: "1rem 0 0.5rem 0", color: "var(--color-secondary)" }}>Quick Stats Metrics</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                {(data?.about?.stats || []).map((st, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <label className="cms-label">{st.label}</label>
                    <input
                      className="cms-input"
                      value={st.value}
                      onChange={(e) => {
                        const newStats = [...(data?.about?.stats || [])];
                        newStats[idx] = { ...newStats[idx], value: e.target.value };
                        updateAbout({ stats: newStats });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {cmsTab === "skills" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>Skills & Tech Stack</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-dim)" }}>
                  {(data?.skills || []).length} skills active
                </span>
              </div>

              {/* Add Skill Box */}
              <form
                onSubmit={handleAddNewSkill}
                style={{
                  background: "rgba(0, 242, 254, 0.05)",
                  border: "1px dashed rgba(0, 242, 254, 0.3)",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <label className="cms-label">Skill Name</label>
                  <input
                    className="cms-input"
                    placeholder="e.g. Next.js, Rust, CTF..."
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">Category</label>
                  <select
                    className="cms-input"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Security">Security / CTF</option>
                    <option value="3D & Creative">3D & Creative</option>
                    <option value="DevOps">DevOps & Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="cms-label">Level ({newSkill.level}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "var(--color-primary)",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    height: "42px",
                  }}
                >
                  <FiPlus /> Add
                </button>
              </form>

              {/* Skills List */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                {(data?.skills || []).map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <input
                        className="cms-input-inline"
                        value={skill.name}
                        onChange={(e) => {
                          const updated = (data?.skills || []).map((s) =>
                            s.id === skill.id ? { ...s, name: e.target.value } : s
                          );
                          updateSkills(updated);
                        }}
                      />
                      <button
                        onClick={() => removeSkill(skill.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ff4757",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
                      <span>{skill.category}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.level}
                      onChange={(e) => {
                        const updated = (data?.skills || []).map((s) =>
                          s.id === skill.id ? { ...s, level: Number(e.target.value) } : s
                        );
                        updateSkills(updated);
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {cmsTab === "projects" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>Project Showcase</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-dim)" }}>
                  {(data?.projects || []).length} projects published
                </span>
              </div>

              {/* Add Project Form */}
              <form
                onSubmit={handleAddNewProject}
                style={{
                  background: "rgba(138, 43, 226, 0.06)",
                  border: "1px dashed rgba(138, 43, 226, 0.3)",
                  borderRadius: "10px",
                  padding: "1.2rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ fontWeight: "600", color: "var(--color-accent-1)" }}>Add New Project</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">Project Title</label>
                    <input
                      className="cms-input"
                      placeholder="e.g. Cyber Matrix Security Tool"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">Category</label>
                    <select
                      className="cms-input"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    >
                      <option value="Web App">Web App</option>
                      <option value="3D & Creative">3D & Creative</option>
                      <option value="Security">Security / CTF</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="cms-label">Description</label>
                  <textarea
                    rows="2"
                    className="cms-input"
                    placeholder="Brief description of the project..."
                    value={newProject.desc}
                    onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">Tech Tags (comma separated)</label>
                    <input
                      className="cms-input"
                      placeholder="React, Three.js, Docker"
                      value={newProject.techStr}
                      onChange={(e) => setNewProject({ ...newProject, techStr: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">Preview Image URL</label>
                    <input
                      className="cms-input"
                      placeholder="https://..."
                      value={newProject.image}
                      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">Live Demo URL</label>
                    <input
                      className="cms-input"
                      placeholder="https://myproject.com"
                      value={newProject.demoUrl}
                      onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">GitHub Repository URL</label>
                    <input
                      className="cms-input"
                      placeholder="https://github.com/..."
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    marginTop: "6px",
                  }}
                >
                  <FiPlus /> Add Project to Portfolio
                </button>
              </form>

              {/* Projects List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(data?.projects || []).map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      padding: "14px",
                      display: "flex",
                      gap: "14px",
                      alignItems: "flex-start",
                    }}
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      style={{
                        width: "90px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <input
                          className="cms-input-inline"
                          style={{ fontWeight: "bold", fontSize: "1rem" }}
                          value={proj.title}
                          onChange={(e) => {
                            const updated = (data?.projects || []).map((p) =>
                              p.id === proj.id ? { ...p, title: e.target.value } : p
                            );
                            updateProjects(updated);
                          }}
                        />
                        <button
                          onClick={() => removeProject(proj.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ff4757",
                            cursor: "pointer",
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <textarea
                        rows="2"
                        className="cms-input"
                        style={{ fontSize: "0.85rem", padding: "6px" }}
                        value={proj.desc}
                        onChange={(e) => {
                          const updated = (data?.projects || []).map((p) =>
                            p.id === proj.id ? { ...p, desc: e.target.value } : p
                          );
                          updateProjects(updated);
                        }}
                      />
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontSize: "0.75rem" }}>
                        {proj.tech.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "rgba(0, 242, 254, 0.1)",
                              color: "var(--color-primary)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {cmsTab === "experience" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>Career & Milestones</h3>
              </div>

              {/* Add Exp Form */}
              <form
                onSubmit={handleAddNewExp}
                style={{
                  background: "rgba(0, 255, 135, 0.05)",
                  border: "1px dashed rgba(0, 255, 135, 0.3)",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ fontWeight: "600", color: "var(--color-accent-2)" }}>Add Experience Item</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">Role Title</label>
                    <input
                      className="cms-input"
                      placeholder="e.g. Senior Security Analyst"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">Company / Team</label>
                    <input
                      className="cms-input"
                      placeholder="e.g. Alpha CyberSec"
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">Period</label>
                    <input
                      className="cms-input"
                      placeholder="2022 - 2024"
                      value={newExp.period}
                      onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="cms-label">Description</label>
                  <textarea
                    rows="2"
                    className="cms-input"
                    placeholder="Key contributions and achievements..."
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "var(--color-accent-2)",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FiPlus /> Add Experience
                </button>
              </form>

              {/* Experience List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(data?.experience || []).map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          className="cms-input-inline"
                          style={{ fontWeight: "bold" }}
                          value={exp.role}
                          onChange={(e) => {
                            const updated = data.experience.map((ex) =>
                              ex.id === exp.id ? { ...ex, role: e.target.value } : ex
                            );
                            updateExperience(updated);
                          }}
                        />
                        <span style={{ color: "var(--color-primary)" }}>@</span>
                        <input
                          className="cms-input-inline"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = (data?.experience || []).map((ex) =>
                              ex.id === exp.id ? { ...ex, company: e.target.value } : ex
                            );
                            updateExperience(updated);
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          className="cms-input-inline"
                          style={{ width: "120px", textAlign: "right", color: "var(--color-text-dim)" }}
                          value={exp.period}
                          onChange={(e) => {
                            const updated = (data?.experience || []).map((ex) =>
                              ex.id === exp.id ? { ...ex, period: e.target.value } : ex
                            );
                            updateExperience(updated);
                          }}
                        />
                        <button
                          onClick={() => removeExperience(exp.id)}
                          style={{ background: "transparent", border: "none", color: "#ff4757", cursor: "pointer" }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows="2"
                      className="cms-input"
                      style={{ fontSize: "0.85rem" }}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = (data?.experience || []).map((ex) =>
                          ex.id === exp.id ? { ...ex, description: e.target.value } : ex
                        );
                        updateExperience(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {cmsTab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>Contact Information & Social Links</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">Email Address</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.email || ""}
                    onChange={(e) => updateContact({ email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">Location / Base</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.location || ""}
                    onChange={(e) => updateContact({ location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">GitHub URL</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.github || ""}
                    onChange={(e) => updateContact({ github: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">LinkedIn URL</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.linkedin || ""}
                    onChange={(e) => updateContact({ linkedin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">Twitter / X URL</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.twitter || ""}
                    onChange={(e) => updateContact({ twitter: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">Discord Tag</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.discord || ""}
                    onChange={(e) => updateContact({ discord: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="cms-label">Availability Note</label>
                <input
                  className="cms-input"
                  value={data?.contact?.availability || ""}
                  onChange={(e) => updateContact({ availability: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* CLOUD DATABASE (SUPABASE) TAB */}
          {cmsTab === "database" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              {/* Header */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <h3 style={{ margin: 0, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FiDatabase /> Cloud Database (Supabase)
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      background: isSupabaseConfigured ? "rgba(0, 255, 135, 0.12)" : "rgba(255, 179, 0, 0.12)",
                      border: `1px solid ${isSupabaseConfigured ? "rgba(0, 255, 135, 0.4)" : "rgba(255, 179, 0, 0.4)"}`,
                      color: isSupabaseConfigured ? "var(--color-accent-2)" : "#ffb300",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: isSupabaseConfigured ? "var(--color-accent-2)" : "#ffb300",
                        boxShadow: isSupabaseConfigured ? "0 0 10px var(--color-accent-2)" : "0 0 8px #ffb300",
                        display: "inline-block",
                      }}
                    />
                    {isSupabaseConfigured ? "Cloud Active (Real-time Sync)" : "Local Storage (Not Connected)"}
                  </div>
                </div>
                <p style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: 0 }}>
                  เชื่อมต่อฐานข้อมูล Supabase (PostgreSQL ฟรีตลอดชีพ) เพื่อให้ข้อมูล Portfolio ของคุณถูกจัดเก็บบน Cloud อย่างถาวร อัพเดตได้จากทุกที่ และซิงค์สดแบบ Real-time
                </p>
              </div>

              {/* Status / Feedback Banner */}
              {(cloudActionStatus || testStatus) && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background:
                      (cloudActionStatus?.type || testStatus?.type) === "success"
                        ? "rgba(0, 255, 135, 0.15)"
                        : (cloudActionStatus?.type || testStatus?.type) === "error"
                        ? "rgba(255, 71, 87, 0.15)"
                        : "rgba(0, 242, 254, 0.15)",
                    border: `1px solid ${
                      (cloudActionStatus?.type || testStatus?.type) === "success"
                        ? "var(--color-accent-2)"
                        : (cloudActionStatus?.type || testStatus?.type) === "error"
                        ? "#ff4757"
                        : "var(--color-primary)"
                    }`,
                    color:
                      (cloudActionStatus?.type || testStatus?.type) === "success"
                        ? "var(--color-accent-2)"
                        : (cloudActionStatus?.type || testStatus?.type) === "error"
                        ? "#ff4757"
                        : "var(--color-primary)",
                  }}
                >
                  {(cloudActionStatus?.type || testStatus?.type) === "success" && <FiCheckCircle size={18} />}
                  {(cloudActionStatus?.type || testStatus?.type) === "error" && <FiAlertTriangle size={18} />}
                  {(cloudActionStatus?.type || testStatus?.type) === "loading" && (
                    <FiRefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                  )}
                  <span>{cloudActionStatus?.text || testStatus?.text}</span>
                </div>
              )}

              {/* Credentials Configuration Card */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--color-card-border)",
                  borderRadius: "10px",
                  padding: "1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, color: "var(--color-text-main)", fontSize: "1rem" }}>
                    ตั้งค่าการเชื่อมต่อ (API Credentials)
                  </h4>
                  {cloudConfig?.source === "env" && (
                    <span style={{ fontSize: "0.78rem", color: "var(--color-accent-1)", background: "rgba(255,209,102,0.15)", padding: "2px 8px", borderRadius: "10px" }}>
                      Loaded from .env
                    </span>
                  )}
                </div>

                <div>
                  <label className="cms-label">Supabase Project URL</label>
                  <input
                    className="cms-input"
                    type="text"
                    placeholder="https://your-project-id.supabase.co"
                    value={dbUrlInput}
                    onChange={(e) => setDbUrlInput(e.target.value)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}
                  />
                </div>

                <div>
                  <label className="cms-label">Supabase Anon / Public API Key</label>
                  <input
                    className="cms-input"
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={dbKeyInput}
                    onChange={(e) => setDbKeyInput(e.target.value)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}
                  />
                </div>

                {/* Connection Buttons */}
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center", marginTop: "4px" }}>
                  <button
                    onClick={handleSaveCredentials}
                    disabled={isDbLoading}
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 0 15px rgba(0, 242, 254, 0.3)",
                    }}
                  >
                    <FiCheck /> บันทึกและเชื่อมต่อ
                  </button>

                  <button
                    onClick={handleTestConnection}
                    style={{
                      background: "rgba(0, 242, 254, 0.1)",
                      border: "1px solid rgba(0, 242, 254, 0.4)",
                      color: "var(--color-primary)",
                      borderRadius: "8px",
                      padding: "10px 18px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FiRefreshCw /> ทดสอบการเชื่อมต่อ
                  </button>

                  {isSupabaseConfigured && (
                    <button
                      onClick={handleDisconnect}
                      style={{
                        background: "rgba(255, 71, 87, 0.1)",
                        border: "1px solid rgba(255, 71, 87, 0.4)",
                        color: "#ff4757",
                        borderRadius: "8px",
                        padding: "10px 18px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginLeft: "auto",
                      }}
                    >
                      ยกเลิกการเชื่อมต่อ
                    </button>
                  )}
                </div>
              </div>

              {/* Cloud Synchronization Card */}
              {isSupabaseConfigured && (
                <div
                  style={{
                    background: "rgba(0, 255, 135, 0.04)",
                    border: "1px solid rgba(0, 255, 135, 0.2)",
                    borderRadius: "10px",
                    padding: "1.4rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <h4 style={{ margin: 0, color: "var(--color-accent-2)", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FiCloud /> จัดการการซิงค์ข้อมูล (Cloud Sync Actions)
                  </h4>
                  <p style={{ color: "var(--color-text-dim)", fontSize: "0.88rem", margin: 0 }}>
                    ระบบเปิดใช้งาน <strong>Real-time Auto-Sync</strong> อยู่ตลอดเวลา เมื่อคุณแก้ไขข้อมูลใดๆ ในหน้านี้ ระบบจะส่งข้อมูลไปบันทึกบน Supabase ทันทีโดยอัตโนมัติ หากต้องการ Force Sync ด้วยตนเองสามารถกดได้ด้านล่าง:
                  </p>

                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button
                      onClick={handlePushCloud}
                      disabled={isDbSyncing}
                      style={{
                        background: "rgba(0, 255, 135, 0.15)",
                        border: "1px solid var(--color-accent-2)",
                        color: "var(--color-accent-2)",
                        borderRadius: "8px",
                        padding: "10px 18px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FiUpload /> {isDbSyncing ? "กำลังส่งข้อมูล..." : "⬆️ ส่งข้อมูลปัจจุบันขึ้น Supabase (Push)"}
                    </button>

                    <button
                      onClick={handlePullCloud}
                      disabled={isDbLoading}
                      style={{
                        background: "rgba(0, 242, 254, 0.15)",
                        border: "1px solid var(--color-primary)",
                        color: "var(--color-primary)",
                        borderRadius: "8px",
                        padding: "10px 18px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FiDownload /> {isDbLoading ? "กำลังดึงข้อมูล..." : "⬇️ ดึงข้อมูลล่าสุดจาก Supabase (Pull)"}
                    </button>
                  </div>

                  {dbSyncedAt && (
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      ซิงค์ล่าสุดเมื่อ: {dbSyncedAt.toLocaleTimeString("th-TH")} ({dbSyncedAt.toLocaleDateString("th-TH")})
                    </span>
                  )}
                </div>
              )}

              {/* Setup Guide Card */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--color-card-border)",
                  borderRadius: "10px",
                  padding: "1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, color: "var(--color-primary)", fontSize: "1rem" }}>
                    📖 วิธีสร้างและตั้งค่า Supabase (ฟรี 100%)
                  </h4>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--color-primary)",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    เปิด Supabase.com <FiExternalLink size={13} />
                  </a>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.88rem", color: "var(--color-text-dim)" }}>
                  <div><strong>1. สมัครใช้งาน:</strong> เข้าไปที่ <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>supabase.com</a> แล้วกด <em>Start your project</em> (ฟรี ไม่มีค่าใช้จ่าย)</div>
                  <div><strong>2. สร้างโปรเจกต์:</strong> ตั้งชื่อโปรเจกต์และกำหนด Password ฐานข้อมูล</div>
                  <div><strong>3. รัน SQL Schema:</strong> ไปที่เมนู <strong>SQL Editor</strong> ทางซ้าย แล้วนำสคริปต์ด้านล่างนี้ไปวางแล้วกด <strong>Run</strong></div>
                </div>

                {/* SQL Code Block with Copy Button */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(0, 0, 0, 0.4)",
                      padding: "8px 14px",
                      borderRadius: "8px 8px 0 0",
                      border: "1px solid var(--color-card-border)",
                      borderBottom: "none",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      supabase-schema.sql
                    </span>
                    <button
                      onClick={handleCopySql}
                      style={{
                        background: sqlCopied ? "var(--color-accent-2)" : "rgba(0, 242, 254, 0.15)",
                        border: `1px solid ${sqlCopied ? "var(--color-accent-2)" : "rgba(0, 242, 254, 0.3)"}`,
                        color: sqlCopied ? "#000" : "var(--color-primary)",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {sqlCopied ? <FiCheck /> : <FiCopy />}
                      {sqlCopied ? "คัดลอกเรียบร้อย!" : "คัดลอก SQL Script"}
                    </button>
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      maxHeight: "180px",
                      overflowY: "auto",
                      background: "rgba(0, 0, 0, 0.6)",
                      border: "1px solid var(--color-card-border)",
                      borderRadius: "0 0 8px 8px",
                      padding: "12px",
                      fontSize: "0.8rem",
                      fontFamily: "var(--font-mono)",
                      color: "#a9b7c6",
                      lineHeight: "1.4",
                    }}
                  >
                    {SQL_SCHEMA_STRING}
                  </pre>
                </div>

                <div style={{ fontSize: "0.88rem", color: "var(--color-text-dim)" }}>
                  <strong>4. นำ Key มาเชื่อมต่อ:</strong> ไปที่ <strong>Project Settings &gt; API</strong> คัดลอก <em>Project URL</em> และ <em>anon public key</em> มาใส่ในช่องด้านบน หรือใส่ในไฟล์ <code>.env</code> ของโปรเจกต์ได้ทันที
                </div>
              </div>
            </div>
          )}

          {/* BACKUP & IMPORT/EXPORT TAB */}
          {cmsTab === "backup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>Data Backup & Portability</h3>
                <p style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", margin: 0 }}>
                  You can export your complete portfolio as a JSON file, or paste/upload a backup to restore it anywhere.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  onClick={exportData}
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FiDownload /> Download Backup (JSON)
                </button>

                <label
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FiUpload /> Upload JSON File
                  <input type="file" accept=".json" onChange={handleFileImport} style={{ display: "none" }} />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset all portfolio data to defaults?")) {
                      resetToDefault();
                      setImportStatus({ type: "success", text: "Portfolio reset to original template!" });
                    }
                  }}
                  style={{
                    background: "rgba(255, 71, 87, 0.15)",
                    border: "1px solid #ff4757",
                    color: "#ff4757",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "auto",
                  }}
                >
                  <FiRotateCcw /> Reset to Default
                </button>
              </div>

              {/* Paste JSON box */}
              <div>
                <label className="cms-label">Or Paste JSON Configuration Below</label>
                <textarea
                  rows="6"
                  className="cms-input"
                  placeholder='{"hero": {...}, "skills": [...]}'
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem" }}
                />
                <button
                  onClick={handleImportSubmit}
                  style={{
                    marginTop: "8px",
                    background: "var(--color-primary)",
                    color: "#000",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Apply Pasted JSON
                </button>
              </div>

              {importStatus && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    background: importStatus.type === "success" ? "rgba(0, 255, 135, 0.15)" : "rgba(255, 71, 87, 0.15)",
                    border: `1px solid ${importStatus.type === "success" ? "var(--color-accent-2)" : "#ff4757"}`,
                    color: importStatus.type === "success" ? "var(--color-accent-2)" : "#ff4757",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  <FiCheck /> {importStatus.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(14, 21, 38, 0.8)",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--color-accent-2)", display: "flex", alignItems: "center", gap: "6px" }}>
            <FiCheck /> Auto-saved to browser storage
          </span>
          <button
            onClick={closeCms}
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
