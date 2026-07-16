"use client";

import { useState, useCallback, useRef, useEffect, type ChangeEvent } from "react";
import { X } from "lucide-react";

const QUICK_COLORS = [
  { name: "Vermelho", hex: "#EF4444" },
  { name: "Laranja", hex: "#F97316" },
  { name: "Amarelo", hex: "#EAB308" },
  { name: "Verde", hex: "#22C55E" },
  { name: "Ciano", hex: "#06B6D4" },
  { name: "Azul", hex: "#3B82F6" },
  { name: "Roxo", hex: "#8B5CF6" },
  { name: "Rosa", hex: "#EC4899" },
  { name: "Marrom", hex: "#92400E" },
  { name: "Cinza", hex: "#6B7280" },
];

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return { h: 0, s: 0, v: 50 };
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h,
    s: max === 0 ? 0 : Math.round((d / max) * 100),
    v: Math.round(max * 100),
  };
}

function hsvToHex(h: number, s: number, v: number): string {
  const sN = s / 100;
  const vN = v / 100;
  const c = vN * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vN - c;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(hex: string): boolean {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

interface ColorPickerModalProps {
  isOpen: boolean;
  initialColor: string;
  onSave: (color: string) => void;
  onCancel: () => void;
}

export function ColorPickerModal({
  isOpen,
  initialColor,
  onSave,
  onCancel,
}: ColorPickerModalProps) {
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(0);
  const [bright, setBright] = useState(50);
  const [hexInput, setHexInput] = useState("6B7280");
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentHex = hsvToHex(hue, sat, bright);
  const displayHex = isTyping ? hexInput : currentHex.replace("#", "");

  useEffect(() => {
    if (isOpen) {
      const hsv = hexToHsv(initialColor);
      setHue(hsv.h);
      setSat(hsv.s);
      setBright(hsv.v);
      setHexInput(initialColor.replace("#", ""));
      setIsTyping(false);
    }
  }, [isOpen, initialColor]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  const handleHexChange = useCallback((value: string) => {
    const clean = value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    setHexInput(clean);
    setIsTyping(true);
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => setIsTyping(false), 800);
    if (clean.length === 6 && isValidHex(`#${clean}`)) {
      const hsv = hexToHsv(`#${clean}`);
      setHue(hsv.h);
      setSat(hsv.s);
      setBright(hsv.v);
    }
  }, []);

  const handleQuickColor = useCallback((hex: string) => {
    const hsv = hexToHsv(hex);
    setHue(hsv.h);
    setSat(hsv.s);
    setBright(hsv.v);
    setHexInput(hex.replace("#", ""));
    setIsTyping(false);
  }, []);

  const handleSave = useCallback(() => {
    onSave(currentHex);
  }, [onSave, currentHex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl dark:bg-neutral-900"
        role="dialog"
        aria-label="Seletor de cor"
      >
        <style jsx global>{`
          .color-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 12px;
            border-radius: 9999px;
            outline: none;
            cursor: pointer;
          }
          .color-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.15s ease;
          }
          .color-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
          .color-slider::-webkit-slider-thumb:active {
            transform: scale(1.05);
          }
          .color-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1);
            cursor: pointer;
          }
        `}</style>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Cor da Coleção</h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className="h-14 w-14 shrink-0 rounded-xl shadow-inner transition-colors duration-200"
              style={{
                backgroundColor: currentHex,
                boxShadow: `0 0 0 3px ${currentHex}20, inset 0 2px 4px rgba(0,0,0,0.1)`,
              }}
            />
            <span className="text-[10px] text-neutral-400">Preview</span>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              HEX
            </label>
            <div className="flex items-center gap-1">
              <span className="text-base font-mono font-medium text-neutral-700 dark:text-neutral-300">#</span>
              <input
                type="text"
                value={displayHex}
                onChange={(e) => handleHexChange(e.target.value)}
                maxLength={6}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 font-mono text-base font-medium uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="3B82F6"
                aria-label="Código hexadecimal da cor"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          <SliderControl
            label="Matiz"
            value={hue}
            max={360}
            unit="°"
            onChange={setHue}
            gradient="linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))"
          />
          <SliderControl
            label="Saturação"
            value={sat}
            max={100}
            unit="%"
            onChange={setSat}
            gradient={`linear-gradient(to right, hsl(${hue},0%,50%), hsl(${hue},100%,50%))`}
          />
          <SliderControl
            label="Luminosidade"
            value={bright}
            max={100}
            unit="%"
            onChange={setBright}
            gradient={`linear-gradient(to right, hsl(${hue},${sat}%,0%), hsl(${hue},${sat}%,50%), hsl(${hue},${sat}%,100%))`}
          />
        </div>

        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Cores Rápidas
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {QUICK_COLORS.map((color) => (
              <button
                key={color.hex}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleQuickColor(color.hex);
                }}
                className={`h-8 w-full rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md ${
                  currentHex.toUpperCase() === color.hex.toUpperCase()
                    ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900"
                    : ""
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-neutral-300 px-3 py-2.5 text-sm font-semibold transition hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

interface SliderControlProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
  gradient: string;
}

function SliderControl({ label, value, max, unit, onChange, gradient }: SliderControlProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    [onChange]
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</label>
        <span className="text-xs tabular-nums text-neutral-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={handleChange}
        className="color-slider w-full"
        style={{ background: gradient }}
        aria-label={label}
      />
    </div>
  );
}
