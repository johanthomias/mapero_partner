"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OfferForm, type OfferFormValues } from '@/components/OfferForm';
import { usePartnerOffer } from '@/hooks/use-partner-offer';
import { offersApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import type { Offer } from '@/lib/types';

const toFormValues = (offer?: Offer): OfferFormValues | undefined => {
  if (!offer) return undefined;
  return {
    title: offer.title,
    description: offer.description,
    type: offer.type,
    percentage: offer.percentage,
    specialText: offer.specialText,
    happyHourPrice: offer.happyHourPrice,
    schedule: offer.schedule,
    validity: {
      startDate: offer.validity.startDate.slice(0, 10),
      endDate: offer.validity.endDate.slice(0, 10),
    },
    isActive: offer.isActive,
  };
};

export default function EditOfferPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: offer, isLoading } = usePartnerOffer(params.id);
  const defaultValues = useMemo(() => toFormValues(offer), [offer]);

  const mutation = useMutation({
    mutationFn: async (values: OfferFormValues) =>
      offersApi.updateOffer(params.id, {
        ...values,
        validity: {
          startDate: new Date(values.validity.startDate).toISOString(),
          endDate: new Date(values.validity.endDate).toISOString(),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partner-offers'] });
      await queryClient.invalidateQueries({ queryKey: ['partner-offer', params.id] });
      router.push('/partner/offers');
    },
  });

  if (isLoading || !defaultValues) {
    return <div className="py-10 text-center text-white/70">Chargement de l’offre…</div>;
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border-white/10 bg-black/40 p-6 text-white">
        <p className="text-xs uppercase tracking-widest text-white/50">Modifier une offre</p>
        <h1 className="text-2xl font-semibold">{offer?.title}</h1>
        <p className="text-sm text-white/60">
          Ajustez votre promotion sans la dépublier, vos abonnés verront instantanément les
          changements.
        </p>
      </Card>

      <OfferForm
        defaultValues={defaultValues}
        onSubmit={(values) => mutation.mutate(values)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
