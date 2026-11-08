import { spawn, execSync } from "child_process";
import fs from "fs";

const artifactDir = "C:/Users/roych/.gemini/antigravity/brain/9902c63b-eecd-4106-b61b-3af04bb3cb9e";
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

async function main() {
  console.log("Starting Next.js on port 3061...");
  const server = spawn("npx", ["next", "start", "-p", "3061"], {
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
      "--remote-debugging-port=9241",
      "--window-size=390,844",
      "http://localhost:3061",
    ],
    { stdio: "ignore" }
  );

  await new Promise((r) => setTimeout(r, 3500));

  try {
    const versionRes = await fetch("http://127.0.0.1:9241/json/list");
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

    console.log("Waiting for preloader to reach 100% on mobile...");
    await new Promise((r) => setTimeout(r, 4800));

    // Dismiss preloader
    await send("Runtime.evaluate", {
      expression: `
        const btn = document.querySelector("[aria-label='Atelier Preloader']");
        if (btn) btn.click();
      `,
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Open NAVIGATE drawer & click STATEMENT
    console.log("Opening navigation drawer...");
    await send("Runtime.evaluate", {
      expression: `
        const navBtn = document.querySelector("button[aria-label='Toggle Navigation Menu']");
        if (navBtn) navBtn.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 1200));
    await send("Runtime.evaluate", {
      expression: `
        const buttons = Array.from(document.querySelectorAll("button"));
        const stmt = buttons.find(b => b.textContent && b.textContent.includes("STATEMENT"));
        if (stmt) stmt.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Check Creed element top
    const creedPos = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const creed = document.getElementById("monument-creed");
          const hero = document.getElementById("hero-wrapper");
          return {
            heroH: hero ? hero.offsetHeight : 0,
            creedTop: creed ? creed.offsetTop : 0,
            creedH: creed ? creed.offsetHeight : 0
          };
        })()
      `,
      returnByValue: true,
    });
    console.log("Layout Pos:", creedPos.result.value);

    // 04: Creed Entrance - Card 01 docking as stardust converges
    const creedTop = creedPos.result.value.creedTop;
    await send("Runtime.evaluate", {
      expression: `
        window.lenis && window.lenis.scrollTo(${creedTop + 150}, { immediate: true });
        window.ScrollTrigger && window.ScrollTrigger.update();
      `,
    });
    await new Promise((r) => setTimeout(r, 800));
    const shot04 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_cinematic_04_creed_assembly.png`, Buffer.from(shot04.data, "base64"));
    console.log("Captured 04 (creed entrance)");

    // 05: Card 01 fully docked in focus in Creed
    await send("Runtime.evaluate", {
      expression: `
        window.lenis && window.lenis.scrollTo(${creedTop + 600}, { immediate: true });
        window.ScrollTrigger && window.ScrollTrigger.update();
      `,
    });
    await new Promise((r) => setTimeout(r, 800));
    const shot05 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_cinematic_05_creed_docked.png`, Buffer.from(shot05.data, "base64"));
    console.log("Captured 05 (creed card 01 docked)");

    // 06: Card 02 stacked over Card 01
    await send("Runtime.evaluate", {
      expression: `
        window.lenis && window.lenis.scrollTo(${creedTop + 1400}, { immediate: true });
        window.ScrollTrigger && window.ScrollTrigger.update();
      `,
    });
    await new Promise((r) => setTimeout(r, 800));
    const shot06 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_cinematic_06_creed_card02.png`, Buffer.from(shot06.data, "base64"));
    console.log("Captured 06 (creed card 02 stacked)");

    console.log("Done!");
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
