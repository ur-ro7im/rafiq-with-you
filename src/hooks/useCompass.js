import { useEffect, useState } from "react";

export function useCompass() {
  const [heading, setHeading] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const onOrientation = (e) => {
      const value =
        e.webkitCompassHeading ?? (e.absolute ? (360 - e.alpha) % 360 : null);
      if (value != null) setHeading(value);
    };
    const type =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";
    window.addEventListener(type, onOrientation, true);
    return () => window.removeEventListener(type, onOrientation, true);
  }, [active]);

  async function start() {
    const Orientation = window.DeviceOrientationEvent;
    if (Orientation && typeof Orientation.requestPermission === "function") {
      try {
        if ((await Orientation.requestPermission()) !== "granted") return;
      } catch {
        return;
      }
    }
    setActive(true);
  }

  return { heading, active, start };
}
