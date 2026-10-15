# DESIGN SYSTEM SPECIFICATION: Impeccable Style Guide

> **Theme:** Clean Cyber Editorial (ผสานความเฉียบคมของเทคโนโลยีเข้ากับความประณีตของ Editorial Design)  
> **Brand:** ครูเพชร IT — Innovator & Cybersecurity Educator

---

## 1. Design Principles (หลักการออกแบบ)

1. **Anti-AI Slop (ขจัดความซ้ำซากของ AI สำเร็จรูป):**
   - ❌ ไม่ใช้ข้อความเลียนแบบเทอร์มินัลเชย ๆ เช่น `// 00 — SYSTEM_CORE`, `<สวัสดีครับ_WORLD />`, `INIT_SEQUENCE`
   - ❌ ไม่ใช้ Card ซ้อน Card ที่ทุกการ์ดหน้าตาเหมือนกันไปหมด
   - ❌ ไม่ใส่ Chip/Badge สถานะรกเกะกะจนขาดจุดโฟกัส
   - ❌ ไม่ใช้แสงนีออนจัดจ้าจนแย่งสายตาและทำให้อ่านเนื้อหายาก

2. **Strong Visual Hierarchy (จัดลำดับสายตาชัดเจน):**
   - มีพระเอกคนเดียวในแต่ละหน้าจอ (One primary focus per view)
   - ข้อมูลหลัก (ชื่อ, บทบาท, ผลงานไฮไลต์) ต้องสะกดสายตาทันทีใน 3 วินาทีแรก
   - ข้อมูลรอง (Tech stack, วันที่, สเปก) ใช้สีรองและขนาดเล็กลงอย่างได้สัดส่วน

3. **High-Craft Typography (ตัวอักษรประณีต):**
   - ภาษาไทย: ใช้แบบอักษร Sans ที่มีความเป็นมิตร ทันสมัย และอ่านสบายตา (IBM Plex Sans Thai)
   - ภาษาอังกฤษ: Inter สำหรับเนื้อหาทั่วไป และ JetBrains Mono เฉพาะจุดที่เป็นตัวเลขทางเทคนิคหรือข้อมูลระบบ
   - การจัด Spacing ระหว่างบรรทัด (Line-height) และระยะห่างตัวอักษร (Letter-spacing) ที่สมดุล

4. **Intentional Motion & 3D (อนิเมชันที่มีจุดประสงค์):**
   - วัตถุ 3D และ Canvas ต้องเป็นมิติฉากหลังที่สร้างบรรยากาศ (Ambient Depth) ไม่กระตุกหรือบดบังตัวอักษร
   - การขยับ Parallax และ Hover Tilt ต้องนุ่มนวล (< 6 องศา) เพื่อเพิ่มสัมผัสแบบ Tactile โดยไม่ทำให้เวียนหัว

---

## 2. Color Tokens

### Dark Mode (Pitch Black & Precision Sky Blue)
- **Background Base:** `#030712` (Void Black)
- **Surface / Card:** `#0B0F19` (Deep Slate Glass)
- **Elevated Surface:** `#111827`
- **Primary Accent:** `#38BDF8` (Sky Blue — คมชัด สื่อถึงความทันสมัย ปลอดภัย ไม่แสบตา)
- **Primary Text:** `#F8FAFC` (Slate-50 — สว่าง คมชัดสูง)
- **Secondary Text:** `#CBD5E1` (Slate-300 — อ่านง่าย สบายตา)
- **Muted Text:** `#94A3B8` (Slate-400)
- **Border Subtle:** `rgba(56, 189, 248, 0.16)`

### Light Mode (Pure White & Deep Ocean Sky)
- **Background Base:** `#FFFFFF`
- **Surface / Card:** `#F8FAFC`
- **Elevated Surface:** `#F0F9FF`
- **Primary Accent:** `#0284C7` (Sky-600)
- **Primary Text:** `#0F172A` (Slate-900 — คอนทราสต์ระดับสูงสุด ไม่ใช่สีเทาจาง)
- **Secondary Text:** `#334155` (Slate-700)
- **Muted Text:** `#64748B` (Slate-500)
- **Border Subtle:** `rgba(2, 132, 199, 0.18)`

---

## 3. Component Guidelines

### A. Hero Section
- **Heading:** ชัดเจน ไม่ใส่ tag วงเล็บเหลี่ยมหรือแฮชแท็กปลอม
- **Subtitle / Tagline:** คมชัด สรุปสิ่งที่ทำและคุณค่าที่ส่งมอบในประโยคเดียว
- **Call-To-Action (CTA):** ปุ่มหลัก 1 ปุ่ม (ดูผลงาน) และปุ่มรอง 1 ปุ่ม (ติดต่อ) ไม่ใส่ปุ่มมากเกินไป

### B. Project Cards
- ให้ความสำคัญกับ "ภาพพรีวิวผลงาน" และ "คำอธิบายคุณค่าที่ได้ (Impact)" มากกว่าป้ายแท็กเทคโนโลยีที่เยอะเกินไป
- ป้าย Tech Tag ไม่ควรเกิน 3-4 ป้ายที่สำคัญที่สุด

### C. Skills & Experience
- นำเสนอทักษะโดยแบ่งตามหมวดหมู่การใช้งานจริง (EdTech, Security, Development)
- หลีกเลี่ยงแถบเปอร์เซ็นต์ที่ไม่มีเกณฑ์วัดชัดเจน (เช่น 95% คืออะไร?) ให้เน้นประสบการณ์ เครื่องมือ และผลลัพธ์แทน
