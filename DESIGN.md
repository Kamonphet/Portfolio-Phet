# DESIGN SYSTEM SPECIFICATION: Impeccable v4.7 & Shaders Architecture

> **Visual World:** Clean Cyber Editorial (ความเฉียบคมของเทคโนโลยีผสานความประณีตระดับนิตยสารและการออกแบบผลิตภัณฑ์)  
> **Primary Mode:** Experience Mode (Artifact & Identity First)

---

## 1. Craft Floor & Non-Negotiable Rules (Impeccable v4.7)

1. **No Eyebrow Kickers or Arbitrary Section Numbers:**
   - ตัดป้าย Kicker เหนือหัวข้อและเลขลำดับจำลอง (`// 00`, `// 01 —`, `// 02 —`) ออกทั้งหมด ให้ **Section Heading** สื่อสารด้วยขนาด น้ำหนัก และการจัดวางที่ทรงพลังด้วยตัวเอง
2. **No Terminal Costumes or Nested Card Soup:**
   - ไม่ใช้หน้าต่างจำลอง Terminal (`krupetch@sys-core:~#`) หรือป้าย `SYSTEM_CORE //` เป็นเครื่องประดับ
   - ไม่ซ้อนการ์ดไว้ในการ์ด (No cards inside cards) ใช้เส้นแบ่ง (Hairline dividers) และช่องไฟ (Whitespace) ในการจัดกลุ่มข้อมูลภายในคอนเทนเนอร์แทน
3. **Single Elevation Principle:**
   - เลือกแสดงมิติของพื้นผิวอย่างชัดเจน ไม่ใช้เงาฟุ้งขนาดใหญ่ซ้อนกับเส้นขอบสว่างจนดูเป็น Ghost Card ใช้รัศมีมุมการ์ดที่กระชับ (`14px–16px`) และใช้ทรงแคปซูล (`100px`) เฉพาะกับปุ่มควบคุมหรือป้ายสถานะขนาดเล็ก
4. **Honest Typography & Tabular Numerals:**
   - ใช้ `--font-display` (`Inter`, `IBM Plex Sans Thai`) สำหรับหัวข้อ เน้นน้ำหนักและขนาดแทนการพึ่งพา Gradient Text ทุกจุด
   - ใช้ `--font-mono` (`JetBrains Mono`) เฉพาะกับข้อมูลตัวเลข สถิติ ปี พ.ศ./ค.ศ. และแท็กทางเทคนิค พร้อมกำหนด `font-variant-numeric: tabular-nums`

---

## 2. Shader & Motion Architecture (`shader-effects-inc/shaders` Pattern)

1. **Single Unified Background Shader (`BackgroundCanvas.jsx`):**
   - แทนที่การรันหลาย WebGLRenderer ซ้อนกัน ด้วย **Declarative-Style WebGL Fragment Shader** เพียงหนึ่งเดียว
   - โครงสร้างเลเยอร์ของ Shader:
     - **Layer 1 (OKLab Flowing Mesh Gradient):** เฉดสี Deep Void (`#030712`) ผสานกับ Electric Sky Blue (`#38BDF8`) และ Deep Cyan (`#0284C7`) ในโหมดมืด หรือ Pure White (`#FFFFFF`) กับ Soft Sky (`#E0F2FE`) ในโหมดสว่าง
     - **Layer 2 (Interactive Cursor Light Field):** แสงนุ่มนวลที่เคลื่อนตามตำแหน่งเมาส์ด้วยค่า Smoothing Physics (`smoothing: 0.12`)
     - **Layer 3 (Subtle Simplex Film Grain):** เพิ่มพื้นผิวแบบ Tactile ที่ความทึบต่ำ (`opacity: 0.03`) เพื่อลดอาการสีเป็นขั้น (Color banding)
2. **Hero 3D Presentation (`Hero3D.jsx`):**
   - แสดงคาแรคเตอร์ครูเพชร IT ด้วยมุมเอียง Parallax ที่จำกัดไม่เกิน `≤ 6°` พร้อมวงแหวนเรืองแสงแบบ Subtle Rim Light

---

## 3. Color Tokens

| Token | Dark Mode (Pitch Black & Sky) | Light Mode (Paper White & Ocean) | Usage |
|---|---|---|---|
| `--bg-base` | `#030712` | `#FFFFFF` | พื้นหลังหลักของหน้าเว็บ |
| `--bg-surface` | `#0B0F19` | `#F8FAFC` | พื้นผิวของการ์ดและคอนเทนเนอร์หลัก |
| `--bg-elevated` | `#111827` | `#F1F5F9` | พื้นผิวส่วนย่อย, ช่องกรอกข้อมูล |
| `--accent` | `#38BDF8` | `#0284C7` | สีเน้นหลัก, จุดโฟกัส, Active State |
| `--text-primary` | `#F8FAFC` | `#0F172A` | หัวข้อและเนื้อหาหลัก (Contrast > 12:1) |
| `--text-secondary` | `#CBD5E1` | `#334155` | เนื้อหารองและคำอธิบาย (Contrast > 7:1) |
| `--text-tertiary` | `#94A3B8` | `#64748B` | ข้อมูลกำกับ, วันที่, Metadata |
| `--border-subtle` | `rgba(148, 163, 184, 0.14)` | `rgba(15, 23, 42, 0.09)` | เส้นขอบละเอียดระดับ 1px |

---

## 4. Section Architecture & Storytelling Flow

1. **Hero Section (First Viewport Impact):**
   - แสดงสถานะความพร้อม ชื่อ **"ครูเพชร IT"** บทบาทวิชาชีพ และแถบสรุปจุดเด่น (Key Impact Strip) พร้อมปุ่ม CTA คู่ และโมเดล 3D คาแรคเตอร์ด้านขวา
2. **About & Identity Section:**
   - จัดวางแบบ **Editorial Split Grid** ด้านซ้ายคือการ์ดโปรไฟล์พร้อมข้อมูลจำเพาะ 4 ด้านในรูปแบบ Clean Data Table (ไม่ใช่หน้าต่าง Terminal จำลอง) ด้านขวาคือเรื่องราววิสัยทัศน์และ 4 เสาหลักความเชี่ยวชาญ ตามด้วยแถบสถิติและไทม์ไลน์การศึกษา
3. **Skills & Capabilities Matrix:**
   - แบ่งตาม 4 หมวดหมู่จริงของครูเพชร IT: `EdTech & Pedagogy`, `Cybersecurity & CTF`, `Creative Web & 3D`, และ `System & Research` พร้อมไอคอนที่ตรงความหมายและระดับความเชี่ยวชาญที่ชัดเจน
4. **Featured Projects & Showcase:**
   - ไฮไลต์ **Flagship Spotlight Card** ด้านบนสุดสำหรับผลงานชิ้นเอก ตามด้วยแกลเลอรีผลงานที่กรองตามหมวดหมู่ได้อย่างรวดเร็ว
5. **Experience & Contact:**
   - ไทม์ไลน์ประสบการณ์ที่มีเรื่องราวต่อเนื่อง และส่วนติดต่อที่เรียบหรู ใช้งานง่าย พร้อมระบบคัดลอกอีเมลในคลิกเดียว
