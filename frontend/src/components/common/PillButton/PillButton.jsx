import clsx from "clsx";
import "./PillButton.css";

function PillButton({
  icon,
  children,
  active = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      className={clsx("pill-btn", active && "pill-btn-active")}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="pill-icon">{icon}</span>}

      {children && <span>{children}</span>}
    </button>
  );
}

export default PillButton;
