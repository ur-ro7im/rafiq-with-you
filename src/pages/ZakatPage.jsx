import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";

const FIELDS = [
  ["cash", "النقد والحسابات البنكية"],
  ["metals", "قيمة الذهب والفضة المدّخرة"],
  ["trade", "قيمة عروض التجارة"],
  ["owed", "ديون لك مرجوّة السداد"],
  ["debts", "ديون عليك حالّة (تُخصم)"],
];
const NISAB = {
  gold: { grams: 85, label: "الذهب (٨٥ جرامًا)" },
  silver: { grams: 595, label: "الفضة (٥٩٥ جرامًا)" },
};
const RATE = 0.025;

const num = (value) => Number(String(value).replace(",", ".")) || 0;
const money = (n) => n.toLocaleString("ar-EG", { maximumFractionDigits: 2 });

export default function ZakatPage() {
  const [values, setValues] = useState({
    cash: "",
    metals: "",
    trade: "",
    owed: "",
    debts: "",
  });
  const [basis, setBasis] = useState("gold");
  const [price, setPrice] = useState("");

  const wealth =
    num(values.cash) +
    num(values.metals) +
    num(values.trade) +
    num(values.owed) -
    num(values.debts);
  const nisab = NISAB[basis].grams * num(price);
  const hasNisab = nisab > 0;
  const due = hasNisab && wealth >= nisab ? wealth * RATE : 0;

  return (
    <>
      <SectionHeader
        title="حاسبة الزكاة"
        subtitle="أدخل المبالغ بعملتك المحلية"
      />

      <IslamicCard>
        <div className="field">
          <span className="lbl" id="basis-lbl">
            النصاب يُحسب بسعر
          </span>
          <div className="seg" role="group" aria-labelledby="basis-lbl">
            {Object.entries(NISAB).map(([key, { label }]) => (
              <button
                key={key}
                aria-pressed={basis === key}
                onClick={() => setBasis(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="price">
            سعر جرام {basis === "gold" ? "الذهب" : "الفضة"} اليوم
          </label>
          <input
            id="price"
            className="select"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {FIELDS.map(([key, label]) => (
          <div className="field" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              className="select"
              inputMode="decimal"
              value={values[key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [key]: e.target.value }))
              }
            />
          </div>
        ))}
      </IslamicCard>

      <IslamicCard className="zakat-result" aria-live="polite">
        <div>
          <span>صافي المال</span>
          <strong>{money(wealth)}</strong>
        </div>
        <div>
          <span>قيمة النصاب</span>
          <strong>{hasNisab ? money(nisab) : "—"}</strong>
        </div>
        <div className="due">
          <span>الزكاة الواجبة (٢٫٥٪)</span>
          <strong>{hasNisab ? money(due) : "أدخل سعر الجرام"}</strong>
        </div>
        {hasNisab && due === 0 && <p>المال لم يبلغ النصاب، فلا زكاة فيه.</p>}
      </IslamicCard>

      <p className="hint">
        الحساب تقريبي ويفترض مرور سنة هجرية كاملة على المال (الحَوْل). مقادير
        النصاب ونسبة ٢٫٥٪ هي المتعارف عليها، وتختلف آراء الفقهاء في بعض الأموال
        والديون، فاسأل أهل العلم في حالتك.
      </p>
    </>
  );
}
