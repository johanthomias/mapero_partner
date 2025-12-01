"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  establishmentName: z.string().min(2, "Nom de l’établissement requis"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const { login, register: registerPartner, isLoading, error, resetError } = useAuthStore(
    (state) => ({
      login: state.login,
      register: state.register,
      isLoading: state.isLoading,
      error: state.error,
      resetError: state.resetError,
    })
  );

  const schema = mode === "login" ? loginSchema : registerSchema;

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "login"
        ? { email: "partner@mapero.fr", password: "secret123" }
        : {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            establishmentName: "",
            acceptTerms: true,
          },
  });

  const errors = form.formState.errors;

  const registerErrors = errors as FieldErrors<RegisterValues>;

  const handleSubmit = form.handleSubmit(async (values) => {
    resetError();
    if (mode === "login") {
      await login(values as LoginValues);
    } else {
      await registerPartner(values as RegisterValues);
    }
    onSuccess?.();
    router.push("/partner/dashboard");
  });

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {mode === "register" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Prénom"
            error={mode === "register" ? registerErrors.firstName?.message : undefined}
          >
            <Input placeholder="Julie" {...form.register("firstName")} />
          </Field>

          <Field
            label="Nom"
            error={mode === "register" ? registerErrors.lastName?.message : undefined}
          >
            <Input placeholder="Morel" {...form.register("lastName")} />
          </Field>
        </div>
      ) : null}

      <Field label="Email professionnel" error={errors.email?.message}>
        <Input type="email" placeholder="contact@monbar.fr" {...form.register("email")} />
      </Field>

      <Field label="Mot de passe" error={errors.password?.message}>
        <Input type="password" placeholder="••••••••" {...form.register("password")} />
      </Field>

      {mode === "register" ? (
        <>
          <Field
            label="Nom de l’établissement"
            error={mode === "register" ? registerErrors.establishmentName?.message : undefined}
          >
            <Input
              placeholder="Le Comptoir du Canal"
              {...form.register("establishmentName")}
            />
          </Field>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card p-4 text-sm text-text/70">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-primary"
              {...form.register("acceptTerms")}
            />
            <span>
              J’accepte les conditions générales et j’autorise Mapéro à me contacter au sujet de mon établissement.
            </span>
          </label>

          {mode === "register" ? (
            registerErrors.acceptTerms ? (
              <p className="text-xs text-danger">
                {registerErrors.acceptTerms.message}
              </p>
            ) : null
          ) : null}
        </>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" size="lg" disabled={isLoading}>
        {mode === "login" ? "Se connecter" : "Créer mon espace"}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-text/60">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
