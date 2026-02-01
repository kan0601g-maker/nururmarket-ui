// app/ahatouch/_components/sfx.ts
export function sfx(name: "open" | "lock" | "reset" | "clear" | "aha") {
  try {
    const a = new Audio(`/sounds/${name}.mp3`);
    a.volume = 1.0;
    a.play().catch((e) => {
      console.warn("[SFX] blocked or failed:", name, e);
    });
  } catch (e) {
    console.warn("[SFX] error:", name, e);
  }
}
