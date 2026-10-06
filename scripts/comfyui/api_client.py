import urllib.request
import urllib.parse
import json
import time
import os
import sys

COMFY_URL = "http://127.0.0.1:8188"
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUBLIC_IMG_DIR = os.path.join(PROJECT_ROOT, "public", "img")
PUBLIC_VIDEO_DIR = os.path.join(PROJECT_ROOT, "public", "video")

os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)
os.makedirs(PUBLIC_VIDEO_DIR, exist_ok=True)

def queue_prompt(workflow_dict):
    """Sends a workflow prompt to ComfyUI queue."""
    p = {"prompt": workflow_dict}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"❌ Failed to queue prompt: {e}")
        return None

def wait_for_prompt_completion(prompt_id, timeout=300):
    """Polls history until the prompt is completed."""
    print(f"⏳ Waiting for ComfyUI to finish prompt ID: {prompt_id}...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            req = urllib.request.Request(f"{COMFY_URL}/history/{prompt_id}")
            with urllib.request.urlopen(req) as resp:
                history = json.loads(resp.read().decode('utf-8'))
                if prompt_id in history:
                    print("✨ Generation complete!")
                    return history[prompt_id]
        except Exception:
            pass
        time.sleep(2)
    print("⚠️ Timeout waiting for completion.")
    return None

def download_output_asset(filename, subfolder, file_type, dest_path):
    """Downloads an output image/video from ComfyUI to the project directory."""
    params = urllib.parse.urlencode({
        "filename": filename,
        "subfolder": subfolder,
        "type": file_type
    })
    url = f"{COMFY_URL}/view?{params}"
    print(f"📥 Downloading asset: {filename} -> {dest_path}")
    urllib.request.urlretrieve(url, dest_path)
    print(f"✅ Saved to: {dest_path} ({os.path.getsize(dest_path)} bytes)")

def run_workflow_file(workflow_path, output_name=None, is_video=False):
    """Loads a JSON workflow and triggers generation."""
    if not os.path.exists(workflow_path):
        print(f"❌ Workflow file not found: {workflow_path}")
        return False

    with open(workflow_path, "r", encoding="utf-8") as f:
        workflow_data = json.load(f)

    res = queue_prompt(workflow_data)
    if not res or "prompt_id" not in res:
        print("❌ Could not queue workflow.")
        return False

    prompt_id = res["prompt_id"]
    history = wait_for_prompt_completion(prompt_id)
    if not history:
        return False

    outputs = history.get("outputs", {})
    for node_id, node_output in outputs.items():
        if "images" in node_output:
            for img in node_output["images"]:
                fname = img["filename"]
                dest_dir = PUBLIC_VIDEO_DIR if (is_video or fname.endswith(('.webm', '.mp4', '.gif'))) else PUBLIC_IMG_DIR
                target_filename = output_name if output_name else fname
                dest_path = os.path.join(dest_dir, target_filename)
                download_output_asset(fname, img.get("subfolder", ""), img.get("type", "output"), dest_path)
        if "gifs" in node_output or "videos" in node_output:
            vids = node_output.get("gifs", []) + node_output.get("videos", [])
            for vid in vids:
                fname = vid["filename"]
                target_filename = output_name if output_name else fname
                dest_path = os.path.join(PUBLIC_VIDEO_DIR, target_filename)
                download_output_asset(fname, vid.get("subfolder", ""), vid.get("type", "output"), dest_path)

    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        wf_path = sys.argv[1]
        out_name = sys.argv[2] if len(sys.argv) > 2 else None
        run_workflow_file(wf_path, out_name)
    else:
        print("Usage: python api_client.py <workflow.json> [output_filename]")
