import React, { useState } from "react";
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
  FiImage,
  FiLink,
  FiUploadCloud,
  FiLoader,
} from "react-icons/fi";
import { uploadPortfolioImage } from "../lib/portfolioService";
import { validateImageFile, validateImageUrl } from "../utils/security";

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
  } = usePortfolio();

  const isTh = language === "th";

  const tabs = [
    { id: "profile", label: isTh ? "ข้อมูลส่วนตัว & ประวัติ" : "Profile & Bio", icon: <FiUser /> },
    { id: "skills", label: isTh ? "ทักษะ & ความเชี่ยวชาญ" : "Skills & Tech", icon: <FiCode /> },
    { id: "projects", label: isTh ? "จัดการผลงาน & โปรเจกต์" : "Projects", icon: <FiFolder /> },
    { id: "experience", label: isTh ? "ประสบการณ์ & ไทม์ไลน์" : "Experience", icon: <FiBriefcase /> },
    { id: "contact", label: isTh ? "ข้อมูลติดต่อ & โซเชียล" : "Contact & Links", icon: <FiMail /> },
    { id: "backup", label: isTh ? "สำรอง & นำเข้าข้อมูล" : "Import / Export", icon: <FiDownload /> },
  ];

  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState(null);

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
    image: "",
    techStr: "React, Node.js, WebGL",
    demoUrl: "",
    githubUrl: "",
    featured: true,
  });

  // Project Image Upload & URL Management State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newProjImageMode, setNewProjImageMode] = useState("url"); // 'url' | 'upload'
  const [editingImageProjId, setEditingImageProjId] = useState(null);

  const handleUploadNewProjectImage = async (file) => {
    if (!file) return;
    const validation = validateImageFile(file, 5 * 1024 * 1024, isTh);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }
    setUploadError("");
    setIsUploadingImage(true);
    const res = await uploadPortfolioImage(file, "projects");
    setIsUploadingImage(false);
    if (res.success) {
      setNewProject((prev) => ({ ...prev, image: res.url }));
    } else {
      setUploadError(res.error || (isTh ? "อัพโหลดรูปภาพไม่สำเร็จ" : "Failed to upload image"));
    }
  };

  const handleUploadExistingProjectImage = async (file, projId) => {
    if (!file) return;
    const validation = validateImageFile(file, 5 * 1024 * 1024, isTh);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    setIsUploadingImage(true);
    const res = await uploadPortfolioImage(file, "projects");
    setIsUploadingImage(false);
    if (res.success) {
      const updated = (data?.projects || []).map((p) =>
        p.id === projId ? { ...p, image: res.url } : p
      );
      updateProjects(updated);
    } else {
      alert(res.error || (isTh ? "อัพโหลดรูปภาพไม่สำเร็จ" : "Failed to upload image"));
    }
  };

  const handleProjectImageUrlChange = (urlVal) => {
    setNewProject((prev) => ({ ...prev, image: urlVal }));
    const trimmed = urlVal.trim();
    if (!trimmed) {
      setUploadError("");
      return;
    }
    const check = validateImageUrl(trimmed, isTh);
    if (!check.valid) {
      setUploadError(check.error);
    } else {
      setUploadError("");
    }
  };

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
      setImportStatus({
        type: "success",
        text: isTh ? "นำเข้าข้อมูลพอร์ตโฟลิโอเรียบร้อยแล้ว!" : "Successfully imported portfolio data!",
      });
      setImportJsonText("");
    } else {
      setImportStatus({
        type: "error",
        text: isTh ? "เกิดข้อผิดพลาดในการนำเข้าไฟล์ JSON กรุณาตรวจสอบรูปแบบ" : "Error importing JSON. Please check syntax.",
      });
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
        setImportStatus({
          type: "success",
          text: isTh ? "กู้คืนข้อมูลจากไฟล์เรียบร้อยแล้ว!" : "Data restored from file!",
        });
      } else {
        setImportStatus({
          type: "error",
          text: isTh ? "ไฟล์ JSON ไม่ถูกต้องหรือไม่ตรงตามโครงสร้าง" : "Invalid JSON file",
        });
      }
    };
    reader.readAsText(file);
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

    // Validate Project Image
    const imgUrl = (newProject.image || "").trim();
    if (!imgUrl) {
      setUploadError(
        isTh
          ? "กรุณาระบุรูปภาพผลงาน (ใส่ลิงก์รูปภาพ หรือ อัพโหลดไฟล์ภาพ)"
          : "Please provide a project image (URL link or Upload file)."
      );
      return;
    }

    const imgValidation = validateImageUrl(imgUrl, isTh);
    if (!imgValidation.valid) {
      setUploadError(imgValidation.error);
      return;
    }

    const tech = newProject.techStr.split(",").map((t) => t.trim()).filter(Boolean);
    addProject({
      title: newProject.title,
      category: newProject.category,
      desc: newProject.desc,
      image: imgUrl,
      tech,
      demoUrl: newProject.demoUrl || "#",
      githubUrl: newProject.githubUrl || "#",
      featured: newProject.featured,
    });
    setNewProject({
      title: "",
      category: "Web App",
      desc: "",
      image: "",
      techStr: "React, Node.js, WebGL",
      demoUrl: "",
      githubUrl: "",
      featured: true,
    });
    setUploadError("");
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
              {isTh ? "ระบบจัดการข้อมูลพอร์ตโฟลิโอ // " : "PORTFOLIO DATA MANAGER // "}
              <span style={{ color: "var(--color-primary)" }}>LIVE CMS</span>
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
              <span style={{ color: "var(--color-text-dim)", fontSize: "0.75rem" }}>
                {isTh ? "ภาษา:" : "Language:"}
              </span>
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
              title={isTh ? "ปิดหน้าต่างจัดการข้อมูล" : "Close CMS"}
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
          {tabs.map((tab) => (
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
              <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
                {isTh ? "ส่วนหัวโปรไฟล์ (Hero Section)" : "Hero Section"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">{isTh ? "ชื่อที่แสดงบนหน้าเว็บ (Display Name)" : "Display Name"}</label>
                  <input
                    className="cms-input"
                    value={data?.hero?.name || ""}
                    onChange={(e) => updateHero({ name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">{isTh ? "คำทักทาย / แท็กโค้ด (Greeting Tag)" : "Greeting / Code Tag"}</label>
                  <input
                    className="cms-input"
                    value={data?.hero?.greeting || ""}
                    onChange={(e) => updateHero({ greeting: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="cms-label">{isTh ? "ตำแหน่งวิชาชีพ / คำโปรยหลัก (Professional Title)" : "Professional Title / Headline"}</label>
                <input
                  className="cms-input"
                  value={data?.hero?.title || ""}
                  onChange={(e) => updateHero({ title: e.target.value })}
                />
              </div>

              <div>
                <label className="cms-label">{isTh ? "สโลแกน / คำอธิบายเป้าหมาย (Hero Tagline)" : "Hero Tagline / Subtitle"}</label>
                <textarea
                  rows="2"
                  className="cms-input"
                  value={data?.hero?.tagline || ""}
                  onChange={(e) => updateHero({ tagline: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">{isTh ? "สถานะความพร้อม (Availability Status)" : "Availability Status"}</label>
                  <input
                    className="cms-input"
                    value={data?.hero?.status || ""}
                    onChange={(e) => updateHero({ status: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">{isTh ? "ลิงก์รูปภาพโปรไฟล์ (Avatar Image URL)" : "Avatar / Profile Image URL"}</label>
                  <input
                    className="cms-input"
                    placeholder={isTh ? "ใส่ URL รูปภาพโปรไฟล์ เช่น https://... (ห้ามใส่ Path)" : "Avatar image URL e.g. https://... (no paths)"}
                    value={data?.about?.avatarUrl || ""}
                    onChange={(e) => updateAbout({ avatarUrl: e.target.value })}
                    onBlur={(e) => {
                      const val = (e.target.value || "").trim();
                      if (val && !val.startsWith("data:")) {
                        const check = validateImageUrl(val, isTh);
                        if (!check.valid) {
                          alert(check.error);
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <h3 style={{ margin: "1.5rem 0 0.5rem 0", color: "var(--color-primary)" }}>
                {isTh ? "ส่วนเกี่ยวกับฉัน (About Section)" : "About Section"}
              </h3>
              <div>
                <label className="cms-label">{isTh ? "หัวข้อเกี่ยวกับฉัน (About Heading)" : "About Heading"}</label>
                <input
                  className="cms-input"
                  value={data?.about?.heading || ""}
                  onChange={(e) => updateAbout({ heading: e.target.value })}
                />
              </div>

              <div>
                <label className="cms-label">{isTh ? "เนื้อหาแนะนำตัว (แยกย่อหน้าด้วยการเว้น 2 บรรทัด)" : "Bio Paragraphs (separated by blank lines)"}</label>
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

              <h4 style={{ margin: "1rem 0 0.5rem 0", color: "var(--color-secondary)" }}>
                {isTh ? "ตัวเลขสถิติเด่น (Quick Stats Metrics)" : "Quick Stats Metrics"}
              </h4>
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
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>
                  {isTh ? "ทักษะและความเชี่ยวชาญ (Skills & Tech Stack)" : "Skills & Tech Stack"}
                </h3>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-dim)" }}>
                  {isTh ? `เปิดใช้งาน ${(data?.skills || []).length} ทักษะ` : `${(data?.skills || []).length} skills active`}
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
                  <label className="cms-label">{isTh ? "ชื่อทักษะ" : "Skill Name"}</label>
                  <input
                    className="cms-input"
                    placeholder={isTh ? "เช่น Next.js, Docker, CTF, Three.js..." : "e.g. Next.js, Rust, CTF..."}
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">{isTh ? "หมวดหมู่" : "Category"}</label>
                  <select
                    className="cms-input"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  >
                    <option value="Frontend">{isTh ? "ส่วนติดต่อผู้ใช้ (Frontend)" : "Frontend"}</option>
                    <option value="Backend">{isTh ? "ระบบเบื้องหลัง (Backend)" : "Backend"}</option>
                    <option value="Security">{isTh ? "ความปลอดภัยไซเบอร์ (Security / CTF)" : "Security / CTF"}</option>
                    <option value="3D & Creative">{isTh ? "3D & มีเดียสร้างสรรค์" : "3D & Creative"}</option>
                    <option value="DevOps">{isTh ? "เดฟออปส์ & คลาวด์ (DevOps & Cloud)" : "DevOps & Cloud"}</option>
                  </select>
                </div>
                <div>
                  <label className="cms-label">
                    {isTh ? `ระดับ (${newSkill.level}%)` : `Level (${newSkill.level}%)`}
                  </label>
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
                  <FiPlus /> {isTh ? "เพิ่มทักษะ" : "Add"}
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
                        title={isTh ? "ลบทักษะนี้" : "Delete Skill"}
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
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>
                  {isTh ? "จัดการคลังผลงานและโปรเจกต์" : "Project Showcase"}
                </h3>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-dim)" }}>
                  {isTh ? `เผยแพร่แล้ว ${(data?.projects || []).length} รายการ` : `${(data?.projects || []).length} projects published`}
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
                <div style={{ fontWeight: "600", color: "var(--color-accent-1)" }}>
                  {isTh ? "เพิ่มผลงาน / โปรเจกต์ใหม่" : "Add New Project"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">{isTh ? "ชื่อผลงาน / โปรเจกต์ *" : "Project Title *"}</label>
                    <input
                      className="cms-input"
                      placeholder={isTh ? "เช่น ระบบห้องปฏิบัติการความมั่นคงปลอดภัยไซเบอร์ (CTF Lab)" : "e.g. Cyber Matrix Security Tool"}
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">{isTh ? "หมวดหมู่ผลงาน" : "Category"}</label>
                    <select
                      className="cms-input"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    >
                      <option value="EdTech & Web">{isTh ? "เทคโนโลยีการศึกษา & เว็บ (EdTech)" : "EdTech & Web"}</option>
                      <option value="Security">{isTh ? "ความปลอดภัยไซเบอร์ (Security / CTF)" : "Security / CTF"}</option>
                      <option value="Web App">{isTh ? "เว็บแอปพลิเคชัน (Web App)" : "Web App"}</option>
                      <option value="3D & Creative">{isTh ? "3D & มีเดียสร้างสรรค์" : "3D & Creative"}</option>
                      <option value="Mobile">{isTh ? "แอปพลิเคชันมือถือ (Mobile)" : "Mobile"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="cms-label">{isTh ? "รายละเอียดผลงาน *" : "Description *"}</label>
                  <textarea
                    rows="2"
                    className="cms-input"
                    placeholder={isTh ? "อธิบายจุดเด่น เทคโนโลยีที่ใช้ และผลสัมฤทธิ์ของผลงาน..." : "Brief description of the project..."}
                    value={newProject.desc}
                    onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                  />
                </div>

                <div>
                  <label className="cms-label">{isTh ? "แท็กเทคโนโลยี (คั่นด้วยจุลภาค , )" : "Tech Tags (comma separated)"}</label>
                  <input
                    className="cms-input"
                    placeholder={isTh ? "เช่น React, Three.js, Docker, Cybersecurity" : "React, Three.js, Docker"}
                    value={newProject.techStr}
                    onChange={(e) => setNewProject({ ...newProject, techStr: e.target.value })}
                  />
                </div>

                {/* Project Image Selection (URL or File Upload) */}
                <div style={{ background: "rgba(0, 0, 0, 0.25)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                    <label className="cms-label" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                      <FiImage /> {isTh ? "รูปภาพผลงาน (Project Image)" : "Project Image"}
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => setNewProjImageMode("url")}
                        style={{
                          background: newProjImageMode === "url" ? "var(--color-primary)" : "rgba(255, 255, 255, 0.05)",
                          color: newProjImageMode === "url" ? "#000" : "var(--color-text-dim)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FiLink size={12} /> {isTh ? "แนบลิงก์รูป (URL)" : "Image URL"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewProjImageMode("upload")}
                        style={{
                          background: newProjImageMode === "upload" ? "var(--color-primary)" : "rgba(255, 255, 255, 0.05)",
                          color: newProjImageMode === "upload" ? "#000" : "var(--color-text-dim)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FiUploadCloud size={12} /> {isTh ? "อัพโหลดไฟล์ภาพ" : "Upload File"}
                      </button>
                    </div>
                  </div>

                  {newProjImageMode === "url" ? (
                    <div>
                      <input
                        className="cms-input"
                        placeholder={
                          isTh
                            ? "ใส่ URL ลิงก์รูปภาพ เช่น https://images.unsplash.com/... (ห้ามใส่ Path)"
                            : "Full image URL e.g. https://... (no local paths allowed)"
                        }
                        value={newProject.image}
                        onChange={(e) => handleProjectImageUrlChange(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "16px",
                          border: "1.5px dashed var(--color-primary)",
                          borderRadius: "8px",
                          background: "rgba(0, 242, 254, 0.04)",
                          cursor: isUploadingImage ? "wait" : "pointer",
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          style={{ display: "none" }}
                          disabled={isUploadingImage}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadNewProjectImage(file);
                          }}
                        />
                        {isUploadingImage ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary)" }}>
                            <FiLoader size={20} style={{ animation: "spin 1s linear infinite" }} />
                            <span style={{ fontSize: "0.85rem" }}>
                              {isTh ? "กำลังอัพโหลดและประมวลผลรูปภาพ..." : "Uploading and processing image..."}
                            </span>
                          </div>
                        ) : (
                          <>
                            <FiUploadCloud size={24} style={{ color: "var(--color-primary)", marginBottom: "4px" }} />
                            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-text-main)" }}>
                              {isTh ? "คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง" : "Click to select image file from device"}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-dim)" }}>
                              {isTh ? "รองรับเฉพาะ .jpg, .png, .webp (ขนาดไม่เกิน 5MB)" : "Supports .jpg, .png, .webp only (Max 5MB)"}
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  )}

                  {uploadError && (
                    <div style={{ color: "#ff4757", fontSize: "0.78rem", marginTop: "6px" }}>
                      {uploadError}
                    </div>
                  )}

                  {/* Thumbnail Preview */}
                  {newProject.image && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                      <img
                        src={newProject.image}
                        alt="Preview"
                        style={{
                          width: "60px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid var(--color-primary)",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span style={{ fontSize: "0.78rem", color: "var(--color-accent-2)" }}>
                        {isTh ? "✔ ภาพตัวอย่างพร้อมใช้งาน" : "✔ Image preview ready"}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">{isTh ? "ลิงก์เปิดดูผลงานจริง (Live Demo URL)" : "Live Demo URL"}</label>
                    <input
                      className="cms-input"
                      placeholder={isTh ? "เช่น https://myproject.com" : "https://myproject.com"}
                      value={newProject.demoUrl}
                      onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">{isTh ? "ลิงก์ซอร์สโค้ด (GitHub Repository URL)" : "GitHub Repository URL"}</label>
                    <input
                      className="cms-input"
                      placeholder={isTh ? "เช่น https://github.com/..." : "https://github.com/..."}
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
                  <FiPlus /> {isTh ? "+ เพิ่มผลงานลงในคลังพอร์ตโฟลิโอ" : "+ Add Project to Portfolio"}
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", minWidth: "90px" }}>
                      <img
                        src={proj.image}
                        alt={proj.title}
                        style={{
                          width: "90px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingImageProjId(editingImageProjId === proj.id ? null : proj.id)}
                        style={{
                          background: editingImageProjId === proj.id ? "var(--color-primary)" : "rgba(255, 255, 255, 0.08)",
                          color: editingImageProjId === proj.id ? "#000" : "var(--color-text-dim)",
                          border: "none",
                          borderRadius: "4px",
                          padding: "3px 6px",
                          fontSize: "0.72rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FiImage size={11} /> {editingImageProjId === proj.id ? (isTh ? "ปิด" : "Close") : (isTh ? "เปลี่ยนรูป" : "Change Image")}
                      </button>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <input
                          className="cms-input-inline"
                          style={{ fontWeight: "bold", fontSize: "1rem" }}
                          placeholder={isTh ? "ชื่อผลงาน..." : "Project title..."}
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
                          title={isTh ? "ลบผลงานนี้" : "Delete Project"}
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
                        placeholder={isTh ? "รายละเอียดผลงาน..." : "Project description..."}
                        value={proj.desc}
                        onChange={(e) => {
                          const updated = (data?.projects || []).map((p) =>
                            p.id === proj.id ? { ...p, desc: e.target.value } : p
                          );
                          updateProjects(updated);
                        }}
                      />

                      {/* Image Edit Drawer for existing project */}
                      {editingImageProjId === proj.id && (
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid var(--color-primary)",
                            borderRadius: "8px",
                            padding: "10px",
                            marginTop: "4px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FiImage /> {isTh ? "จัดการรูปภาพผลงาน (แนบลิงก์ URL หรือ อัพโหลดภาพใหม่)" : "Manage Project Image (URL or Upload)"}
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                            <input
                              className="cms-input"
                              style={{ flex: 1, minWidth: "200px", fontSize: "0.82rem", padding: "6px 10px", margin: 0 }}
                              placeholder={isTh ? "ใส่ URL ลิงก์รูปภาพ เช่น https://... (ห้ามใส่ Path)" : "Image URL e.g. https://... (no paths)"}
                              value={proj.image}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = (data?.projects || []).map((p) =>
                                  p.id === proj.id ? { ...p, image: val } : p
                                );
                                updateProjects(updated);
                              }}
                              onBlur={(e) => {
                                const val = (e.target.value || "").trim();
                                if (val) {
                                  const check = validateImageUrl(val, isTh);
                                  if (!check.valid) {
                                    alert(check.error);
                                  }
                                }
                              }}
                            />
                            <label
                              style={{
                                background: "var(--color-primary)",
                                color: "#000",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: "bold",
                                cursor: isUploadingImage ? "wait" : "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                style={{ display: "none" }}
                                disabled={isUploadingImage}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadExistingProjectImage(file, proj.id);
                                }}
                              />
                              <FiUploadCloud size={14} />
                              <span>{isUploadingImage ? (isTh ? "กำลังอัพ..." : "Uploading...") : (isTh ? "อัพโหลดไฟล์" : "Upload File")}</span>
                            </label>
                          </div>
                        </div>
                      )}
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
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>
                  {isTh ? "ประวัติการทำงาน & ผลงานโดดเด่น" : "Career & Milestones"}
                </h3>
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
                <div style={{ fontWeight: "600", color: "var(--color-accent-2)" }}>
                  {isTh ? "เพิ่มประวัติ / ประสบการณ์ใหม่" : "Add Experience Item"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="cms-label">{isTh ? "ตำแหน่ง / บทบาท" : "Role Title"}</label>
                    <input
                      className="cms-input"
                      placeholder={isTh ? "เช่น ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี" : "e.g. Senior Security Analyst"}
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">{isTh ? "หน่วยงาน / สถาบัน / องค์กร" : "Company / Team"}</label>
                    <input
                      className="cms-input"
                      placeholder={isTh ? "เช่น โรงเรียน... หรือ บริษัท..." : "e.g. Alpha CyberSec"}
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="cms-label">{isTh ? "ช่วงเวลาปฏิบัติงาน" : "Period"}</label>
                    <input
                      className="cms-input"
                      placeholder={isTh ? "เช่น 2024 - ปัจจุบัน" : "2022 - 2024"}
                      value={newExp.period}
                      onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="cms-label">{isTh ? "รายละเอียดหน้าที่และความสำเร็จ" : "Description"}</label>
                  <textarea
                    rows="2"
                    className="cms-input"
                    placeholder={isTh ? "สรุปภาระงาน ผลงานดีเด่น หรือนวัตกรรมที่พัฒนา..." : "Key contributions and achievements..."}
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
                  <FiPlus /> {isTh ? "+ เพิ่มประสบการณ์" : "+ Add Experience"}
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
                          title={isTh ? "ลบรายการนี้" : "Delete Experience"}
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
              <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
                {isTh ? "ข้อมูลติดต่อและโซเชียลมีเดีย (Contact Information & Social Links)" : "Contact Information & Social Links"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">{isTh ? "ที่อยู่อีเมล (Email Address)" : "Email Address"}</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.email || ""}
                    onChange={(e) => updateContact({ email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">{isTh ? "สถานที่ปฏิบัติงาน / จังหวัด (Location)" : "Location / Base"}</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.location || ""}
                    onChange={(e) => updateContact({ location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">{isTh ? "ลิงก์ GitHub Profile" : "GitHub URL"}</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.github || ""}
                    onChange={(e) => updateContact({ github: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">{isTh ? "ลิงก์ LinkedIn Profile" : "LinkedIn URL"}</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.linkedin || ""}
                    onChange={(e) => updateContact({ linkedin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="cms-label">{isTh ? "ลิงก์ Twitter / X Profile" : "Twitter / X URL"}</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.twitter || ""}
                    onChange={(e) => updateContact({ twitter: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cms-label">{isTh ? "Discord Tag" : "Discord Tag"}</label>
                  <input
                    className="cms-input"
                    value={data?.contact?.discord || ""}
                    onChange={(e) => updateContact({ discord: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="cms-label">{isTh ? "หมายเหตุสถานะการติดต่อ / รับงาน (Availability Note)" : "Availability Note"}</label>
                <input
                  className="cms-input"
                  value={data?.contact?.availability || ""}
                  onChange={(e) => updateContact({ availability: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* BACKUP & IMPORT/EXPORT TAB */}
          {cmsTab === "backup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
                  {isTh ? "สำรองและกู้คืนข้อมูลพอร์ตโฟลิโอ" : "Data Backup & Portability"}
                </h3>
                <p style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", margin: 0 }}>
                  {isTh
                    ? "คุณสามารถส่งออก (Export) ข้อมูลทั้งหมดเป็นไฟล์ JSON เพื่อสำรองไว้ หรืออัพโหลด/วางไฟล์ JSON เพื่อกู้คืนข้อมูลได้ทุกเมื่อ"
                    : "You can export your complete portfolio as a JSON file, or paste/upload a backup to restore it anywhere."}
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
                  <FiDownload /> {isTh ? "ดาวน์โหลดไฟล์สำรอง (JSON)" : "Download Backup (JSON)"}
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
                  <FiUpload /> {isTh ? "อัพโหลดไฟล์ JSON จากเครื่อง" : "Upload JSON File"}
                  <input type="file" accept=".json" onChange={handleFileImport} style={{ display: "none" }} />
                </label>

                <button
                  onClick={() => {
                    const confirmMsg = isTh
                      ? "คุณแน่ใจหรือไม่ว่าต้องการคืนค่าข้อมูลพอร์ตโฟลิโอทั้งหมดเป็นค่าเริ่มต้น?"
                      : "Are you sure you want to reset all portfolio data to defaults?";
                    if (window.confirm(confirmMsg)) {
                      resetToDefault();
                      setImportStatus({
                        type: "success",
                        text: isTh ? "คืนค่าพอร์ตโฟลิโอสู่ค่าเริ่มต้นเรียบร้อยแล้ว!" : "Portfolio reset to original template!",
                      });
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
                  <FiRotateCcw /> {isTh ? "คืนค่าเริ่มต้นทั้งหมด" : "Reset to Default"}
                </button>
              </div>

              {/* Paste JSON box */}
              <div>
                <label className="cms-label">
                  {isTh ? "หรือวางชุดข้อมูล JSON ด้านล่างนี้เพื่อนำเข้า" : "Or Paste JSON Configuration Below"}
                </label>
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
                  {isTh ? "บันทึกและนำเข้าข้อมูล JSON" : "Apply Pasted JSON"}
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
            <FiCheck /> {isTh ? "บันทึกข้อมูลอัตโนมัติเรียบร้อยแล้ว" : "Auto-saved to browser storage"}
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
            {isTh ? "เสร็จสิ้นการแก้ไข" : "Done Editing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
