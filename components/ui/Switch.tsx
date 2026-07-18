"use client";

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
};

export default function Switch({ checked, onChange, label, description }: Props) {
  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div>
          {label && (
            <p className="text-sm font-medium text-on-surface">{label}</p>
          )}
          {description && (
            <p className="text-xs text-on-surface-variant">{description}</p>
          )}
        </div>
      )}
      <button
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-8 w-[52px] shrink-0 m3-shape-full transition-colors duration-200 ${
          checked ? "bg-primary" : "bg-surface-container-highest"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 m3-shape-full bg-white shadow-md transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          } mt-1`}
        />
      </button>
    </div>
  );
}
