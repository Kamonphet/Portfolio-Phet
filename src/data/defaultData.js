export const defaultPortfolioData = {
  th: {
    hero: {
      greeting: "สวัสดีครับ ยินดีต้อนรับสู่พื้นที่แห่งการเรียนรู้",
      name: "ครูเพชร IT",
      title: "ครูสาย IT & Creative Technologist",
      tagline: "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต — ผสานวิทยาการคำนวณ ความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity) และนวัตกรรมสื่อการสอนดิจิทัล",
      status: "พร้อมแบ่งปันความรู้ & สนับสนุนการศึกษาดิจิทัล",
      statusColor: "#38BDF8",
      ctaPrimary: "ดูผลงาน & สื่อการสอน",
      ctaSecondary: "ติดต่อพูดคุย"
    },
    about: {
      badge: "วิสัยทัศน์ & ความเชี่ยวชาญ",
      heading: "ผสานพลังระหว่างการออกแบบการเรียนรู้ เทคโนโลยีไอที และความปลอดภัยไซเบอร์",
      paragraphs: [
        "สวัสดีครับ! ผม 'ครูเพชร IT' ครูผู้มีความหลงใหลในการประยุกต์ใช้เทคโนโลยีสมัยใหม่เพื่อยกระดับการจัดการเรียนรู้ให้มีประสิทธิภาพสูงสุด ทั้งในด้านวิทยาการคำนวณ ความมั่นคงปลอดภัยไซเบอร์ และการพัฒนาเว็บแอปพลิเคชัน",
        "ด้วยความเชี่ยวชาญด้านหลักสูตรการศึกษา การจัดการเรียนการสอนแบบ Active Learning และทักษะวิศวกรรมซอฟต์แวร์ (Modern Web, Three.js 3D, Cybersecurity & CTF) ผมมุ่งมั่นออกแบบสื่อการสอนและสภาพแวดล้อมดิจิทัลที่ช่วยให้ผู้เรียนเข้าใจเรื่องซับซ้อนได้อย่างสนุกและสร้างสรรค์",
        "พร้อมสนับสนุนงานเอกสารทางวิชาการ การวิจัยในชั้นเรียน และการขับเคลื่อนนวัตกรรมการศึกษาสู่อนาคตอย่างยั่งยืน"
      ],
      avatarUrl: "/img/user-profile.webp",
      systemSpecs: [
        { label: "สายงานหลัก", value: "ครูสาย IT & EdTech Specialist" },
        { label: "ความเชี่ยวชาญ", value: "Cybersecurity, วิทยาการคำนวณ, IT Support" },
        { label: "พิกัด", value: "ประเทศไทย (Thailand)" },
        { label: "ปรัชญาการทำงาน", value: "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต" }
      ],
      stats: [
        { label: "ปีแห่งการสอน & ดูแลระบบ IT", value: "5+" },
        { label: "สื่อการสอน & นวัตกรรมดิจิทัล", value: "40+" },
        { label: "โจทย์ CTF & กิจกรรมไซเบอร์", value: "100+" },
        { label: "ความพึงพอใจของผู้เรียน", value: "99%" }
      ],
      education: [
        {
          id: "edu1",
          degree: "ประกาศนียบัตรวิชาชีพ (ปวช.)",
          field: "สาขาคอมพิวเตอร์ธุรกิจ",
          institution: "วิทยาลัยอาชีวศึกษา / เทคนิค",
          period: "2558 - 2561",
          image: "/img/edu-school-craft.jpg",
          description: "วางรากฐานด้านระบบคอมพิวเตอร์ การเขียนโปรแกรมเบื้องต้น และการดูแลระบบเครือข่าย"
        },
        {
          id: "edu2",
          degree: "ปริญญาตรี ครุศาสตรบัณฑิต (ค.บ.)",
          field: "สาขาคอมพิวเตอร์ศึกษา",
          institution: "มหาวิทยาลัยราชภัฏ",
          period: "2562 - 2565",
          image: "/img/edu-university-craft.jpg",
          description: "ศึกษาศาสตร์การสอนวิทยาการคำนวณ นวัตกรรมเทคโนโลยีสารสนเทศ และการออกแบบหลักสูตรการศึกษา"
        },
        {
          id: "edu3",
          degree: "ปริญญาโท (กำลังศึกษา)",
          field: "สาขาเทคโนโลยีและนวัตกรรมการศึกษา",
          institution: "บัณฑิตวิทยาลัย",
          period: "2566 - ปัจจุบัน",
          image: "/img/edu-graduate-craft.jpg",
          description: "วิจัยและพัฒนานวัตกรรมการบูรณาการ AI และ Cybersecurity ในการจัดการเรียนรู้ยุคดิจิทัล"
        }
      ]
    },
    skills: [
      { id: "s1", name: "วิทยาการคำนวณ (Computing Science)", level: 95, category: "EdTech & การสอน", icon: "FiCpu" },
      { id: "s2", name: "Cybersecurity & CTF Defense", level: 90, category: "Cybersecurity & CTF", icon: "FaShieldAlt" },
      { id: "s3", name: "สื่อการสอนดิจิทัล (EdTech Media)", level: 94, category: "Creative Web & 3D", icon: "SiFramer" },
      { id: "s4", name: "Active Learning & แผนการเรียนรู้", level: 95, category: "EdTech & การสอน", icon: "FiBookOpen" },
      { id: "s5", name: "IT Support & โครงสร้างพื้นฐานระบบ", level: 88, category: "ระบบและงานวิจัย", icon: "FiServer" },
      { id: "s6", name: "React & Three.js Interactive 3D", level: 86, category: "Creative Web & 3D", icon: "SiThreedotjs" },
      { id: "s7", name: "Python สำหรับการศึกษาและไซเบอร์", level: 86, category: "Cybersecurity & CTF", icon: "FaPython" },
      { id: "s8", name: "ฐานข้อมูลและการวัดประเมินผล", level: 85, category: "ระบบและงานวิจัย", icon: "FaDatabase" },
      { id: "s9", name: "สุขศึกษาและทักษะชีวิตดิจิทัล", level: 90, category: "EdTech & การสอน", icon: "FiHeart" },
      { id: "s10", name: "การวิจัยในชั้นเรียน & นวัตกรรมครู", level: 90, category: "ระบบและงานวิจัย", icon: "FiAward" }
    ],
    projects: [
      {
        id: "p1",
        title: "ครูเพชร IT — แพลตฟอร์มการเรียนรู้และเทคโนโลยีเพื่อการศึกษา",
        category: "EdTech & Web",
        desc: "คลังสื่อการสอนดิจิทัลและนวัตกรรมเทคโนโลยีเพื่อการศึกษาแบบ Active Learning พัฒนาศักยภาพด้านวิทยาการคำนวณและเทคโนโลยีภายใต้แนวคิด 'สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต'",
        image: "/img/main.webp",
        tech: ["EdTech Platform", "Active Learning", "วิทยาการคำนวณ", "Interactive 3D"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p2",
        title: "Cybersecurity Defense Lab — ห้องปฏิบัติการจำลองความปลอดภัยไซเบอร์",
        category: "Security",
        desc: "ระบบจำลองสถานการณ์ความมั่นคงปลอดภัยไซเบอร์และ CTF Training Lab สำหรับฝึกทักษะการวิเคราะห์ช่องโหว่และการป้องกันภัยคุกคามดิจิทัล",
        image: "/img/10.webp",
        tech: ["Cybersecurity", "Network Defense", "CTF Training", "Security Lab"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p3",
        title: "เทคโนโลยีเปิดโลกการศึกษา — สื่อการสอนแห่งอนาคต",
        category: "EdTech & Web",
        desc: "การประยุกต์ใช้ปัญญาประดิษฐ์ (AI) หุ่นยนต์ และเว็บอินเทอร์แอคทีฟ 3 มิติ เพื่อสร้างแรงบันดาลใจและเปิดโลกทัศน์การเรียนรู้ไร้พรมแดนให้แก่ผู้เรียน",
        image: "/img/14.webp",
        tech: ["AI in Education", "Three.js", "Digital Classroom", "STEM"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p4",
        title: "Full-Stack Educational Web Studio — พัฒนาเว็บและระบบสารสนเทศ",
        category: "Web App",
        desc: "ออกแบบและพัฒนาระบบเว็บแอปพลิเคชันสำหรับสถานศึกษา โครงสร้างโค้ดสะอาด ปลอดภัย และรองรับการใช้งานจริงในยุคคลาวด์",
        image: "/img/work2.webp",
        tech: ["React", "Node.js", "Python", "Cloud Architecture"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p5",
        title: "เรียนรู้ เชื่อมโยง สร้างอนาคต — บทเรียนวิทยาการคำนวณเชิงรุก",
        category: "EdTech & Web",
        desc: "ชุดกิจกรรมการเรียนรู้ที่เชื่อมโยงแนวคิดเชิงคำนวณ (Computational Thinking) การเขียนโค้ด และการแก้ปัญหาในชีวิตจริงเข้าด้วยกัน",
        image: "/img/11.webp",
        tech: ["Computational Thinking", "STEM", "Coding Pedagogy", "Interactive Media"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      },
      {
        id: "p6",
        title: "หลักสูตรบูรณาการทักษะไอที ความปลอดภัยไซเบอร์ และสุขภาวะดิจิทัล",
        category: "Security",
        desc: "การออกแบบหน่วยการเรียนรู้บูรณาการระหว่าง IT Support, วิทยาการคำนวณ, ความมั่นคงปลอดภัยไซเบอร์ และการดูแลสุขภาวะในยุคดิจิทัล",
        image: "/img/introduce.webp",
        tech: ["Digital Citizenship", "Computing Science", "Cyber Hygiene", "Active Pedagogy"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      },
      {
        id: "p7",
        title: "ชุดคาแรคเตอร์ 'ครูเพชร IT' — สื่อสร้างบรรยากาศการเรียนรู้เชิงบวก",
        category: "Stickers & Art",
        desc: "งานออกแบบชุดคาแรคเตอร์ 3D และสติกเกอร์สำหรับใช้ในสื่อการสอน ใบงาน และระบบ LMS เพื่อสร้างรอยยิ้มและแรงจูงใจให้ผู้เรียน",
        image: "/img/hello.webp",
        tech: ["Character Design", "3D Illustration", "Positive Classroom", "Visual Media"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      },
      {
        id: "p8",
        title: "Active Learning Toolkit — ชุดสื่อเสริมแรงและกิจกรรมกลุ่ม",
        category: "Stickers & Art",
        desc: "สื่อกราฟิกและอินโฟกราฟิกประกอบการจัดการเรียนรู้แบบ Gamification ช่วยเปลี่ยนเนื้อหาวิชาการให้เข้าใจง่ายและน่าติดตาม",
        image: "/img/6.webp",
        tech: ["Gamification", "Visual Learning", "Instructional Design", "EdTech Art"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      }
    ],
    experience: [
      {
        id: "e1",
        role: "ครูสาย IT & นักพัฒนานวัตกรรมการเรียนรู้",
        company: "สถานศึกษา & ห้องปฏิบัติการเทคโนโลยีการศึกษา",
        period: "2566 - ปัจจุบัน",
        description: "ออกแบบแผนการจัดการเรียนรู้ตามมาตรฐานหลักสูตร ดำเนินการวิจัยในชั้นเรียน และพัฒนาสื่อการสอนดิจิทัลแบบ Active Learning ด้านวิทยาการคำนวณ"
      },
      {
        id: "e2",
        role: "ผู้ฝึกสอนทักษะ Cybersecurity & CTF Mentor",
        company: "ชมรมความมั่นคงปลอดภัยไซเบอร์และนวัตกรรมดิจิทัล",
        period: "2564 - 2566",
        description: "ฝึกอบรมทักษะการแข่งขัน Capture The Flag (CTF) สร้างความตระหนักรู้ด้านพลเมืองดิจิทัล และการวิเคราะห์ความปลอดภัยของระบบสารสนเทศ"
      },
      {
        id: "e3",
        role: "ผู้ดูแลระบบไอที & นักพัฒนาเว็บแอปพลิเคชัน",
        company: "ศูนย์เทคโนโลยีสารสนเทศเพื่อการศึกษา",
        period: "2563 - 2564",
        description: "บริหารจัดการโครงสร้างพื้นฐานไอที ระบบเครือข่ายในสถานศึกษา และพัฒนาเว็บไซต์ร่วมกับระบบบริหารจัดการการเรียนรู้ (LMS)"
      }
    ],
    contact: {
      email: "krupetch.it@gmail.com",
      phone: "+66 89 123 4567",
      location: "ประเทศไทย (Thailand)",
      availability: "พร้อมแบ่งปันความรู้ เป็นวิทยากร และร่วมพัฒนาโครงการเทคโนโลยีการศึกษา",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      discord: "KruPetch#0001"
    }
  },
  en: {
    hero: {
      greeting: "Hello & Welcome to the Learning Hub",
      name: "Kru Petch IT",
      title: "IT Educator & Creative Technologist",
      tagline: "Educate, Innovate, Secure — Integrating Computing Science, Cybersecurity, and Interactive Web Media for Next-Gen Classrooms.",
      status: "Empowering Next-Gen Digital Education",
      statusColor: "#38BDF8",
      ctaPrimary: "Explore Projects & Media",
      ctaSecondary: "Get in Touch"
    },
    about: {
      badge: "Vision & Expertise",
      heading: "Uniting pedagogy, software engineering, and cybersecurity.",
      paragraphs: [
        "Hello! I am 'Kru Petch IT', an educator and creative technologist dedicated to transforming digital classrooms through active learning, computing science, and cybersecurity literacy.",
        "Combining modern web engineering (React, Three.js WebGL, Secure Architecture) with curriculum design, I craft interactive media and learning environments that turn abstract technical concepts into engaging experiences.",
        "Committed to classroom research, academic excellence, and building sustainable educational innovation."
      ],
      avatarUrl: "/img/user-profile.webp",
      systemSpecs: [
        { label: "Core Focus", value: "IT Educator & EdTech Specialist" },
        { label: "Expertise", value: "Cybersecurity, Computing Science, IT Support" },
        { label: "Location", value: "Thailand" },
        { label: "Philosophy", value: "Think Critically, Use Tech, Shape the Future" }
      ],
      stats: [
        { label: "Years in Teaching & IT", value: "5+" },
        { label: "Digital Learning Artifacts", value: "40+" },
        { label: "CTF & Cyber Labs", value: "100+" },
        { label: "Learner Satisfaction", value: "99%" }
      ],
      education: [
        {
          id: "edu1",
          degree: "Vocational Certificate",
          field: "Business Computer",
          institution: "Technical & Vocational College",
          period: "2015 - 2018",
          image: "/img/edu-school-craft.jpg",
          description: "Built strong foundations in computer architecture, programming fundamentals, and network systems."
        },
        {
          id: "edu2",
          degree: "Bachelor of Education (B.Ed.)",
          field: "Computer Education",
          institution: "Rajabhat University",
          period: "2019 - 2022",
          image: "/img/edu-university-craft.jpg",
          description: "Specialized in computing science pedagogy, instructional media design, and educational curriculum."
        },
        {
          id: "edu3",
          degree: "Master's Degree (In Progress)",
          field: "Educational Technology & Innovation",
          institution: "Graduate School",
          period: "2023 - Present",
          image: "/img/edu-graduate-craft.jpg",
          description: "Researching the integration of AI and Cybersecurity Labs in modern active learning classrooms."
        }
      ]
    },
    skills: [
      { id: "s1", name: "Computing Science Pedagogy", level: 95, category: "EdTech & Pedagogy", icon: "FiCpu" },
      { id: "s2", name: "Cybersecurity & CTF Defense", level: 90, category: "Cybersecurity & CTF", icon: "FaShieldAlt" },
      { id: "s3", name: "Digital Learning Media", level: 94, category: "Creative Web & 3D", icon: "SiFramer" },
      { id: "s4", name: "Active Learning & Lesson Design", level: 95, category: "EdTech & Pedagogy", icon: "FiBookOpen" },
      { id: "s5", name: "IT Support & Infrastructure", level: 88, category: "Systems & Research", icon: "FiServer" },
      { id: "s6", name: "React & Three.js 3D Web", level: 86, category: "Creative Web & 3D", icon: "SiThreedotjs" },
      { id: "s7", name: "Python for Education & Security", level: 86, category: "Cybersecurity & CTF", icon: "FaPython" },
      { id: "s8", name: "Database & Assessment Systems", level: 85, category: "Systems & Research", icon: "FaDatabase" },
      { id: "s9", name: "Health & Digital Well-being", level: 90, category: "EdTech & Pedagogy", icon: "FiHeart" },
      { id: "s10", name: "Classroom Action Research", level: 90, category: "Systems & Research", icon: "FiAward" }
    ],
    projects: [
      {
        id: "p1",
        title: "Kru Petch IT — Educational Technology & Active Learning Platform",
        category: "EdTech & Web",
        desc: "A comprehensive digital learning repository, interactive computing science tools, and active learning curriculum built for next-generation classrooms.",
        image: "/img/main.webp",
        tech: ["EdTech Platform", "Active Learning", "Computing Science", "Interactive 3D"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p2",
        title: "Cybersecurity Defense Lab — Hands-On CTF & Security Training",
        category: "Security",
        desc: "Simulated cybersecurity scenarios, vulnerability analysis exercises, and CTF training modules designed to cultivate defensive security mindsets.",
        image: "/img/10.webp",
        tech: ["Cybersecurity", "Network Defense", "CTF Training", "Security Lab"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p3",
        title: "Technology Expands Education Horizons — Next-Gen Classroom Media",
        category: "EdTech & Web",
        desc: "Integrating modern AI tools, interactive 3D web experiences, and robotics to spark curiosity and limitless learning.",
        image: "/img/14.webp",
        tech: ["AI in Education", "Three.js", "Digital Classroom", "STEM"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p4",
        title: "Full-Stack Educational Web Studio — Campus & Cloud Systems",
        category: "Web App",
        desc: "Engineering high-performance educational web applications and secure cloud architectures with clean code standards.",
        image: "/img/work2.webp",
        tech: ["React", "Node.js", "Python", "Cloud Architecture"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
      },
      {
        id: "p5",
        title: "Learn, Connect, Shape the Future — Computational Thinking Modules",
        category: "EdTech & Web",
        desc: "Connecting STEM principles, algorithmic thinking, and real-world problem solving to prepare students for future careers.",
        image: "/img/11.webp",
        tech: ["Computational Thinking", "STEM", "Coding Pedagogy", "Interactive Media"],
        demoUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: false
      },
      {
        id: "p6",
        title: "Integrated Curriculum: IT Support, Cyber Hygiene & Digital Wellness",
        category: "Security",
        desc: "A cross-disciplinary curriculum uniting Cybersecurity fundamentals, IT troubleshooting, and digital well-being.",
        image: "/img/introduce.webp",
        tech: ["Digital Citizenship", "Computing Science", "Cyber Hygiene", "Active Pedagogy"],
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
        description: "Designing standard-aligned lesson plans, conducting classroom action research, and building active learning digital media."
      },
      {
        id: "e2",
        role: "Cybersecurity & CTF Mentor",
        company: "Cyber Defense & Digital Innovation Club",
        period: "2021 - 2023",
        description: "Mentoring students for Capture The Flag (CTF) competitions, digital citizenship, and practical security analysis."
      },
      {
        id: "e3",
        role: "IT Infrastructure & Web Developer",
        company: "Educational Technology Center",
        period: "2020 - 2021",
        description: "Administering campus IT infrastructure, network security, and school learning management web platforms."
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
    themePrimary: "#38BDF8",
    themeSecondary: "#0284C7",
    themeAccent: "#38BDF8",
    active3DShape: "holoCard"
  }
};

export const UI_TRANSLATIONS = {
  th: {
    nav: {
      home: "หน้าแรก",
      about: "เกี่ยวกับฉัน",
      skills: "ความเชี่ยวชาญ",
      projects: "ผลงาน",
      experience: "เส้นทางวิชาชีพ",
      contact: "ติดต่อ",
      editMode: "โหมดแก้ไข",
      editActive: "กำลังแก้ไข",
      cms: "จัดการเนื้อหา",
      themeDark: "โหมดมืด",
      themeLight: "โหมดสว่าง",
      toggleTheme: "สลับโหมดมืด/สว่าง",
    },
    hero: {
      connect: "เครือข่าย",
      explore: "ดูผลงานและสื่อการสอน",
      contactMe: "ติดต่อพูดคุย",
    },
    about: {
      badge: "เกี่ยวกับครูเพชร IT",
      titlePre: "ผสานศาสตร์การสอน",
      titleHighlight: "เทคโนโลยี & ความปลอดภัยไซเบอร์",
      terminal: "แนวคิดและปรัชญาการทำงาน",
      verified: "ครูสาย IT & นักพัฒนานวัตกรรมการศึกษา",
      educationTitle: "เส้นทางวิชาการและการศึกษา",
      educationHighlight: "การศึกษา",
    },
    skills: {
      badge: "ความเชี่ยวชาญ",
      titlePre: "ความเชี่ยวชาญและ",
      titleHighlight: "เครื่องมือสร้างสรรค์การเรียนรู้",
      subtitle: "บูรณาการทักษะวิทยาการคำนวณ ความมั่นคงปลอดภัยไซเบอร์ และการพัฒนาเว็บเทคโนโลยีเพื่อห้องเรียนยุคใหม่",
      categories: ["ทั้งหมด", "EdTech & การสอน", "Cybersecurity & CTF", "Creative Web & 3D", "ระบบและงานวิจัย"],
      manage: "จัดการทักษะ",
    },
    projects: {
      badge: "คลังผลงาน",
      titlePre: "นวัตกรรมการศึกษาและ",
      titleHighlight: "ผลงานสร้างสรรค์",
      subtitle: "คัดสรรแพลตฟอร์มการเรียนรู้ ห้องปฏิบัติการไซเบอร์ และสื่ออินเทอร์แอคทีฟที่ออกแบบเพื่อผู้เรียนจริง",
      categories: ["ทั้งหมด", "EdTech & Web", "Security", "Web App"],
      manage: "จัดการโปรเจกต์",
      demo: "เปิดดูผลงาน",
      code: "ซอร์สโค้ด",
      featured: "ผลงานชิ้นเอก",
      launchApp: "เปิดใช้งานเว็บจริง",
      sourceRepo: "ดูโค้ดบน GitHub",
      viewAll: "ดูคลังผลงานทั้งหมด",
      backToHome: "กลับสู่หน้าแรก",
    },
    experience: {
      badge: "ประสบการณ์",
      titlePre: "เส้นทางวิชาชีพและ",
      titleHighlight: "การขับเคลื่อนการศึกษา",
      subtitle: "ประสบการณ์การจัดการเรียนการสอน การฝึกซ้อมการแข่งขันไซเบอร์ และการพัฒนาระบบสารสนเทศ",
      manage: "จัดการประวัติ",
      remove: "ลบรายการ",
    },
    contact: {
      badge: "ติดต่อร่วมงาน",
      titlePre: "ร่วมสร้างสรรค์การศึกษาและ",
      titleHighlight: "นวัตกรรมดิจิทัลไปด้วยกัน",
      subtitle: "สนใจแลกเปลี่ยนเรียนรู้ เชิญเป็นวิทยากรด้าน Cybersecurity / Active Learning หรือปรึกษาโครงการติดต่อได้ทันทีครับ",
      directTitle: "อีเมลติดต่อโดยตรง",
      copyEmail: "คัดลอกอีเมล",
      copiedEmail: "คัดลอกอีเมลเรียบร้อย!",
      locationTitle: "พิกัดและสถานะความพร้อม",
      networksTitle: "ช่องทางออนไลน์",
      formTitle: "ส่งข้อความถึงครูเพชร IT",
      nameLabel: "ชื่อผู้ติดต่อ *",
      emailLabel: "อีเมลของคุณ *",
      subjectLabel: "หัวข้อเรื่อง",
      messageLabel: "รายละเอียด *",
      namePlaceholder: "สมชาย ใจดี",
      emailPlaceholder: "somchai@example.com",
      subjectPlaceholder: "เชิญเป็นวิทยากร / แลกเปลี่ยนสื่อการสอน / ปรึกษาโปรเจกต์",
      messagePlaceholder: "ระบุรายละเอียดที่ต้องการพูดคุยหรือประสานงาน...",
      sendBtn: "ส่งข้อความ",
      sendingBtn: "กำลังส่งข้อความ...",
      successMsg: "ได้รับข้อความเรียบร้อยแล้ว ครูเพชรจะติดต่อกลับโดยเร็วที่สุดครับ",
    },
    footer: {
      rights: "สงวนลิขสิทธิ์",
      crafted: "สอนให้คิด ใช้เทคโนโลยี สร้างอนาคต",
      backupBtn: "ข้อมูล & สำรอง",
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Capabilities",
      projects: "Works",
      experience: "Journey",
      contact: "Contact",
      editMode: "Edit Mode",
      editActive: "Live Edit: ON",
      cms: "Content CMS",
      themeDark: "Dark Mode",
      themeLight: "Light Mode",
      toggleTheme: "Toggle Dark/Light Mode",
    },
    hero: {
      connect: "Networks",
      explore: "Explore Works & Media",
      contactMe: "Get in Touch",
    },
    about: {
      badge: "About Kru Petch IT",
      heading: "Uniting pedagogy, software engineering, and cybersecurity.",
      titlePre: "Uniting Pedagogy,",
      titleHighlight: "Engineering & Cybersecurity",
      terminal: "Educational Philosophy & Approach",
      verified: "Verified Educator & Creative Technologist",
      educationTitle: "Academic Foundations",
      educationHighlight: "Education",
    },
    skills: {
      badge: "Capabilities",
      titlePre: "Core Capabilities &",
      titleHighlight: "Educational Tooling",
      subtitle: "A multidisciplinary toolkit spanning computing science pedagogy, defensive cybersecurity, and interactive 3D web engineering.",
      categories: ["All", "EdTech & Pedagogy", "Cybersecurity & CTF", "Creative Web & 3D", "Systems & Research"],
      manage: "Manage Skills",
    },
    projects: {
      badge: "Selected Works",
      titlePre: "Educational Platforms &",
      titleHighlight: "Creative Artifacts",
      subtitle: "Curated digital learning platforms, cybersecurity training labs, and classroom media designed for real learner impact.",
      categories: ["All", "EdTech & Web", "Security", "Web App"],
      manage: "Manage Projects",
      demo: "Live Demo",
      code: "Source",
      featured: "Flagship Work",
      launchApp: "Launch Live App",
      sourceRepo: "Source Repository",
      viewAll: "View Full Archive",
      backToHome: "Back to Home",
    },
    experience: {
      badge: "Career Track",
      titlePre: "Professional Journey &",
      titleHighlight: "Educational Impact",
      subtitle: "A chronological record of classroom leadership, cybersecurity mentoring, and campus systems engineering.",
      manage: "Manage Experience",
      remove: "Remove Item",
    },
    contact: {
      badge: "Collaboration",
      titlePre: "Let's Shape the Future of",
      titleHighlight: "Digital Education Together",
      subtitle: "Interested in curriculum collaboration, cybersecurity workshops, or speaking engagements? Reach out directly below.",
      directTitle: "Direct Email",
      copyEmail: "Copy Email Address",
      copiedEmail: "Copied to Clipboard!",
      locationTitle: "Location & Availability",
      networksTitle: "Professional Channels",
      formTitle: "Send a Message to Kru Petch IT",
      nameLabel: "Your Name *",
      emailLabel: "Your Email *",
      subjectLabel: "Subject / Topic",
      messageLabel: "Message *",
      namePlaceholder: "Alex Mercer",
      emailPlaceholder: "alex@example.com",
      subjectPlaceholder: "Workshop Invitation / EdTech Collaboration / Inquiry",
      messagePlaceholder: "Share details about your school, event, or project...",
      sendBtn: "Send Message",
      sendingBtn: "Sending...",
      successMsg: "Message received! Thank you, Kru Petch will respond shortly.",
    },
    footer: {
      rights: "All rights reserved.",
      crafted: "Think Critically, Use Tech, Shape the Future",
      backupBtn: "Content & Backup",
    }
  }
};
