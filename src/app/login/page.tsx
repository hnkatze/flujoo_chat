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
    <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
      <CursorSpotlight />

      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <Surface
        className="w-full max-w-sm border border-border bg-surface p-8 shadow-[6px_6px_0_0_var(--foreground)]"
        style={{ animation: "card-in 0.4s ease-out" }}
        variant="transparent"
      >
        <p className="label-mono mb-3 text-muted">N°01 · ACCESO DEL EQUIPO</p>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">flujoo</h1>

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
            <Input placeholder="••••••••" />
          </TextField>

          <Button className="w-full" isPending={isPending} type="submit">
            Entrar
          </Button>
        </form>
      </Surface>
    </div>
  );
}
