# ComfyUI Low-Spec (4GB VRAM) + Cute Tech Guide 🚀✨

คู่มือการติดตั้งและการใช้งาน **ComfyUI** ร่วมกับพอร์ตโฟลิโอ **ครูเพชร IT** (ธีม Cute Modern Tech & EdTech Innovation) โดยปรับจูนให้รันบนการ์ดจอ **NVIDIA GeForce RTX 2050 (VRAM 4 GB) + RAM 24 GB** ได้อย่างลื่นไหล ไม่ค้าง ไม่กินเครื่อง

---

## 1. วิธีดาวน์โหลด ComfyUI Portable (ง่ายที่สุด)

1. ดาวน์โหลดไฟล์สำเร็จรูป **ComfyUI Standalone Portable (Windows 64-bit)** จาก GitHub ทางการ:
   - [ดาวน์โหลด ComfyUI Portable (Direct Download 7z)](https://github.com/comfyanonymous/ComfyUI/releases/latest/download/ComfyUI_windows_portable_nvidia.7z)
2. แตกไฟล์ `ComfyUI_windows_portable_nvidia.7z` ไปไว้ที่โฟลเดอร์ที่คุณต้องการ เช่น:
   - `D:\COM\Programing\ComfyUI_windows_portable`

---

## 2. การตั้งค่า `--lowvram` สำหรับเครื่อง 4GB VRAM (สำคัญมาก ⭐)

เพื่อให้สามารถสร้างคลิปวิดีโอ (AnimateDiff) และภาพ 3D ได้โดย VRAM ไม่เต็ม:
1. เข้าไปที่โฟลเดอร์ `ComfyUI_windows_portable`
2. คลิกขวาที่ไฟล์ **`run_nvidia_gpu.bat`** -> เลือก **Edit (แก้ไข)**
3. เติมคำว่า `--lowvram` ต่อท้ายบรรทัดคำสั่ง:
   ```bat
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --lowvram
   ```
4. กดบันทึก (Save)

> **💡 เคล็ดลับ:** ธงคำสั่ง `--lowvram` จะทำให้ ComfyUI ยืม **RAM 24 GB** ของคุณมาช่วยพักโมเดล และดึงเข้า VRAM 4 GB เฉพาะตอนคำนวณ ทำให้รัน AnimateDiff ได้อย่างราบรื่นโดยไม่เจอ Error `CUDA Out of Memory`

---

## 3. โมเดลน้ำหนักเบาที่แนะนำ (Cute Tech & Innovation)

ดาวน์โหลดและนำไปวางในโฟลเดอร์ตามตารางด้านล่าง:

| ประเภทงาน | โมเดลแนะนำ (ขนาดเล็ก / น่ารัก) | ลิงก์ดาวน์โหลด | โฟลเดอร์ปลายทาง |
|---|---|---|---|
| **Base Model (Cute 3D)** | **DreamShaper 8 (SD 1.5)** หรือ SD 1.5 Pruned (~2 GB) | [Civitai / HuggingFace](https://huggingface.co/Lykon/DreamShaper/resolve/main/DreamShaper_8_pruned.safetensors) | `ComfyUI/models/checkpoints/` |
| **Animation (ข้อ 1)** | **AnimateDiff LCM Motion Adapter** (~400 MB) เรนเดอร์ 4-6 step เร็วมาก | [HuggingFace (mm-sd15-lcm)](https://huggingface.co/wangfuyun/AnimateLCM/resolve/main/AnimateLCM_sd15_t2v.ckpt) | `ComfyUI/custom_nodes/ComfyUI-AnimateDiff-Evolved/models/` |
| **2.5D Parallax (ข้อ 3)** | **Depth Anything V2 Small** (~95 MB) | [HuggingFace (V2 Small)](https://huggingface.co/depth-anything/Depth-Anything-V2-Small/resolve/main/depth_anything_v2_vits.pth) | `ComfyUI/models/depth/` |

---

## 4. วิธีทดสอบการเชื่อมต่อและดึงไฟล์เข้าเว็บอัตโนมัติ

1. ดับเบิ้ลคลิกเปิด **`run_nvidia_gpu.bat`**
2. รอจนหน้าเว็บ ComfyUI ขึ้นที่ `http://127.0.0.1:8188`
3. ในโฟลเดอร์พอร์ตโฟลิโอของคุณ เปิด Terminal แล้วรัน:
   ```powershell
   python scripts/comfyui/check_status.py
   ```
   *ระบบจะรายงานสถานะ GPU และ VRAM พร้อมใช้งานทันที*
4. เมื่อสั่งเจนภาพหรือวิดีโอ สคริปต์ `api_client.py` จะดาวน์โหลดไฟล์ `.webp` และ `.webm` มาบันทึกใน `portfolio/public/img/` หรือ `portfolio/public/video/` โดยอัตโนมัติ!
