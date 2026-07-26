"use client";

import { useActionState } from "react";
import { Alert, Button, Input, Label, Surface, TextField } from "@heroui/react";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <CursorSpotlight />

      <div className="fixed top-3 right-3 z-50 sm:top-4 sm:right-4">
        <ThemeSwitcher />
      </div>

      <Surface
        className="w-full max-w-sm border border-border bg-surface p-5 shadow-[4px_4px_0_0_var(--foreground)] sm:p-6 sm:shadow-[6px_6px_0_0_var(--foreground)] md:p-8 lg:p-10"
        style={{ animation: "card-in 0.4s ease-out" }}
        variant="transparent"
      >
        <p className="label-mono mb-3 text-muted">N°01 · ACCESO DEL EQUIPO</p>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          flujoo
        </h1>

        <form action={formAction} className="flex flex-col gap-4">
          {state.error ? (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{state.error}</Alert.Title>
              </Alert.Content>
            </Alert>
          ) : null}

          <TextField isRequired autoFocus name="password" type="password" variant="secondary">
            <Label>Contraseña</Label>
            <Input className="min-h-11" placeholder="••••••••" />
          </TextField>

          <Button className="min-h-11 w-full" isPending={isPending} type="submit">
            Entrar
          </Button>
        </form>
      </Surface>
    </div>
  );
}
