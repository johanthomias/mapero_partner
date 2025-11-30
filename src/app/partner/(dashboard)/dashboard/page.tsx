"use client";

import { usePartnerMetrics } from '@/hooks/use-partner-metrics';
import { Card } from '@/components/ui/card';
import { Sparkles, Users, Eye, TicketCheck, Activity } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';

export default function PartnerDashboardPage() {
  const { data: metrics, isLoading } = usePartnerMetrics();

  const cards = [
    {
      label: 'Visiteurs Mapéro',
      value: metrics?.totalVisitors ?? '—',
      icon: Users,
      helper: 'sur 7 jours',
      trend: 8,
    },
    {
      label: 'Offres actives',
      value: metrics?.activeOffers ?? '—',
      icon: Sparkles,
      helper: 'Prêtes ce soir',
    },
    {
      label: 'Offres vues',
      value: metrics?.offersViewed ?? '—',
      icon: Eye,
      helper: 'vs semaine dernière',
      trend: 12,
    },
    {
      label: 'Offres utilisées',
      value: metrics?.offersRedeemed ?? '—',
      icon: TicketCheck,
      helper: 'dans l’app',
      trend: 5,
    },
  ];
  const trendPoints = metrics?.visitorsTrend ?? [];
  const maxVisitors = trendPoints.reduce((acc, point) => Math.max(acc, point.value), 1);

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
        <p className="text-sm text-white/60">
          Suivez l’impact de vos offres Mapéro en temps réel.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <StatsCard key={card.label} {...card} value={isLoading ? '—' : card.value} />
        ))}
      </section>

      <Card className="rounded-3xl border-white/10 bg-black/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">Flux de visites</p>
            <h2 className="text-lg font-semibold text-white">Dernière semaine</h2>
          </div>
          <Activity className="h-5 w-5 text-accent" />
        </div>
        <div className="mt-6 flex items-end gap-3">
          {trendPoints.map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2 text-xs text-white/60">
              <div
                className="w-full rounded-t-2xl bg-gradient-to-b from-primary to-primary/10"
                style={{ height: `${Math.max((point.value / maxVisitors) * 160, 16)}px` }}
              />
              <span className="font-semibold">{point.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/60">
          Créez une offre ciblée sur le créneau le plus bas pour lisser le trafic et maximiser vos
          revenus apéritifs.
        </p>
      </Card>
    </div>
  );
}
