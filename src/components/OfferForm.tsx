"use client";

import { useEffect, type ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarSelector } from '@/components/CalendarSelector';
import type { OfferSchedule } from '@/lib/types';

const dayEnum = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const);

const scheduleSchema = z.object({
  days: z.array(dayEnum).min(1, 'Sélectionnez au moins un jour'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
});

const offerSchema = z
  .object({
    title: z.string().min(4, 'Titre trop court'),
    description: z.string().min(10, 'Décrivez votre avantage'),
    type: z.enum(['percentage', 'special', 'happy-hour']),
    percentage: z.number().min(5).max(80).optional(),
    specialText: z.string().max(160).optional(),
    happyHourPrice: z.number().min(1).optional(),
    schedule: scheduleSchema,
    validity: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    isActive: z.boolean().default(true),
  })
  .superRefine((values, ctx) => {
    if (values.type === 'percentage' && typeof values.percentage !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['percentage'],
        message: 'Indiquez un pourcentage',
      });
    }

    if (values.type === 'happy-hour' && typeof values.happyHourPrice !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['happyHourPrice'],
        message: 'Indiquez un prix Happy Hour',
      });
    }

    if (values.type === 'special' && !values.specialText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specialText'],
        message: 'Décrivez votre avantage spécial',
      });
    }

    if (new Date(values.validity.endDate) < new Date(values.validity.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['validity', 'endDate'],
        message: 'La fin doit être après le début',
      });
    }
  });

export type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  defaultValues?: Partial<OfferFormValues>;
  onSubmit: (values: OfferFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

const defaultSchedule: OfferSchedule = {
  days: ['wednesday', 'thursday', 'friday'],
  startTime: '17:00',
  endTime: '20:00',
};

type ScheduleError = {
  message?: string;
  days?: { message?: string };
};

const createDefaults = (values?: Partial<OfferFormValues>): OfferFormValues => ({
  title: values?.title ?? '',
  description: values?.description ?? '',
  type: values?.type ?? 'percentage',
  percentage: values?.percentage ?? 20,
  specialText: values?.specialText ?? '',
  happyHourPrice: values?.happyHourPrice ?? 9,
  schedule:
    values?.schedule ?? {
      days: [...defaultSchedule.days],
      startTime: defaultSchedule.startTime,
      endTime: defaultSchedule.endTime,
    },
  validity:
    values?.validity ??
    {
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
    },
  isActive: values?.isActive ?? true,
});

export function OfferForm({ defaultValues, onSubmit, isLoading }: OfferFormProps) {
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: createDefaults(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(createDefaults(defaultValues));
    }
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const currentType = form.watch('type');
  const scheduleErrors = form.formState.errors.schedule as ScheduleError | undefined;
  const scheduleMessage = scheduleErrors?.message ?? scheduleErrors?.days?.message;

  return (
    <form className="grid gap-8" onSubmit={handleSubmit}>
      <section className="grid gap-4">
        <Field label="Titre de l’offre" error={form.formState.errors.title?.message}>
          <Input placeholder="-30% sur les planches à partager" {...form.register('title')} />
        </Field>
        <Field label="Description" error={form.formState.errors.description?.message}>
          <Textarea
            placeholder="Expliquez les avantages, conditions et limites pour l’abonné."
            {...form.register('description')}
          />
        </Field>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Type d’offre" error={form.formState.errors.type?.message}>
          <select
            {...form.register('type')}
            className="h-12 rounded-2xl border border-white/10 px-4 text-sm text-text"
          >
            <option value="percentage">Réduction %</option>
            <option value="special">Offre spéciale</option>
            <option value="happy-hour">Happy hour</option>
          </select>
        </Field>

        {currentType === 'percentage' ? (
          <Field label="Pourcentage" error={form.formState.errors.percentage?.message}>
            <div className="relative">
              <Input
                type="number"
                min={5}
                max={80}
                className="pr-10"
                {...form.register('percentage', { valueAsNumber: true })}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text/60">
                %
              </span>
            </div>
          </Field>
        ) : null}

        {currentType === 'special' ? (
          <Field label="Avantage proposé" error={form.formState.errors.specialText?.message}>
            <Input placeholder="1 boisson offerte, tapas..." {...form.register('specialText')} />
          </Field>
        ) : null}

        {currentType === 'happy-hour' ? (
          <Field
            label="Prix Happy Hour"
            error={form.formState.errors.happyHourPrice?.message}
          >
            <div className="relative">
              <Input
                type="number"
                step="0.5"
                min={1}
                className="pr-10"
                {...form.register('happyHourPrice', { valueAsNumber: true })}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text/60">
                €
              </span>
            </div>
          </Field>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3">
          <label className="text-xs uppercase tracking-widest text-text/50">
            Jours & créneaux
          </label>

          {/* ✅ La bonne façon : utiliser Controller */}
          <Controller
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <CalendarSelector
                value={field.value ?? defaultSchedule} // 👈 fallback sécurisé
                onChange={(schedule) => field.onChange(schedule)}
              />
            )}
          />

          {scheduleMessage ? (
            <p className="text-xs text-danger">{scheduleMessage}</p>
          ) : null}
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-card p-4">
          <label className="text-xs uppercase tracking-widest text-text/50">Période</label>
          <Field label="Début" error={form.formState.errors.validity?.startDate?.message}>
            <Input type="date" {...form.register('validity.startDate')} />
          </Field>
          <Field label="Fin" error={form.formState.errors.validity?.endDate?.message}>
            <Input type="date" {...form.register('validity.endDate')} />
          </Field>
          <label className="mt-2 flex items-center gap-2 text-xs text-text/70">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-transparent text-primary"
              {...form.register('isActive')}
            />
            Offre active
          </label>
        </div>
      </section>


      <Button type="submit" size="lg" disabled={isLoading}>
        {defaultValues ? 'Mettre à jour' : 'Publier l’offre'}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-text/60">{label}</label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
