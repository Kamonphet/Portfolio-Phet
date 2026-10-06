import urllib.request
import json
import sys

COMFY_URL = "http://127.0.0.1:8188"

def check_comfy_status():
    print("=" * 55)
    print("🤖 Checking ComfyUI Server Status...")
    print(f"Target URL: {COMFY_URL}")
    print("=" * 55)
    try:
        req = urllib.request.Request(f"{COMFY_URL}/system_stats")
        with urllib.request.urlopen(req, timeout=4) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                devices = data.get("devices", [])
                print("✅ ComfyUI is ONLINE & READY!")
                for idx, dev in enumerate(devices):
                    name = dev.get("name", "Unknown GPU")
                    vram_free = dev.get("vram_free", 0) // (1024 * 1024)
                    vram_total = dev.get("vram_total", 0) // (1024 * 1024)
                    torch_vram_free = dev.get("torch_vram_free", 0) // (1024 * 1024)
                    print(f"   [GPU {idx}] {name}")
                    print(f"   VRAM Free: {vram_free} MB / {vram_total} MB")
                return True
    except Exception as e:
        print("⚠️  ComfyUI is currently NOT running or not reachable.")
        print(f"   Detail: {e}")
        print("\n👉 To start ComfyUI:")
        print("   1. Open your ComfyUI portable directory")
        print("   2. Run 'run_nvidia_gpu.bat' (with --lowvram)")
        print(f"   3. Ensure it is accessible at {COMFY_URL}")
        return False

if __name__ == "__main__":
    is_up = check_comfy_status()
    sys.exit(0 if is_up else 1)
