import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ThesisImpact, ThesisImpactKind } from '@finagent/core';

const KIND_BADGE: Record<ThesisImpactKind, { color: string }> = {
  unchanged: { color: '#9ca3af' },
  strengthened: { color: '#22c55e' },
  weakened: { color: '#f59e0b' },
  invalidated: { color: '#ef4444' },
};

/** Impact history: kind badge + evaluator summary + date. */
export const ThesisImpactList: React.FC<{ impacts: ThesisImpact[] }> = ({ impacts }) => {
  const { t } = useTranslation();
  if (impacts.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-border bg-surface px-4 py-7 text-center text-[12px] text-foreground/44">
        {t('thesis.impact.noneYet')}
      </div>
    );
  }

  return (
    <div className="folio-thesis-impact-list overflow-hidden rounded-[10px] border border-border bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
      {impacts.map((impact) => {
        const badge = KIND_BADGE[impact.kind];
        return (
          <div
            key={impact.id}
            className="border-b border-border px-3 py-3 transition-smooth last:border-b-0 hover:bg-surface"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-[5px] border border-border bg-surface-muted px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: badge.color }}
              >
                {t(`thesis.impact.${impact.kind}`)}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-text-muted">
                {new Date(impact.evaluatedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-[12px] leading-5 text-foreground/70">{impact.summary}</p>
          </div>
        );
      })}
    </div>
  );
};
