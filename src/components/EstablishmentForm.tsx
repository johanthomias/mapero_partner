"use client";

import { useEffect, type ReactNode } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const days = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
] as const;

const openingDaySchema = z.object({
  closed: z.boolean(),
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
});

const establishmentSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().min(20, 'Ajoutez une description engageante'),
  phone: z.string().min(6, 'Téléphone invalide'),
  email: z.string().email('Email invalide'),
  addressLine1: z.string().min(3, 'Adresse requise'),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(4, 'Code postal invalide'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(2, 'Pays requis'),
  openingHours: z.record(openingDaySchema),
  photos: z.array(z.string().url('URL invalide')).min(1, 'Ajoutez au moins une photo'),
});

export type EstablishmentFormValues = z.infer<typeof establishmentSchema>;

interface EstablishmentFormProps {
  defaultValues?: Partial<EstablishmentFormValues>;
  onSubmit: (values: EstablishmentFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

const createOpeningHours = (
  openings?: Partial<EstablishmentFormValues['openingHours']>,
): EstablishmentFormValues['openingHours'] =>
  days.reduce<Record<string, { open: string; close: string; closed: boolean }>>((acc, day) => {
    const source = openings?.[day.value];
    acc[day.value] = {
      open: source?.open ?? '17:00',
      close: source?.close ?? '23:30',
      closed: source?.closed ?? day.value === 'sunday',
    };
    return acc;
  }, {});

const createDefaults = (values?: Partial<EstablishmentFormValues>): EstablishmentFormValues => ({
  name: values?.name ?? '',
  description: values?.description ?? '',
  phone: values?.phone ?? '',
  email: values?.email ?? '',
  addressLine1: values?.addressLine1 ?? '',
  addressLine2: values?.addressLine2,
  postalCode: values?.postalCode ?? '',
  city: values?.city ?? '',
  country: values?.country ?? 'France',
  openingHours: createOpeningHours(values?.openingHours),
  photos: values?.photos?.length ? values.photos : [''],
});

export function EstablishmentForm({ defaultValues, onSubmit, isLoading }: EstablishmentFormProps) {
  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: createDefaults(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(createDefaults(defaultValues));
    }
  }, [defaultValues, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'photos',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form className="grid gap-8" onSubmit={handleSubmit}>
      <section className="grid gap-4">
        <SectionTitle title="Informations générales" description="Présentez les détails clés visibles sur Mapéro." />
        <Field label="Nom de l’établissement" error={form.formState.errors.name?.message}>
          <Input placeholder="Le Comptoir Mapéro" {...form.register('name')} />
        </Field>
        <Field label="Description" error={form.formState.errors.description?.message}>
          <Textarea
            placeholder="Ambiance, spécialités, signature culinaire…"
            {...form.register('description')}
          />
        </Field>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Téléphone" error={form.formState.errors.phone?.message}>
          <Input placeholder="+33 1 42 00 00 00" {...form.register('phone')} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="contact@comptoirmapero.fr" {...form.register('email')} />
        </Field>
      </section>

      <section className="grid gap-4">
        <SectionTitle title="Adresse" description="Vos informations apparaîtront dans la carte Mapéro." />
        <Field label="Adresse" error={form.formState.errors.addressLine1?.message}>
          <Input placeholder="12 rue des Apéros" {...form.register('addressLine1')} />
        </Field>
        <Field label="Complément d’adresse" error={form.formState.errors.addressLine2?.message}>
          <Input placeholder="Bâtiment B" {...form.register('addressLine2')} />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Code postal" error={form.formState.errors.postalCode?.message}>
            <Input placeholder="75011" {...form.register('postalCode')} />
          </Field>
          <Field label="Ville" error={form.formState.errors.city?.message}>
            <Input placeholder="Paris" {...form.register('city')} />
          </Field>
          <Field label="Pays" error={form.formState.errors.country?.message}>
            <Input placeholder="France" {...form.register('country')} />
          </Field>
        </div>
      </section>

      <section className="grid gap-4">
        <SectionTitle
          title="Horaires d’ouverture"
          description="Indiquez les créneaux accessibles aux abonnés Mapéro."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {days.map((day) => {
            const closed = form.watch(`openingHours.${day.value}.closed`);
            return (
              <div key={day.value} className="rounded-3xl border border-white/5 bg-black/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{day.label}</span>
                  <label className="flex items-center gap-2 text-xs text-white/60">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/30 bg-transparent text-primary"
                      {...form.register(`openingHours.${day.value}.closed` as const)}
                    />
                    Fermé
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Input
                    type="time"
                    disabled={closed}
                    {...form.register(`openingHours.${day.value}.open` as const)}
                  />
                  <Input
                    type="time"
                    disabled={closed}
                    {...form.register(`openingHours.${day.value}.close` as const)}
                  />
                </div>
                {form.formState.errors.openingHours?.[day.value]?.message ? (
                  <p className="mt-2 text-xs text-accent">
                    {form.formState.errors.openingHours?.[day.value]?.message as string}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        <SectionTitle title="Photos" description="Ajoutez 1 à 3 photos mettant votre lieu en valeur." />
        <div className="grid gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3 md:flex-row">
              <Input
                placeholder="https://images.unsplash.com/…"
                {...form.register(`photos.${index}` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                className="md:w-auto"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                Retirer
              </Button>
            </div>
          ))}
          {form.formState.errors.photos ? (
            <p className="text-xs text-accent">{form.formState.errors.photos.message}</p>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            className="justify-center"
            onClick={() => append('')}
          >
            + Ajouter une photo
          </Button>
        </div>
      </section>

      <Button type="submit" size="lg" disabled={isLoading}>
        Enregistrer
      </Button>
    </form>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-white/50">{title}</p>
      <p className="text-sm text-white/60">{description}</p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</label>
      {children}
      {error ? <p className="text-xs text-accent">{error}</p> : null}
    </div>
  );
}
