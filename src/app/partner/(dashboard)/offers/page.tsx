"use client";

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePartnerOffers } from '@/hooks/use-partner-offers';
import { offersApi } from '@/lib/api';
import { OffersList } from '@/components/OffersList';
import { Button } from '@/components/ui/button';
import type { Offer } from '@/lib/types';

export default function PartnerOffersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: offers = [], isLoading } = usePartnerOffers();

  const toggleMutation = useMutation({
    mutationFn: async (offer: Offer) => offersApi.updateOffer(offer.id, { isActive: !offer.isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partner-offers'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (offer: Offer) => offersApi.deleteOffer(offer.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partner-offers'] }),
  });

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Mes offres Mapéro</h1>
          <p className="text-sm text-white/60">
            Configurez vos réductions, offres spéciales et happy hours en quelques clics.
          </p>
        </div>
        <Button size="sm" onClick={() => router.push('/partner/offers/new')}>
          + Nouvelle offre
        </Button>
      </header>

      <OffersList
        offers={offers}
        isLoading={isLoading}
        onEdit={(offer) => router.push(`/partner/offers/${offer.id}/edit`)}
        onToggle={(offer) => toggleMutation.mutate(offer)}
        onDelete={(offer) => deleteMutation.mutate(offer)}
      />
    </div>
  );
}
