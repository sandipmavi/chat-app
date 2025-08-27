import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

const colors = ["#00bac4", "#00c41d", "#8b5cf6", "#e11d48", "#f59e0b"];

export default function AccentPicker() {
  const { accent, setAccent } = useContext(ThemeContext);
  function handleClick(color) {
    console.log(color);
    setAccent(color);
  }

  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => handleClick(color)}
          className={`w-7 h-7 rounded-full ${
            accent === color ? "ring-2 ring-gray-400" : ""
          }`}
        />
      ))}
    </div>
  );
}
