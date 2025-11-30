"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, ToggleRight, ToggleLeft } from 'lucide-react';
import type { Offer } from '@/lib/types';

interface OffersListProps {
  offers: Offer[];
  isLoading?: boolean;
  onEdit?: (offer: Offer) => void;
  onToggle?: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
}

export function OffersList({ offers, isLoading, onEdit, onToggle, onDelete }: OffersListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!offers.length) {
    return (
      <Card className="rounded-3xl border-white/10 bg-card p-8 text-center text-sm text-text/70">
        Aucune offre pour le moment. Créez votre première promotion pour booster vos soirées.
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {offers.map((offer) => (
        <Card
          key={offer.id}
          className="rounded-3xl border-white/10 bg-card p-6 text-sm text-text/70"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-text/50">
                {offer.type === 'percentage'
                  ? 'Réduction %'
                  : offer.type === 'happy-hour'
                  ? 'Happy hour'
                  : 'Offre spéciale'}
              </p>
              <h2 className="text-xl font-semibold text-text">{offer.title}</h2>
              <p className="text-text/70">{offer.description}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(offer)}>
                Modifier
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onToggle?.(offer)}>
                {offer.isActive ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Désactiver
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Activer
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete?.(offer)}>
                Supprimer
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-text/60">
            <span className="flex items-center gap-2 rounded-full border border-white/10  px-3 py-1">
              <Clock className="h-4 w-4" />
              {offer.schedule.startTime} → {offer.schedule.endTime}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10  px-3 py-1">
              <Calendar className="h-4 w-4" />
              {offer.schedule.days.map((day) => day.slice(0, 2).toUpperCase()).join(' · ')}
            </span>
            <span className="rounded-full border border-white/10  px-3 py-1 font-semibold text-text">
              {offer.type === 'percentage' && offer.percentage ? `${offer.percentage}%`
                : offer.type === 'happy-hour' && offer.happyHourPrice
                ? `${offer.happyHourPrice.toFixed(2)}€`
                : offer.specialText}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
