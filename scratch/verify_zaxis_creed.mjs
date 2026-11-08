import { spawn, execSync } from "child_process";
import fs from "fs";

const artifactDir = "C:/Users/roych/.gemini/antigravity/brain/9902c63b-eecd-4106-b61b-3af04bb3cb9e";
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

async function main() {
  console.log("Starting Next.js on port 3065...");
  const server = spawn("npx", ["next", "start", "-p", "3065"], {
    cwd: "c:/Users/roych/OneDrive/Documents/Portfolio Web",
    shell: true,
    stdio: "ignore",
  });

  await new Promise((r) => setTimeout(r, 4500));

  console.log("Launching Edge in iPhone 14 Pro emulation (390x844)...");
  const edge = spawn(
    edgePath,
    [
      "--headless",
      "--disable-gpu",
      "--remote-debugging-port=9245",
      "--window-size=390,844",
      "http://localhost:3065",
    ],
    { stdio: "ignore" }
  );

  await new Promise((r) => setTimeout(r, 3500));

  try {
    const versionRes = await fetch("http://127.0.0.1:9245/json/list");
    const targets = await versionRes.json();
    const pageTarget = targets.find((t) => t.type === "page");
    if (!pageTarget) throw new Error("No page target found");

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener("message", handler);
            resolve(res.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    console.log("Waiting for preloader on mobile...");
    await new Promise((r) => setTimeout(r, 5000));

    // Dismiss preloader
    await send("Runtime.evaluate", {
      expression: `
        const btn = document.querySelector("[aria-label='Atelier Preloader']");
        if (btn) btn.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Open NAVIGATE drawer and click STATEMENT to start Lenis
    console.log("Opening navigation drawer...");
    await send("Runtime.evaluate", {
      expression: `
        const navBtn = document.querySelector("button[aria-label='Toggle Navigation Menu']");
        if (navBtn) navBtn.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 1000));

    console.log("Clicking STATEMENT link...");
    await send("Runtime.evaluate", {
      expression: `
        const buttons = Array.from(document.querySelectorAll("button"));
        const stmt = buttons.find(b => b.textContent && b.textContent.includes("STATEMENT"));
        if (stmt) stmt.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 2200));

    async function captureAtScroll(scrollY, filename, label) {
      console.log(`Setting scroll to ${scrollY}px for ${label}...`);
      await send("Runtime.evaluate", {
        expression: `
          (() => {
            if (window.lenis) {
              window.lenis.scrollTo(${scrollY}, { immediate: true });
            }
            const scroller = document.getElementById("app-scroller");
            if (scroller) {
              scroller.scrollTop = ${scrollY};
            }
            if (window.ScrollTrigger) {
              window.ScrollTrigger.update();
            }
          })()
        `,
      });
      await new Promise((r) => setTimeout(r, 1200));
      const shot = await send("Page.captureScreenshot");
      fs.writeFileSync(`${artifactDir}/${filename}`, Buffer.from(shot.data, "base64"));
      console.log(`Captured: ${filename}`);
    }

    // 01: Quote Held in Center Focus (t = 8.5s / 20.0s => ~1790px)
    await captureAtScroll(1790, "mobile_zaxis_01_quote_held.png", "Quote Held in Center Focus");

    // 02: Anamorphic Warp Singularity (t = 9.60s / 20.0s => ~2025px)
    await captureAtScroll(2025, "mobile_zaxis_02_singularity_warp.png", "Anamorphic Warp Singularity");

    // 03: Pillar 01 (NSEC AIML) Zooms IN from Singularity (t = 11.2s / 20.0s => ~2360px)
    await captureAtScroll(2360, "mobile_zaxis_03_card01_zoomed_in.png", "Pillar 01 (NSEC AIML) Zooms IN");

    // 04: Punch-through transition towards Pillar 02 (t = 12.8s / 20.0s => ~2700px)
    await captureAtScroll(2700, "mobile_zaxis_04_punch_through.png", "Punch Through to Pillar 02");

    // 05: Pillar 02 (Latvia Cricket) Zooms IN (t = 14.0s / 20.0s => ~2950px)
    await captureAtScroll(2950, "mobile_zaxis_05_card02_zoomed_in.png", "Pillar 02 (Latvia Cricket) Zooms IN");

    // 06: Pillar 03 (278-Key Engine) Zooms IN (t = 16.5s / 20.0s => ~3480px)
    await captureAtScroll(3480, "mobile_zaxis_06_card03_zoomed_in.png", "Pillar 03 (278-Key Engine) Zooms IN");

    // 07: Pillar 04 (Heritage School) Zooms IN (t = 18.8s / 20.0s => ~3960px)
    await captureAtScroll(3960, "mobile_zaxis_07_card04_zoomed_in.png", "Pillar 04 (Heritage School) Zooms IN");

    console.log("All Z-axis captures completed successfully!");
  } catch (err) {
    console.error("CDP error:", err);
  } finally {
    try {
      execSync("taskkill /F /IM msedge.exe /T", { stdio: "ignore" });
    } catch {}
    try {
      server.kill();
    } catch {}
    process.exit(0);
  }
}

main();
