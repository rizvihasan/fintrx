import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

// The app shell (bottom tabs, FAB, swipe rows) is used on the real Android
// app AND on narrow viewports, so mobile web gets the same experience while
// desktop web keeps the desktop layout.
export function useAppShell(): boolean {
  const [shell, setShell] = useState(
    () => isNativeApp() || window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    if (isNativeApp()) {
      setShell(true);
      return;
    }
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setShell(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return shell;
}

export async function hapticTap(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // haptics unavailable - cosmetic only
  }
}

export async function hapticSuccess(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // same
  }
}

export async function hapticWarning(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Warning });
  } catch {
    // same
  }
}

export async function configureStatusBar(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0b0f14" });
  } catch {
    // status bar styling is best-effort
  }
}
