"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Phone, Mail, Camera, Clock, Edit3 } from 'lucide-react';
import { usePartnerEstablishment } from '@/hooks/use-partner-establishment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const dayLabels: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export default function PartnerEstablishmentPage() {
  const router = useRouter();
  const { data: establishment, isLoading } = usePartnerEstablishment();

  if (isLoading) {
    return <div className="py-10 text-center text-text/70">Chargement de vos informations…</div>;
  }

  if (!establishment) {
    return (
      <Card className="grid gap-6 rounded-3xl border-white/10 p-8 text-center text-text/70">
        <p>Aucune fiche établissement n’est encore configurée.</p>
        <Button size="sm" className="mx-auto" onClick={() => router.push('/partner/establishment/edit')}>
          Créer ma fiche
        </Button>
      </Card>
    );
  }

  const orderedOpeningHours = (
    Object.keys(dayLabels) as Array<keyof typeof dayLabels>
  ).map((dayKey) => {
    const existing = establishment.openingHours.find((item) => item.day === dayKey);
    return existing ?? { day: dayKey, slots: [] };
  });

  return (
    <div className="grid gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text">{establishment.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-text/70">
            <MapPin className="h-4 w-4" />
            {establishment.address.line1}, {establishment.address.postalCode}{' '}
            {establishment.address.city}
          </p>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/partner/establishment/edit')}
        >
          <Edit3 className="h-4 w-4" />
          Modifier
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {(establishment.photos ?? []).map((photo, index) => (
          <Card key={photo ?? `photo-${index}`} className="relative h-56 overflow-hidden rounded-3xl">
            {photo ? (
              <Image
                src={photo}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center gap-2 text-text/50">
                <Camera className="h-6 w-6" />
                Ajoutez une photo
              </div>
            )}
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="grid gap-4 rounded-3xl border-white/10  p-6 text-sm text-text/70">
          <h2 className="text-lg font-semibold text-text">Informations</h2>
          <p>{establishment.description}</p>
          <div className="space-y-2 text-sm text-text/70">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {establishment.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {establishment.email}
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-white/10 p-6 text-sm text-text/70">
          <h2 className="text-lg font-semibold text-text">Horaires</h2>
          <div className="mt-4 space-y-3">
            {orderedOpeningHours.map((day) => (
              <div key={day.day} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-text">{dayLabels[day.day]}</span>
                {day.slots.length ? (
                  <span className="flex items-center gap-2 text-text/70">
                    <Clock className="h-4 w-4 text-danger" />
                    {day.slots
                      .map((slot) => `${slot.open} → ${slot.close}`)
                      .join(' & ')}
                  </span>
                ) : (
                  <span className="text-text/40">Fermé</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
