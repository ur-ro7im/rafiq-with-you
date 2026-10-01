import { GRADERS, GRADES } from "../../constants/hadith";

function tone(grade) {
  const g = grade.toLowerCase();
  if (/daif|munkar|shadh/.test(g)) return "weak";
  if (/sahih|hasan/.test(g)) return "good";
  return "";
}

export default function GradeList({ grades }) {
  if (!grades?.length) return null;

  return (
    <ul className="grades" aria-label="درجة الحديث">
      {grades.map((g) => (
        <li key={g.name} className={`grade ${tone(g.grade)}`}>
          {GRADERS[g.name] ?? g.name}:{" "}
          {GRADES[g.grade.toLowerCase()] ?? g.grade}
        </li>
      ))}
    </ul>
  );
}
