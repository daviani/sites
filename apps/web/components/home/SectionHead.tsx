interface SectionHeadProps {
  /** Ex. "01 — Sélection" — la partie avant « — » est mise en accent. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/**
 * En-tête de section (rythme éditorial des maquettes v2) : eyebrow mono numéroté +
 * titre fort + sous-titre. Présentation pure, theme-aware via les tokens Tulikettu.
 */
export function SectionHead({ eyebrow, title, subtitle }: SectionHeadProps) {
  const [num, label] = eyebrow?.includes(' — ') ? eyebrow.split(' — ') : [null, eyebrow];

  return (
    <div className="mb-9">
      {eyebrow && (
        <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted mb-3.5">
          {num && (
            <>
              <span className="text-accent font-semibold">{num}</span>
              <span aria-hidden="true">—</span>
            </>
          )}
          <span>{label}</span>
        </div>
      )}
      <h2 className="text-[clamp(28px,3.4vw,40px)] font-bold tracking-[-0.025em] text-fg">{title}</h2>
      {subtitle && <p className="text-fg-muted mt-2.5 max-w-[60ch]">{subtitle}</p>}
    </div>
  );
}
