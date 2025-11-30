"use client";

import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';

export default function PartnerRegisterPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 rounded-[40px] border border-white/10 bg-card p-8 backdrop-blur-md md:grid-cols-2">
      <div className="rounded-3xl border border-dashed border-white/20 bg-card p-6">
        <Link
          href="/partner/login"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-text/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Déjà partenaire ? Connexion
        </Link>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-danger">
            <Sparkles className="h-7 w-7" />
            <span className="text-lg font-semibold text-text">Boostez vos apéros</span>
          </div>
          <p className="text-sm text-text/70">
            Rejoignez le programme Mapéro et bénéficiez d’un flux d’abonnés qualifiés sur les plages
            horaires de votre choix.
          </p>
          <div className="rounded-3xl bg-white/5 p-5 text-sm text-text/70">
            <p className="text-xs uppercase tracking-widest text-text/50">Ce qu’on met à votre dispo</p>
            <ul className="mt-3 space-y-2">
              <li>• Mise en avant ciblée dans l’app Mapéro</li>
              <li>• Dashboard visiteurs + offres utilisées</li>
              <li>• Support en 24h par l’équipe partenaire</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/50 p-6">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-text">Créer mon espace partenaire</h1>
          <p className="text-sm text-text/60">
            Quelques informations suffisent pour activer votre période de test.
          </p>
        </div>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
