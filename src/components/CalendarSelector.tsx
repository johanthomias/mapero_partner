"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { OfferSchedule } from '@/lib/types';

const days = [
  { value: 'monday', label: 'L' },
  { value: 'tuesday', label: 'M' },
  { value: 'wednesday', label: 'M' },
  { value: 'thursday', label: 'J' },
  { value: 'friday', label: 'V' },
  { value: 'saturday', label: 'S' },
  { value: 'sunday', label: 'D' },
] as const;

interface CalendarSelectorProps {
  value: OfferSchedule;
  onChange: (schedule: OfferSchedule) => void;
}

export function CalendarSelector({ value, onChange }: CalendarSelectorProps) {
  const toggleDay = (day: OfferSchedule['days'][number]) => {
    const nextDays = value.days.includes(day)
      ? value.days.filter((d) => d !== day)
      : [...value.days, day];
    onChange({ ...value, days: nextDays });
  };

  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-card p-4">
      <p className="text-xs uppercase tracking-widest text-text/50">Jours concernés</p>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const isActive = value.days.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold ${
                isActive
                  ? 'border-primary bg-primary/20 text-text'
                  : 'border-white/10 text-text/60 hover:text-text'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs uppercase tracking-widest text-text/50">Créneau</p>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="time"
          value={value.startTime}
          onChange={(event) => onChange({ ...value, startTime: event.target.value })}
        />
        <Input
          type="time"
          value={value.endTime}
          onChange={(event) => onChange({ ...value, endTime: event.target.value })}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="justify-center border border-dashed border-white/10 text-xs uppercase tracking-widest text-text/60"
        onClick={() => onChange({ days: [], startTime: '17:00', endTime: '20:00' })}
      >
        Réinitialiser
      </Button>
    </div>
  );
}
