import { spawn } from "child_process";
import fs from "fs";

const artifactDir = "C:/Users/roych/.gemini/antigravity/brain/9902c63b-eecd-4106-b61b-3af04bb3cb9e";
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

async function main() {
  console.log("Starting Next.js on port 3082...");
  const server = spawn("npx", ["next", "start", "-p", "3082"], {
    cwd: "c:/Users/roych/OneDrive/Documents/Portfolio Web",
    shell: true,
    stdio: "ignore",
  });

  await new Promise((r) => setTimeout(r, 6000));

  console.log("Launching Edge in iPhone 14 Pro emulation (390x844)...");
  const edge = spawn(
    edgePath,
    [
      "--headless",
      "--disable-gpu",
      "--remote-debugging-port=9262",
      "--window-size=390,844",
      "http://localhost:3082",
    ],
    { stdio: "ignore" }
  );

  await new Promise((r) => setTimeout(r, 4500));

  try {
    const versionRes = await fetch("http://127.0.0.1:9262/json/list");
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

    // Open NAVIGATE drawer and click STATEMENT to engage Lenis
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

    async function setScroll(scrollY) {
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
    }

    // 01: Ingress into Corridor at Station 01 (Academic Core: NSEC AIML)
    console.log("Setting scroll to 2360px for Station 01 (Academic Core)...");
    await setScroll(2360);
    const shot01 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/corridor_01_station01_center.png`, Buffer.from(shot01.data, "base64"));
    console.log("Captured corridor_01_station01_center.png");

    // 02: Simulate Swipe Left to look directly at Left Wall Alcove Station 01
    console.log("Simulating touch drag left to yaw camera toward Station 01 alcove...");
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const stage = document.querySelector("[perspective\\\\:650px]") || document.querySelector(".cursor-grab");
          if (stage) {
            const rect = stage.getBoundingClientRect();
            const startX = rect.left + rect.width * 0.5;
            const startY = rect.top + rect.height * 0.5;
            // Dispatch touchstart
            stage.dispatchEvent(new TouchEvent("touchstart", {
              bubbles: true,
              cancelable: true,
              touches: [new Touch({ identifier: 1, target: stage, clientX: startX, clientY: startY })]
            }));
            // Dispatch touchmove to left (-120px delta = look left)
            stage.dispatchEvent(new TouchEvent("touchmove", {
              bubbles: true,
              cancelable: true,
              touches: [new Touch({ identifier: 1, target: stage, clientX: startX - 110, clientY: startY })]
            }));
          }
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 500));
    const shot02 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/corridor_02_look_left_station01.png`, Buffer.from(shot02.data, "base64"));
    console.log("Captured corridor_02_look_left_station01.png");

    // Release touch
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const stage = document.querySelector(".cursor-grab");
          if (stage) {
            stage.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, touches: [] }));
          }
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 800));

    // 03: Dolly down corridor to Station 02 (European Ops: Latvian Cricket Federation)
    console.log("Setting scroll to 2910px for Station 02 (European Ops)...");
    await setScroll(2910);
    const shot03 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/corridor_03_station02_telemetry.png`, Buffer.from(shot03.data, "base64"));
    console.log("Captured corridor_03_station02_telemetry.png");

    // 04: Dolly down corridor to Station 03 (< 5ms Engine: 278-Key Localization)
    console.log("Setting scroll to 3460px for Station 03 (< 5ms Engine)...");
    await setScroll(3460);
    const shot04 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/corridor_04_station03_engine.png`, Buffer.from(shot04.data, "base64"));
    console.log("Captured corridor_04_station03_engine.png");

    // 05: Dolly down corridor to Station 04 (The Heritage School Distinction)
    console.log("Setting scroll to 3900px for Station 04 (Distinction)...");
    await setScroll(3900);
    const shot05 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/corridor_05_station04_distinction.png`, Buffer.from(shot05.data, "base64"));
    console.log("Captured corridor_05_station04_distinction.png");

    // 06: Approaching and splitting open the Hydraulic Blast Doors into Commissions Hangar
    console.log("Setting scroll to 4110px for Hydraulic Blast Doors breach...");
    await setScroll(4110);
    const shot06 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/corridor_06_blast_doors_split.png`, Buffer.from(shot06.data, "base64"));
    console.log("Captured corridor_06_blast_doors_split.png");

    console.log("All First-Person Corridor captures completed successfully!");
    ws.close();
  } catch (err) {
    console.error("CDP execution error:", err);
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
