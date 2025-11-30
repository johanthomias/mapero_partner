"use client";

import type { Offer } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DashboardTableProps {
  offers: Offer[];
  isLoading?: boolean;
}

const statusStyles = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-danger/10 text-danger',
};

const typeLabels: Record<Offer['type'], string> = {
  'percentage': 'Réduction %',
  'happy-hour': 'Happy hour',
  'special': 'Offre spéciale',
};

export function DashboardTable({ offers, isLoading }: DashboardTableProps) {
  const rows = offers.slice(0, 5);

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card ring-1 ring-border/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtleText">Deals actifs</p>
          <h2 className="text-lg font-semibold text-text">Vos dernières offres</h2>
        </div>
        <span className="text-sm text-subtleText">{offers.length} offres</span>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border/70">
        <table className="min-w-full divide-y divide-border/70 text-left text-sm">
          <thead className="bg-background/60 text-subtleText">
            <tr>
              <th className="px-4 py-3 font-medium">Offre</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Créneaux</th>
              <th className="px-4 py-3 font-medium text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 bg-card">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-4 py-4" colSpan={4}>
                      <div className="h-4 w-full animate-pulse rounded bg-background" />
                    </td>
                  </tr>
                ))
              : rows.map((offer) => (
                  <tr key={offer.id} className="transition hover:bg-background/60">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-text">{offer.title}</p>
                        <p className="text-xs text-subtleText line-clamp-1">{offer.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-subtleText">{typeLabels[offer.type]}</td>
                    <td className="px-4 py-4 text-subtleText">
                      <span className="font-medium text-text">
                        {offer.schedule.startTime} - {offer.schedule.endTime}
                      </span>
                      <span className="ml-2 text-xs uppercase tracking-wide text-subtleText">
                        {offer.schedule.days.slice(0, 3).join(' · ')}
                        {offer.schedule.days.length > 3 ? '…' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-semibold capitalize',
                            statusStyles[offer.isActive ? 'active' : 'inactive'],
                          )}
                        >
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!isLoading && offers.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-subtleText">
            Aucune offre pour le moment. Créez votre première promotion pour apparaître ici.
          </div>
        ) : null}
      </div>
    </div>
  );
}
