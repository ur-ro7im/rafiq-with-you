import { Download, Share } from "lucide-react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import IslamicCard from "./IslamicCard";

export default function InstallCard() {
  const { installed, canInstall, showIOSHint, install } = useInstallPrompt();
  if (installed || (!canInstall && !showIOSHint)) return null;

  return (
    <IslamicCard className="install">
      <strong>ثبّت التطبيق على جهازك</strong>
      <p>
        يفتح من الشاشة الرئيسية بملء الشاشة، وتعمل الصفحات التي زرتها بدون
        إنترنت.
      </p>
      {canInstall ? (
        <button className="btn btn-primary" onClick={install}>
          <Download size={18} /> تثبيت
        </button>
      ) : (
        <p className="hint">
          من متصفح Safari اضغط زر المشاركة{" "}
          <Share size={16} aria-hidden="true" /> ثم اختر «إضافة إلى الشاشة
          الرئيسية».
        </p>
      )}
    </IslamicCard>
  );
}
