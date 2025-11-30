"use client";

import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';

export default function PartnerLoginPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 rounded-[40px] border border-white/10 bg-card p-8 backdrop-blur-md md:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent p-6">
        <div className="flex items-center gap-3 text-primary-light">
          <ShieldCheck className="h-8 w-8" />
          <span className="text-xl font-semibold text-text">Espace Partenaire Mapéro</span>
        </div>
        <p className="text-base text-text/70">
          Centralisez vos offres, vos horaires creux et vos performances Mapéro dans un dashboard
          pensé pour les bars & restaurants.
        </p>
        <div className="rounded-3xl border border-white/10 bg-card p-5 text-sm text-text/70">
          <p className="text-xs uppercase tracking-widest text-text/50">Pourquoi Mapéro ?</p>
          <ul className="mt-3 space-y-2">
            <li>• Attirez des visiteurs qualifiés sur vos plages horaires creuses</li>
            <li>• Activez / désactivez vos offres en un geste</li>
            <li>• Visualisez vos performances chaque semaine</li>
          </ul>
        </div>
        <Link
          href="/partner/register"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text transition hover:text-primary"
        >
          Pas encore inscrit ? Créez votre espace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/50 p-6">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-text">Connexion partenaire</h1>
          <p className="text-sm text-text/60">
            Utilisez votre email professionnel partagé avec l’équipe Mapéro.
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
