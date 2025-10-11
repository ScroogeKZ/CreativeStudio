import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MultilingualInputProps {
  name: string;
  label: string;
  value?: { ru: string; kz: string; en: string };
  onChange: (value: { ru: string; kz: string; en: string }) => void;
  type?: "input" | "textarea";
  required?: boolean;
}

export function MultilingualInput({ 
  name, 
  label, 
  value = { ru: "", kz: "", en: "" }, 
  onChange,
  type = "input",
  required = false 
}: MultilingualInputProps) {
  const Component = type === "textarea" ? Textarea : Input;

  return (
    <div className="space-y-3">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <div className="space-y-2 pl-4 border-l-2 border-muted">
        <div>
          <Label htmlFor={`${name}-ru`} className="text-xs text-muted-foreground">RU</Label>
          <Component
            id={`${name}-ru`}
            value={value.ru}
            onChange={(e) => onChange({ ...value, ru: e.target.value })}
            required={required}
            data-testid={`input-${name}-ru`}
          />
        </div>
        <div>
          <Label htmlFor={`${name}-kz`} className="text-xs text-muted-foreground">KZ</Label>
          <Component
            id={`${name}-kz`}
            value={value.kz}
            onChange={(e) => onChange({ ...value, kz: e.target.value })}
            required={required}
            data-testid={`input-${name}-kz`}
          />
        </div>
        <div>
          <Label htmlFor={`${name}-en`} className="text-xs text-muted-foreground">EN</Label>
          <Component
            id={`${name}-en`}
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            required={required}
            data-testid={`input-${name}-en`}
          />
        </div>
      </div>
    </div>
  );
}
