"use client";

import { Sparkles, Users, Eye, TicketCheck } from 'lucide-react';
import { usePartnerMetrics } from '@/hooks/use-partner-metrics';
import { usePartnerOffers } from '@/hooks/use-partner-offers';
import { DashboardLayout } from '@/components/ui/dashboard/DashboardLayout';
import { DashboardCard } from '@/components/ui/dashboard/DashboardCard';
import { DashboardChart } from '@/components/ui/dashboard/DashboardChart';
import { DashboardTable } from '@/components/ui/dashboard/DashboardTable';

export default function PartnerDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = usePartnerMetrics();
  const {
    data: offers = [],
    isLoading: offersLoading,
  } = usePartnerOffers();

  const cards = [
    {
      title: 'Total visiteurs',
      value: metrics?.totalVisitors?.toLocaleString('fr-FR') ?? '—',
      icon: Users,
      subtitle: '7 derniers jours',
      trend: { label: '+8.5% vs hier', variant: 'positive' as const },
      accent: 'primary' as const,
    },
    {
      title: 'Offres vues',
      value: metrics?.offersViewed?.toLocaleString('fr-FR') ?? '—',
      icon: Eye,
      subtitle: 'Abonnés Mapéro',
      trend: { label: '+12% vs semaine dernière', variant: 'positive' as const },
      accent: 'warning' as const,
    },
    {
      title: 'Offres utilisées',
      value: metrics?.offersRedeemed?.toLocaleString('fr-FR') ?? '—',
      icon: TicketCheck,
      subtitle: 'Conversions récentes',
      trend: { label: '+5% cette semaine', variant: 'positive' as const },
      accent: 'success' as const,
    },
    {
      title: 'Offres actives',
      value: metrics?.activeOffers?.toString() ?? '—',
      icon: Sparkles,
      subtitle: 'Prêtes à être diffusées',
      trend: { label: `${offers.length} au total`, variant: 'neutral' as const },
      accent: 'danger' as const,
    },
  ];

  const trendPoints = metrics?.visitorsTrend ?? [];

  return (
    <DashboardLayout
      title="Tableau de bord"
      subtitle="Suivez l’impact de vos offres et ajustez vos créneaux creux en toute simplicité."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} isLoading={metricsLoading} />
        ))}
      </div>

      <DashboardChart
        title="Flux de visites"
        subtitle="Vue consolidée sur 7 jours"
        data={trendPoints}
      />

      <DashboardTable offers={offers} isLoading={offersLoading} />
    </DashboardLayout>
  );
}
