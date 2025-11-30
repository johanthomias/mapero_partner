"use client";

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OfferForm, type OfferFormValues } from '@/components/OfferForm';
import { offersApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';

export default function NewOfferPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const establishmentId = useAuthStore((state) => state.user?.establishmentId ?? 'est_001');

  const mutation = useMutation({
    mutationFn: async (values: OfferFormValues) => {
      return offersApi.createOffer({
        ...values,
        establishmentId,
        validity: {
          startDate: new Date(values.validity.startDate).toISOString(),
          endDate: new Date(values.validity.endDate).toISOString(),
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partner-offers'] });
      router.push('/partner/offers');
    },
  });

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border-white/10 bg-black/40 p-6 text-white">
        <p className="text-xs uppercase tracking-widest text-white/50">Nouvelle offre</p>
        <h1 className="text-2xl font-semibold">Paramétrer une offre Mapéro</h1>
        <p className="text-sm text-white/60">
          Astuce : ciblez un créneau précis (jours + heures) pour remplir vos horaires creux et
          créer de la rareté.
        </p>
      </Card>

      <OfferForm onSubmit={(values) => mutation.mutate(values)} isLoading={mutation.isPending} />
    </div>
  );
}
