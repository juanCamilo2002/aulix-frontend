"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Aulix</h1>
          <p className="text-gray-500 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoggingIn}
            >
              Iniciar sesión
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
