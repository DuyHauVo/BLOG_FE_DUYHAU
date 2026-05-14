import { execFileSync, spawn } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

const port = process.env.PORT || "3001";

function killWindowsPort(targetPort) {
  const output = execFileSync("netstat", ["-ano"], { encoding: "utf8" });
  const pids = new Set();

  for (const line of output.split(/\r?\n/)) {
    if (!line.includes("LISTENING")) continue;
    if (!line.includes(`:${targetPort}`)) continue;

    const parts = line.trim().split(/\s+/);
    const pid = parts.at(-1);
    if (pid && pid !== "0" && pid !== String(process.pid)) {
      pids.add(pid);
    }
  }

  for (const pid of pids) {
    try {
      execFileSync("taskkill", ["/PID", pid, "/F", "/T"], { stdio: "ignore" });
      console.log(`Stopped old server on port ${targetPort} (PID ${pid})`);
    } catch {
      console.warn(`Could not stop PID ${pid}; it may have already exited.`);
    }
  }
}

function killUnixPort(targetPort) {
  try {
    const output = execFileSync("lsof", ["-ti", `tcp:${targetPort}`], {
      encoding: "utf8",
    });
    const pids = output
      .split(/\r?\n/)
      .map((pid) => pid.trim())
      .filter(Boolean)
      .filter((pid) => pid !== String(process.pid));

    for (const pid of new Set(pids)) {
      process.kill(Number(pid), "SIGTERM");
      console.log(`Stopped old server on port ${targetPort} (PID ${pid})`);
    }
  } catch {
    // No process is using the port, or lsof is unavailable.
  }
}

if (process.platform === "win32") {
  killWindowsPort(port);
} else {
  killUnixPort(port);
}

rmSync(".next", { recursive: true, force: true });

const nextBin = join("node_modules", "next", "dist", "bin", "next");

const child = spawn(process.execPath, [nextBin, "dev", "-p", port], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
