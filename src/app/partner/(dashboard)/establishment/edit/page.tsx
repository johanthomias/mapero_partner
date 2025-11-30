"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EstablishmentForm, type EstablishmentFormValues } from '@/components/EstablishmentForm';
import { usePartnerEstablishment } from '@/hooks/use-partner-establishment';
import { establishmentApi } from '@/lib/api';
import type { Establishment, OpeningDay } from '@/lib/types';
import { Card } from '@/components/ui/card';

const dayOrder: OpeningDay['day'][] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const toFormValues = (establishment?: Establishment): EstablishmentFormValues | undefined => {
  if (!establishment) return undefined;
  const openingHours = dayOrder.reduce<Record<string, { closed: boolean; open: string; close: string }>>(
    (acc, day) => {
      const slot = establishment.openingHours.find((item) => item.day === day)?.slots?.[0];
      acc[day] = {
        closed: !slot,
        open: slot?.open ?? '17:00',
        close: slot?.close ?? '23:30',
      };
      return acc;
    },
    {},
  );
  return {
    name: establishment.name,
    description: establishment.description,
    phone: establishment.phone,
    email: establishment.email,
    addressLine1: establishment.address.line1,
    addressLine2: establishment.address.line2,
    postalCode: establishment.address.postalCode,
    city: establishment.address.city,
    country: establishment.address.country,
    openingHours,
    photos: establishment.photos.length ? establishment.photos : [''],
  };
};

const toApiPayload = (
  values: EstablishmentFormValues,
): Omit<Establishment, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: values.name,
  description: values.description,
  phone: values.phone,
  email: values.email,
  address: {
    line1: values.addressLine1,
    line2: values.addressLine2,
    postalCode: values.postalCode,
    city: values.city,
    country: values.country,
  },
  openingHours: Object.entries(values.openingHours).map(([day, slots]) => ({
    day: day as OpeningDay['day'],
    slots: slots.closed ? [] : [{ open: slots.open, close: slots.close }],
  })),
  photos: values.photos.filter(Boolean),
});

export default function EstablishmentEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: establishment } = usePartnerEstablishment();

  const defaultValues = useMemo(() => toFormValues(establishment ?? undefined), [establishment]);

  const mutation = useMutation({
    mutationFn: async (values: EstablishmentFormValues) => {
      const payload = toApiPayload(values);
      if (establishment?.id) {
        return establishmentApi.updateEstablishment(establishment.id, payload);
      }
      return establishmentApi.createEstablishment(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partner-establishment'] });
      router.push('/partner/establishment');
    },
  });

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border-white/10 bg-black/40 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/50">Mon établissement</p>
          <h1 className="text-2xl font-semibold text-white">Personnaliser ma fiche Mapéro</h1>
          <p className="text-sm text-white/60">
            Ces informations sont visibles par les abonnés Mapéro dans l’app et alimentent
            l’algorithme de recommandation.
          </p>
        </div>
      </Card>
      <EstablishmentForm
        defaultValues={defaultValues}
        onSubmit={(values) => mutation.mutate(values)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
