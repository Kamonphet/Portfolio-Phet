export const defaultPortfolioData = {
  th: {
    hero: {
      greeting: "<สวัสดีครับ_WORLD />",
      name: "ครูเพชร IT",
      title: "ครูสาย IT & Creative Technologist",
      tagline: "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต | ผสานวิทยาการคำนวณ ความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity) และนวัตกรรมเว็บเทคโนโลยี",
      status: "พร้อมแบ่งปันความรู้ & สนับสนุนการศึกษาดิจิทัล",
      statusColor: "#00ff87",
      ctaPrimary: "ดูผลงาน & สื่อการสอน",
      ctaSecondary: "ติดต่อพูดคุย"
    },
    about: {
      badge: "SYSTEM_CORE // เกี่ยวกับฉัน",
      heading: "ผสานพลังระหว่างการออกแบบการเรียนรู้ เทคโนโลยีไอที และความปลอดภัยไซเบอร์",
      paragraphs: [
        "สวัสดีครับ! ผม 'ครูเพชร IT' ครูผู้มีความหลงใหลในการประยุกต์ใช้เทคโนโลยีสมัยใหม่เพื่อยกระดับการจัดการเรียนรู้ให้มีประสิทธิภาพสูงสุด ทั้งในด้านวิทยาการคำนวณ ความมั่นคงปลอดภัยไซเบอร์ และการพัฒนาเว็บแอปพลิเคชัน",
        "ด้วยความเชี่ยวชาญด้านหลักสูตรการศึกษา การจัดการเรียนการสอนแบบ Active Learning และทักษะวิศวกรรมซอฟต์แวร์ (Modern Web, Three.js 3D, Cybersecurity & CTF) ผมมุ่งมั่นออกแบบสื่อการสอนและสภาพแวดล้อมดิจิทัลที่ช่วยให้ผู้เรียนเข้าใจเรื่องซับซ้อนได้อย่างสนุกและสร้างสรรค์",
        "พร้อมสนับสนุนงานเอกสารทางวิชาการ การวิจัยในชั้นเรียน และการขับเคลื่อนนวัตกรรมการศึกษาสู่อนาคตอย่างยั่งยืน"
      ],
      avatarUrl: "/img/user-profile.jpg",
      systemSpecs: [
        { label: "สายงานหลัก", value: "ครูสาย IT & EdTech Specialist" },
        { label: "ความเชี่ยวชาญ", value: "Cybersecurity, วิทยาการคำนวณ, IT Support" },
        { label: "ที่อยู่ / พิกัด", value: "ประเทศไทย (Thailand)" },
        { label: "ปรัชญาการทำงาน", value: "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต" }
      ],
      stats: [
        { label: "ปีของการสอน & IT", value: "5+" },
        { label: "สื่อการสอน & โปรเจกต์", value: "40+" },
        { label: "CTF / กิจกรรมไซเบอร์", value: "100+" },
        { label: "ความพึงพอใจผู้เรียน", value: "99%" }
      ]
    },
    skills: [
      { id: "s1", name: "วิทยาการคำนวณ (Computing Science)", level: 95, category: "Frontend", icon: "FaReact" },
      { id: "s2", name: "Cybersecurity & CTF Defense", level: 88, category: "Security", icon: "FaShieldAlt" },
      { id: "s3", name: "สื่อการสอนดิจิทัล (EdTech Media)", level: 92, category: "3D & Creative", icon: "SiFramer" },
      { id: "s4", name: "Active Learning & Lesson Plans", level: 94, category: "Frontend", icon: "SiTypescript" },
      { id: "s5", name: "IT Support & System Admin", level: 86, category: "Backend", icon: "FaNodeJs" },
      { id: "s6", name: "React & Three.js 3D Web", level: 85, category: "3D & Creative", icon: "SiThreedotjs" },
      { id: "s7", name: "Python for Education & Security", level: 84, category: "Backend", icon: "FaPython" },
      { id: "s8", name: "ฐานข้อมูลและการประเมินผล", level: 82, category: "Backend", icon: "FaDatabase" },
      { id: "s9", name: "สุขศึกษาและพฤติกรรมสุขภาพ", level: 90, category: "Frontend", icon: "FaDocker" },
      { id: "s10", name: "การวิจัยในชั้นเรียน & เอกสารครู", level: 88, category: "DevOps", icon: "SiTailwindcss" }
    ],
    projects: [
      {
        id: "p1",
        title: "ครูเพชร IT - แพลตฟอร์มการเรียนรู้และเทคโนโลยีเพื่อการศึกษา",
        category: "EdTech & Web",
        desc: "คลังสื่อการสอนดิจิทัล นวัตกรรมเทคโนโลยีเพื่อการศึกษาแบบ Active Learning พัฒนาศักยภาพด้านวิทยาการคำนวณและเทคโนโลยี 'สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต'",
        image: "/img/main.png",
        tech: ["EdTech", "Active Learning", "วิทยาการคำนวณ", "Interactive 3D"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p2",
        title: "Cybersecurity Defense Lab (ป้องกันไว้ก่อนดีกว่า 🛡️)",
        category: "Security",
        desc: "ระบบจำลองสถานการณ์ความมั่นคงปลอดภัยไซเบอร์และ CTF Training Lab เพื่อสร้างความตระหนักรู้ด้านความปลอดภัยดิจิทัล 'ป้องกันไว้ก่อนดีกว่า'",
        image: "/img/10.png",
        tech: ["Cybersecurity", "Network Security", "CTF Training", "Security Defense"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p3",
        title: "เทคโนโลยีทำให้การศึกษาไปได้ไกลกว่าเดิม (EdTech Next-Gen 💙)",
        category: "EdTech & Web",
        desc: "การผสานเทคโนโลยี AI และคอมพิวเตอร์กราฟิกเพื่อขยายขอบเขตการเรียนรู้ให้กว้างไกล ไร้ขีดจำกัด สนับสนุนผู้เรียนในทุกมิติ",
        image: "/img/14.png",
        tech: ["EdTech Innovation", "Three.js", "AI Education", "Digital Classroom"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p4",
        title: "Full-Stack Development Studio (Good Code Good Life 🎧)",
        category: "Web App",
        desc: "การพัฒนาเว็บแอปพลิเคชันคุณภาพสูง ออกแบบสถาปัตยกรรมระบบที่ปลอดภัยและมีประสิทธิภาพ โฟกัสทุกการเขียนโค้ดด้วยมาตรฐานสูงสุด",
        image: "/img/work2.png",
        tech: ["React", "Node.js", "Python", "Cloud Architecture"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p5",
        title: "เรียนรู้ เชื่อมโยง สู่อนาคต (Future-Ready Education Hub 🚀)",
        category: "EdTech & Web",
        desc: "ศูนย์รวมความรู้ด้านสะเต็ม (STEM) วิทยาการคำนวณ และทักษะไอทีที่เชื่อมโยงผู้เรียนสู่โลกอาชีพยุคดิจิทัล",
        image: "/img/11.png",
        tech: ["Future Skills", "STEM", "Coding Education", "Web Platform"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      },
      {
        id: "p6",
        title: "ครูสาย IT & ศูนย์รวมความเชี่ยวชาญการศึกษา",
        category: "Security",
        desc: "การบูรณาการหลักสูตร Cybersecurity, IT Support, วิทยาการคำนวณ และสุขศึกษา เพื่อพัฒนาผู้เรียนอย่างรอบด้าน",
        image: "/img/introduce.png",
        tech: ["IT Support", "วิทยาการคำนวณ", "Cybersecurity", "สุขศึกษา"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      }
    ],
    experience: [
      {
        id: "e1",
        role: "ครูสาย IT & ผู้พัฒนานวัตกรรมการเรียนรู้",
        company: "สถาบันการศึกษา & EdTech Lab",
        period: "2023 - ปัจจุบัน",
        description: "ออกแบบแผนการจัดการเรียนรู้ตามมาตรฐาน วิจัยชั้นเรียน และพัฒนาสื่อการสอนดิจิทัลแบบ Active Learning"
      },
      {
        id: "e2",
        role: "Cybersecurity & CTF Mentor",
        company: "Cyber Defense & Education Club",
        period: "2021 - 2023",
        description: "ฝึกอบรมการแข่งขัน CTF ความปลอดภัยสารสนเทศ และการวิเคราะห์ความปลอดภัยระบบคอมพิวเตอร์"
      },
      {
        id: "e3",
        role: "IT Support & Web Developer",
        company: "Technology Learning Center",
        period: "2020 - 2021",
        description: "ดูแลโครงสร้างพื้นฐานไอที พัฒนาระบบสารสนเทศ และพัฒนาเว็บไซต์โรงเรียนและระบบจัดการเรียนรู้"
      }
    ],
    contact: {
      email: "krupetch.it@gmail.com",
      phone: "+66 89 123 4567",
      location: "ประเทศไทย (Thailand)",
      availability: "พร้อมแบ่งปันความรู้ เป็นวิทยากร และร่วมพัฒนาโครงการการศึกษา",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      discord: "KruPetch#0001"
    }
  },
  en: {
    hero: {
      greeting: "<HELLO_WORLD />",
      name: "Kru Petch IT",
      title: "IT Educator & Creative Technologist",
      tagline: "Inspiring minds through technology | Integrating Computing Science, Cybersecurity, and Modern Web Innovation.",
      status: "Empowering Next-Gen Digital Education",
      statusColor: "#00ff87",
      ctaPrimary: "Explore Projects & Media",
      ctaSecondary: "Get in Touch"
    },
    about: {
      badge: "SYSTEM_CORE // ABOUT_ME",
      heading: "Uniting pedagogy, software engineering, and cybersecurity.",
      paragraphs: [
        "Hello! I am 'Kru Petch IT', a passionate educator and creative technologist dedicated to transforming digital learning through active learning techniques, computing science, and cybersecurity.",
        "Equipped with modern web engineering skills (React, Three.js WebGL, Secure Systems) and pedagogical expertise, I create engaging educational experiences that make complex concepts intuitive and exciting.",
        "Always exploring, continuously learning, and advancing educational technology for future generations."
      ],
      avatarUrl: "/img/user-profile.jpg",
      systemSpecs: [
        { label: "Core Focus", value: "IT Educator & EdTech Specialist" },
        { label: "Expertise", value: "Cybersecurity, Computing Science, IT Support" },
        { label: "Location", value: "Thailand (Remote Available)" },
        { label: "Motto", value: "Think Critically, Use Tech, Shape the Future" }
      ],
      stats: [
        { label: "Years in Teaching & IT", value: "5+" },
        { label: "Educational Projects", value: "40+" },
        { label: "CTF Challenges Solved", value: "100+" },
        { label: "Student Satisfaction", value: "99%" }
      ]
    },
    skills: [
      { id: "s1", name: "Computing Science Education", level: 95, category: "Frontend", icon: "FaReact" },
      { id: "s2", name: "Cybersecurity & CTF Defense", level: 88, category: "Security", icon: "FaShieldAlt" },
      { id: "s3", name: "Digital Learning Media", level: 92, category: "3D & Creative", icon: "SiFramer" },
      { id: "s4", name: "Active Learning & Pedagogy", level: 94, category: "Frontend", icon: "SiTypescript" },
      { id: "s5", name: "IT Support & Infrastructure", level: 86, category: "Backend", icon: "FaNodeJs" },
      { id: "s6", name: "React & Three.js 3D Web", level: 85, category: "3D & Creative", icon: "SiThreedotjs" },
      { id: "s7", name: "Python for Education & Security", level: 84, category: "Backend", icon: "FaPython" },
      { id: "s8", name: "Educational Research & Docs", level: 88, category: "DevOps", icon: "SiTailwindcss" },
      { id: "s9", name: "Health Education Integration", level: 90, category: "Frontend", icon: "FaDocker" },
      { id: "s10", name: "Database & LMS Systems", level: 82, category: "Backend", icon: "FaDatabase" }
    ],
    projects: [
      {
        id: "p1",
        title: "Kru Petch IT - Educational Technology & Learning Platform",
        category: "EdTech & Web",
        desc: "Digital learning repository, active learning tools, and computing science curriculum designed for next-generation learners.",
        image: "/img/main.png",
        tech: ["EdTech", "Active Learning", "Computing Science", "Interactive Web"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p2",
        title: "Cybersecurity Defense Lab (Prevention First 🛡️)",
        category: "Security",
        desc: "Cybersecurity threat simulation, vulnerability assessment, and hands-on CTF lab environment: 'Prevention is better than cure'.",
        image: "/img/10.png",
        tech: ["Cybersecurity", "Network Security", "CTF Training", "Security Defense"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p3",
        title: "Technology Expands Education Horizons (EdTech Next-Gen 💙)",
        category: "EdTech & Web",
        desc: "Leveraging modern AI, interactive 3D web interfaces, and robotics to empower learners without boundaries.",
        image: "/img/14.png",
        tech: ["EdTech Innovation", "Three.js", "AI Education", "Digital Classroom"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p4",
        title: "Full-Stack Development Studio (Good Code Good Life 🎧)",
        category: "Web App",
        desc: "Engineering high-performance web applications and secure cloud architectures with clean code standards.",
        image: "/img/work2.png",
        tech: ["React", "Node.js", "Python", "Cloud Architecture"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p5",
        title: "Learn, Connect, Shape the Future (Future-Ready Hub 🚀)",
        category: "EdTech & Web",
        desc: "Connecting STEM principles, computing science, and IT support to equip students for tech-driven careers.",
        image: "/img/11.png",
        tech: ["Future Skills", "STEM", "Coding Education", "Web Platform"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      },
      {
        id: "p6",
        title: "Kru Petch IT - Digital Education & Support Specializations",
        category: "Security",
        desc: "Integrated curriculum combining Cybersecurity, IT Support, Computing Science, and Health Education.",
        image: "/img/introduce.png",
        tech: ["IT Support", "Computing Science", "Cybersecurity", "Health Education"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      }
    ],
    experience: [
      {
        id: "e1",
        role: "IT Educator & Learning Innovation Developer",
        company: "Educational Institution & EdTech Lab",
        period: "2023 - Present",
        description: "Designing standard lesson plans, classroom research, and active learning digital media."
      },
      {
        id: "e2",
        role: "Cybersecurity & CTF Mentor",
        company: "Cyber Defense & Education Club",
        period: "2021 - 2023",
        description: "Mentoring CTF competitions, digital safety awareness, and vulnerability assessments."
      },
      {
        id: "e3",
        role: "IT Support & Web Developer",
        company: "Technology Learning Center",
        period: "2020 - 2021",
        description: "Administering IT infrastructure, campus networks, and school learning management websites."
      }
    ],
    contact: {
      email: "krupetch.it@gmail.com",
      phone: "+66 89 123 4567",
      location: "Thailand",
      availability: "Open for Educational Collaboration, Speaking Engagements, and Research",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      discord: "KruPetch#0001"
    }
  },
  settings: {
    themePrimary: "#00f2fe",
    themeSecondary: "#8a2be2",
    themeAccent: "#00ff87",
    active3DShape: "holoCard"
  }
};

export const UI_TRANSLATIONS = {
  th: {
    nav: {
      home: "หน้าแรก",
      about: "เกี่ยวกับฉัน",
      skills: "ทักษะ",
      projects: "ผลงาน",
      experience: "ประสบการณ์",
      contact: "ติดต่อ",
      editMode: "โหมดแก้ไข",
      editActive: "กำลังแก้ไข",
      cms: "จัดการเนื้อหา",
      themeDark: "โหมดมืด",
      themeLight: "โหมดสว่าง",
      toggleTheme: "สลับโหมดมืด/สว่าง",
    },
    hero: {
      connect: "ช่องทางติดต่อ //",
      explore: "ดูผลงานทั้งหมด",
      contactMe: "ติดต่อพูดคุย",
    },
    about: {
      badge: "SYSTEM_CORE // เกี่ยวกับฉัน",
      titlePre: "ผสานพลัง",
      titleHighlight: "วิศวกรรม & การออกแบบ",
      terminal: "TERMINAL // ข้อมูลสังเขป",
      verified: "โค้ดคุณภาพสูง & มีความปลอดภัย",
    },
    skills: {
      badge: "TECH_STACK // ความเชี่ยวชาญ",
      titlePre: "ทักษะและ",
      titleHighlight: "เทคโนโลยีที่เชี่ยวชาญ",
      subtitle: "เทคโนโลยีและเฟรมเวิร์กสมัยใหม่สำหรับการพัฒนาระบบ 3D, Web, และความปลอดภัย",
      categories: ["ทั้งหมด", "Frontend", "Backend", "Security", "3D & Creative", "DevOps"],
      manage: "จัดการทักษะ",
    },
    projects: {
      badge: "PORTFOLIO // ผลงานสร้างสรรค์",
      titlePre: "ผลงานและ",
      titleHighlight: "ระบบที่พัฒนา",
      subtitle: "คลังโปรเจกต์ Full-Stack, 3D Web Graphics และระบบความปลอดภัย",
      categories: ["ทั้งหมด", "EdTech & Web", "Security", "Web App"],
      manage: "จัดการโปรเจกต์",
      demo: "ดูตัวอย่าง",
      code: "ซอร์สโค้ด",
      featured: "ผลงานเด่น",
      launchApp: "เปิดใช้งานเว็บจริง",
      sourceRepo: "ดูโค้ดบน GitHub",
    },
    experience: {
      badge: "JOURNEY // เส้นทางการทำงาน",
      titlePre: "ประวัติการทำงาน &",
      titleHighlight: "ความสำเร็จ",
      subtitle: "บันทึกไทม์ไลน์การทำงาน การจัดการเรียนการสอน การแข่งขัน CTF และผลงานพัฒนาซอฟต์แวร์",
      manage: "จัดการประวัติ",
      remove: "ลบรายการ",
    },
    contact: {
      badge: "TRANSMISSION // ส่งข้อความ",
      titlePre: "มาร่วมสร้างสรรค์การศึกษา &",
      titleHighlight: "นวัตกรรมดิจิทัล",
      subtitle: "มีโปรเจกต์ที่ต้องการพัฒนา สนใจแลกเปลี่ยนเรื่อง Active Learning / CTF / Security หรือต้องการปรึกษา ติดต่อได้เลยครับ",
      directTitle: "ช่องทางติดต่อด่วน",
      copyEmail: "คัดลอกอีเมล",
      copiedEmail: "คัดลอกอีเมลเรียบร้อย!",
      locationTitle: "พิกัด / ที่อยู่",
      networksTitle: "เครือข่ายสังคม & การศึกษา",
      formTitle: "ส่งข้อความถึงครูเพชร IT",
      nameLabel: "ชื่อของคุณ *",
      emailLabel: "อีเมลของคุณ *",
      subjectLabel: "หัวข้อ / เรื่องที่ต้องการติดต่อ",
      messageLabel: "ข้อความ *",
      namePlaceholder: "เช่น สมชาย ใจดี",
      emailPlaceholder: "somchai@example.com",
      subjectPlaceholder: "ปรึกษาการจัดการเรียนรู้ / สื่อการสอน / บรรยาย",
      messagePlaceholder: "บอกเล่ารายละเอียด สิ่งที่คุณต้องการปรึกษา หรือโครงการที่ต้องการร่วมมือ...",
      sendBtn: "ส่งข้อความ",
      sendingBtn: "กำลังส่งข้อความ...",
      successMsg: "ได้รับข้อความเรียบร้อยแล้ว! ครูเพชรจะตอบกลับโดยเร็วที่สุดครับ",
    },
    footer: {
      rights: "สงวนลิขสิทธิ์ทั้งหมด",
      crafted: "พัฒนาด้วย Three.js, React & Framer Motion",
      backupBtn: "ข้อมูล & สำรอง",
      stickersBtn: "สติกเกอร์ครูเพชร IT 🎨",
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
      editMode: "Edit Mode",
      editActive: "Live Edit: ON",
      cms: "Content CMS",
      themeDark: "Dark Mode",
      themeLight: "Light Mode",
      toggleTheme: "Toggle Dark/Light Mode",
    },
    hero: {
      connect: "CONNECT //",
      explore: "Explore Projects",
      contactMe: "Get in Touch",
    },
    about: {
      badge: "SYSTEM_CORE // ABOUT_ME",
      heading: "Uniting pedagogy, software engineering, and cybersecurity.",
      terminal: "TERMINAL // BIO_MANIFEST",
      verified: "Verified Pedagogy & Security Mindset",
    },
    skills: {
      badge: "TECH_STACK // CAPABILITIES",
      titlePre: "Mastered",
      titleHighlight: "Technologies & Pedagogy",
      subtitle: "A curated ecosystem of modern frameworks, cryptographic tools, and educational methodologies.",
      categories: ["All", "Frontend", "Backend", "Security", "3D & Creative", "DevOps"],
      manage: "Manage Skills",
    },
    projects: {
      badge: "PORTFOLIO // ARTIFACTS",
      titlePre: "Featured",
      titleHighlight: "Educational & Tech Systems",
      subtitle: "A showcase of educational technology platforms, security labs, and active learning media.",
      categories: ["All", "EdTech & Web", "Security", "Web App"],
      manage: "Manage Projects",
      demo: "Demo",
      code: "Code",
      featured: "Featured",
      launchApp: "Launch Live App",
      sourceRepo: "Source Repository",
    },
    experience: {
      badge: "JOURNEY // CAREER_TRACK",
      titlePre: "Experience &",
      titleHighlight: "Milestones",
      subtitle: "A chronological log of educational leadership, cybersecurity mentoring, and software development.",
      manage: "Manage Experience Items",
      remove: "Remove Item",
    },
    contact: {
      badge: "TRANSMISSION // INITIATE_CONTACT",
      titlePre: "Let's Build Something",
      titleHighlight: "Extraordinary Together",
      subtitle: "Have an educational project in mind, interested in cybersecurity mentoring, or want to collaborate? Reach out below.",
      directTitle: "Direct Transmission",
      copyEmail: "Copy Email Address",
      copiedEmail: "Email Copied to Clipboard!",
      locationTitle: "Location Matrix",
      networksTitle: "Social & Professional Networks",
      formTitle: "Send Message to Kru Petch IT",
      nameLabel: "Your Name *",
      emailLabel: "Your Email *",
      subjectLabel: "Subject / Purpose",
      messageLabel: "Message Payload *",
      namePlaceholder: "e.g. Alex Mercer",
      emailPlaceholder: "alex@example.com",
      subjectPlaceholder: "Lesson Plan Consulting / Security Workshop / Speaking",
      messagePlaceholder: "Tell me about your project, goals, or collaboration idea...",
      sendBtn: "Transmit Message",
      sendingBtn: "Transmitting Signal...",
      successMsg: "Signal received! Thank you, Kru Petch will reply promptly.",
    },
    footer: {
      rights: "All rights reserved.",
      crafted: "Crafted with Three.js, React & Framer Motion",
      backupBtn: "Content & Backup",
      stickersBtn: "Kru Petch Stickers 🎨",
    }
  }
};

export const KRU_PETCH_STICKERS = [
  {
    id: "user-profile",
    title: "ภาพถ่ายทางการ ครูเพชร IT",
    quote: "มุ่งมั่นพัฒนาการศึกษาและเทคโนโลยี เพื่ออนาคตของเยาวชน",
    image: "/img/user-profile.jpg",
    category: "profile",
    categoryLabel: "โปรไฟล์ & ทางการ",
    badge: "Official Uniform",
    featured: true
  },
  {
    id: "main",
    title: "ครูเพชร IT - เทคโนโลยีเพื่อการศึกษา",
    quote: "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต",
    image: "/img/main.png",
    category: "education",
    categoryLabel: "การศึกษา & นวัตกรรม",
    badge: "Classroom Master",
    featured: true
  },
  {
    id: "hello",
    title: "สวัสดีครับ :)",
    quote: "สวัสดีครับ ยินดีต้อนรับสู่พอร์ตโฟลิโอครับ",
    image: "/img/hello.png",
    category: "greeting",
    categoryLabel: "ทักทาย & เป็นมิตร",
    badge: "Greeting",
    featured: true
  },
  {
    id: "introduce",
    title: "แนะนำตัว ครูเพชร IT",
    quote: "Cybersecurity, IT Support, วิทยาการคำนวณ, สุขศึกษา",
    image: "/img/introduce.png",
    category: "education",
    categoryLabel: "การศึกษา & นวัตกรรม",
    badge: "Specialist",
    featured: true
  },
  {
    id: "work",
    title: "ทำงาน & เรียนรู้",
    quote: "ทำงานไปด้วย เรียนรู้ไปด้วยครับ :)",
    image: "/img/work.png",
    category: "tech",
    categoryLabel: "การทำงาน & พัฒนา",
    badge: "Work & Learn",
    featured: true
  },
  {
    id: "work2",
    title: "โฟกัสงาน... 🎧",
    quote: "โฟกัสงาน... Good Code Good Life",
    image: "/img/work2.png",
    category: "tech",
    categoryLabel: "การทำงาน & พัฒนา",
    badge: "Good Code",
    featured: true
  },
  {
    id: "relax",
    title: "พักบ้างนะครับ :)",
    quote: "อย่าลืมดูแลสุขภาพ พักบ้างนะครับ :)",
    image: "/img/relax.png",
    category: "greeting",
    categoryLabel: "ทักทาย & เป็นมิตร",
    badge: "Relax Time",
    featured: false
  },
  {
    id: "great",
    title: "เยี่ยมเลย! 👍",
    quote: "ทำได้ดีมากครับ เยี่ยมเลย! 👍",
    image: "/img/great.png",
    category: "greeting",
    categoryLabel: "ทักทาย & เป็นมิตร",
    badge: "Excellent",
    featured: true
  },
  {
    id: "cheers",
    title: "สู้ๆ นะครับ :)",
    quote: "ไม่ว่าจะเจองานยากแค่ไหน สู้ๆ นะครับ :)",
    image: "/img/cheers.png",
    category: "greeting",
    categoryLabel: "ทักทาย & เป็นมิตร",
    badge: "Keep Fighting",
    featured: true
  },
  {
    id: "7",
    title: "การเรียนรู้ไม่มีที่สิ้นสุด",
    quote: "การเรียนรู้ไม่มีที่สิ้นสุดครับ :)",
    image: "/img/7.png",
    category: "education",
    categoryLabel: "การศึกษา & นวัตกรรม",
    badge: "Lifelong Learning",
    featured: true
  },
  {
    id: "10",
    title: "ป้องกันไว้ก่อนดีกว่า 🛡️",
    quote: "ความปลอดภัยไซเบอร์ ป้องกันไว้ก่อนดีกว่า",
    image: "/img/10.png",
    category: "security",
    categoryLabel: "Cybersecurity & CTF",
    badge: "Cyber Defense",
    featured: true
  },
  {
    id: "11",
    title: "เรียนรู้ เชื่อมโยง สู่อนาคต 🚀",
    quote: "เรียนรู้ เชื่อมโยง สู่อนาคต 🚀",
    image: "/img/11.png",
    category: "education",
    categoryLabel: "การศึกษา & นวัตกรรม",
    badge: "Future Vision",
    featured: true
  },
  {
    id: "12",
    title: "ลุยกันต่อครับ! 💪",
    quote: "พร้อมแล้ว ลุยกันต่อครับ!",
    image: "/img/12.png",
    category: "greeting",
    categoryLabel: "ทักทาย & เป็นมิตร",
    badge: "Let's Go",
    featured: false
  },
  {
    id: "13",
    title: "ขอบคุณครับ :) 🤍",
    quote: "ขอบคุณที่เข้ามาเยี่ยมชมและสนับสนุนครับ :)",
    image: "/img/13.png",
    category: "greeting",
    categoryLabel: "ทักทาย & เป็นมิตร",
    badge: "Thank You",
    featured: true
  },
  {
    id: "14",
    title: "เทคโนโลยีไปไกลกว่าเดิม 💙",
    quote: "เทคโนโลยี ทำให้การศึกษา ไปได้ไกลกว่าเดิม 💙",
    image: "/img/14.png",
    category: "education",
    categoryLabel: "การศึกษา & นวัตกรรม",
    badge: "EdTech Horizon",
    featured: true
  },
  {
    id: "15",
    title: "พร้อมออกเดินทาง 🎒",
    quote: "พร้อมเรียนรู้และก้าวไปข้างหน้าเสมอ",
    image: "/img/15.png",
    category: "profile",
    categoryLabel: "โปรไฟล์ & ทางการ",
    badge: "Journey",
    featured: false
  },
  {
    id: "16",
    title: "ครูสาย IT เทคโนโลยี",
    quote: "ครูสาย IT เทคโนโลยีเพื่อการเรียนรู้",
    image: "/img/16.png",
    category: "education",
    categoryLabel: "การศึกษา & นวัตกรรม",
    badge: "IT Teacher",
    featured: false
  },
  {
    id: "6",
    title: "ครูสาย IT คูลโหมด 🕶️",
    quote: "ครูสาย IT เทคโนโลยีเพื่อการเรียนรู้ (Cool Mode)",
    image: "/img/6.png",
    category: "profile",
    categoryLabel: "โปรไฟล์ & ทางการ",
    badge: "Cool Master",
    featured: true
  }
];

