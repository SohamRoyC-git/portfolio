import { spawn, execSync } from "child_process";
import fs from "fs";

const artifactDir = "C:/Users/roych/.gemini/antigravity/brain/9902c63b-eecd-4106-b61b-3af04bb3cb9e";
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

async function main() {
  console.log("Starting Next.js on port 3068...");
  const server = spawn("npx", ["next", "start", "-p", "3068"], {
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
      "--remote-debugging-port=9248",
      "--window-size=390,844",
      "http://localhost:3068",
    ],
    { stdio: "ignore" }
  );

  await new Promise((r) => setTimeout(r, 4500));

  try {
    const versionRes = await fetch("http://127.0.0.1:9248/json/list");
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

    // 01: Card 01 in focal lock showing Accretion Disk and Photon Ring
    console.log("Setting scroll to 2360px for Card 01 with Accretion Disk...");
    await setScroll(2360);
    const shot01 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_warp_01_card01_accretion.png`, Buffer.from(shot01.data, "base64"));
    console.log("Captured: mobile_warp_01_card01_accretion.png");

    // 02: Simulate Gravitational Lens Touch (touchstart)
    console.log("Dispatching touchstart on .cursor-grab for Gravitational Lens...");
    const touchRes = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const deck = document.querySelector(".cursor-grab");
          if (!deck) return "Deck not found";
          const rect = deck.getBoundingClientRect();
          const touch = new Touch({
            identifier: 1,
            target: deck,
            clientX: rect.left + rect.width * 0.75,
            clientY: rect.top + rect.height * 0.35,
          });
          const ev = new TouchEvent("touchstart", {
            cancelable: true,
            bubbles: true,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
          });
          deck.dispatchEvent(ev);
          return "Dispatched touchstart at (" + touch.clientX + ", " + touch.clientY + ")";
        })()
      `,
      returnByValue: true
    });
    console.log("Touch dispatch result:", touchRes.result.value);
    await new Promise((r) => setTimeout(r, 600));
    const shot02 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_warp_02_grav_lens_touch.png`, Buffer.from(shot02.data, "base64"));
    console.log("Captured: mobile_warp_02_grav_lens_touch.png");

    // Release touch
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const deck = document.querySelector(".cursor-grab");
          if (deck) {
            const ev = new TouchEvent("touchend", { bubbles: true, cancelable: true });
            deck.dispatchEvent(ev);
          }
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // 03: Punch-through transition towards Card 02 (t = 12.8s => ~2700px)
    console.log("Setting scroll to 2700px for 3D Bank Punch-Through...");
    await setScroll(2700);
    const shot03 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_warp_03_punch_through_bank.png`, Buffer.from(shot03.data, "base64"));
    console.log("Captured: mobile_warp_03_punch_through_bank.png");

    // 04: Card 02 locked in focal hold (t = 14.0s => ~2950px)
    console.log("Setting scroll to 2950px for Card 02 focal lock...");
    await setScroll(2950);
    const shot04 = await send("Page.captureScreenshot");
    fs.writeFileSync(`${artifactDir}/mobile_warp_04_card02_locked.png`, Buffer.from(shot04.data, "base64"));
    console.log("Captured: mobile_warp_04_card02_locked.png");

    console.log("All Option B verification captures completed successfully!");
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
