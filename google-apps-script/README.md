# คู่มือการติดตั้งและตั้งค่า Backend: Google Sheets + Google Apps Script (GAS) API

ระบบนี้ใช้ **Google Sheets** เป็น Database แบบแบ่งแยกตาราง (Relational Sheets) อ่านและแก้ไขได้ง่าย ไม่เก็บเป็น JSON ก้อนเดียว และใช้ **Google Apps Script** ทำหน้าที่เป็น REST API พร้อมเชื่อมต่อ **Google Drive** สำหรับเก็บรูปภาพ

---

## 📌 ขั้นตอนการตั้งค่า Backend (ทำตามทีละขั้นตอน)

### ขั้นตอนที่ 1: สร้าง Google Sheet
1. เข้าไปที่ [Google Sheets](https://sheets.google.com/) แล้วกด **สร้างสเปรดชีตเปล่า (Blank spreadsheet)**
2. ตั้งชื่อสเปรดชีตตามต้องการ เช่น `Portfolio_Database`
> *(ไม่ต้องสร้างตารางหรือใส่หัวตารางเอง สคริปต์จะสร้างแท็บทั้ง 10 แท็บ พร้อมใส่หัวคอลัมน์และจัดสีให้อัตโนมัติ)*

---

### ขั้นตอนที่ 2: วางโค้ด Google Apps Script
1. ที่เมนูด้านบนของ Google Sheet ให้คลิก **ส่วนขยาย (Extensions)** > **Apps Script**
2. ลบโค้ดเดิมทั้งหมดในไฟล์ `Code.gs` ออก
3. เปิดไฟล์ [`portfolio/google-apps-script/Code.gs`](file:///d:/COM/Programing/portfolio/google-apps-script/Code.gs) ในโปรเจกต์ คัดลอกโค้ดทั้งหมด แล้วนำไปวางใน Apps Script Editor
4. กดไอคอน **บันทึก (Save)** หรือกด `Ctrl + S`

---

### ขั้นตอนที่ 3: Deploy (การทำให้ใช้งานได้) เป็น Web App
1. คลิกที่ปุ่มสีน้ำเงินด้านขวาบน **การทำให้ใช้งานได้ (Deploy)** > **การทำให้ใช้งานได้รายการใหม่ (New deployment)**
2. คลิกที่ไอคอนเฟือง ⚙️ ด้านซ้าย เลือกประเภทเป็น **เว็บแอป (Web app)**
3. ตั้งค่าการ Deploy ให้ถูกต้อง (สำคัญมาก):
   - **คำอธิบาย (Description):** `Portfolio Relational API`
   - **ดำเนินการในฐานะ (Execute as):** `ฉัน (Me / your-email@gmail.com)`
   - **ผู้มีสิทธิ์เข้าถึง (Who has access):** `ทุกคน (Anyone)` *(สำคัญมาก! ต้องเลือก Anyone เพื่อให้หน้าเว็บ Portfolio สามารถเรียก API ได้โดยไม่ต้องล็อกอิน)*
4. คลิกปุ่ม **การทำให้ใช้งานได้ (Deploy)**
5. หากมีหน้าต่างขึ้นมาขอสิทธิ์อนุญาต (Authorization required):
   - คลิก **ตรวจสอบสิทธิ์ (Authorize access)**
   - เลือกบัญชี Google ของคุณ
   - คลิก **ขั้นสูง (Advanced)** > คลิก **ไปยัง... (Go to ... (unsafe))**
   - คลิก **อนุญาต (Allow)**
6. เมื่อ Deploy สำเร็จ คุณจะได้รับ **URL ของเว็บแอป (Web app URL)** (ซึ่งจะลงท้ายด้วย `/exec`)
   - ให้คลิก **คัดลอก (Copy)** URL นี้ไว้

---

### ขั้นตอนที่ 4: นำ URL มาใส่ในโปรเจกต์ Frontend
1. เปิดไฟล์ `.env` ที่โฟลเดอร์ `portfolio/`
2. วาง URL ที่คัดลอกมาลงในตัวแปร `VITE_GOOGLE_SHEETS_API_URL`:
   ```env
   VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
3. บันทึกไฟล์ `.env`

---

## 🗂️ โครงสร้างตารางใน Google Sheet (แบ่งเป็น 10 แท็บอย่างเป็นระเบียบ)

| ชื่อ Sheet (แท็บ) | หน้าที่ | คอลัมน์ |
|---|---|---|
| 👤 **`profile`** | ข้อมูล Hero, คำทักทาย, ชื่อ, ตำแหน่ง, และ Bio | `id`, `name`, `title`, `tagline`, `greeting`, `status`, `statusColor`, `avatarUrl`, `bio_paragraph_1`, `bio_paragraph_2`, `bio_paragraph_3`, `ctaPrimary`, `ctaSecondary`, `aboutBadge`, `aboutHeading`, `updated_at` |
| 🎓 **`education`** | ประวัติการศึกษาและการฝึกอบรม | `id`, `degree`, `field`, `institution`, `period`, `image`, `description`, `updated_at` |
| 💡 **`skills`** | ทักษะความเชี่ยวชาญและเปอร์เซ็นต์ | `id`, `name`, `level`, `category`, `icon`, `updated_at` |
| 💻 **`projects`** | ผลงาน, ลิงก์เดโม, GitHub และภาพโปรเจกต์ | `id`, `title`, `category`, `description`, `image`, `tech_stack`, `demo_url`, `github_url`, `is_featured`, `updated_at` |
| 💼 **`experience`** | ไทม์ไลน์ประสบการณ์การทำงาน | `id`, `role`, `company`, `period`, `description`, `updated_at` |
| 📞 **`contact`** | ช่องทางการติดต่อและโซเชียลมีเดีย | `email`, `phone`, `location`, `availability`, `github`, `linkedin`, `twitter`, `discord`, `updated_at` |
| 📊 **`stats`** | ตัวเลขสถิติผลงาน | `id`, `label`, `value`, `updated_at` |
| ⚙️ **`system_specs`** | ข้อมูลเฉพาะและปรัชญาการทำงาน | `id`, `label`, `value`, `updated_at` |
| 🎨 **`settings`** | โทนสีธีมหลัก และรูปทรง 3D บนหน้าเว็บ | `themePrimary`, `themeSecondary`, `themeAccent`, `active3DShape`, `updated_at` |
| 📬 **`contact_messages`** | ข้อความที่ผู้ใช้งานส่งมาจากหน้าเว็บ | `id`, `name`, `email`, `subject`, `message`, `created_at` |

---

## 💡 หมายเหตุและการแก้ไขข้อมูล
- **อ่านง่ายขึ้น 100%:** ทุกแถวเป็นข้อมูลจริง สามารถคลิกแก้ไขในช่องของ Google Sheets ได้โดยตรง
- **อัปโหลดรูปภาพ:** รูปภาพที่อัปโหลดผ่านหน้าเว็บจะถูกเก็บเข้าโฟลเดอร์ `Portfolio_Media` ใน Google Drive และได้ URL ลิงก์ภาพอัตโนมัติ
- **ไม่ต้องกังวลเรื่องภาษา:** ระบบตั้งค่าเป็นภาษาไทยเริ่มต้น และได้นำปุ่มสลับภาษาที่ไม่จำเป็นออกเรียบร้อยแล้ว
