import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({ email, password, name: name || "Admin" });
        if (err) throw new Error(err.message || "تعذر إنشاء الحساب");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || "بيانات غير صحيحة");
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "حصل خطأ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-bg px-4">
      <div className="w-full max-w-sm space-y-6 rounded-[var(--radius-xl)] bg-bg-elevated p-7 ring-1 ring-border">
        <Link to="/" className="flex justify-center">
          <Logo />
        </Link>
        <h1 className="text-center font-display text-3xl">لوحة التحكم</h1>
        <p className="text-center text-sm text-muted">دخلي عشان تعدّلي الأسعار والصور والبانر.</p>
        {authEnabled ? (
          <>
            <div className="space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/admin" })}
                >
                  دخول عبر {p.label}
                </Button>
              ))}
            </div>
            <div className="hairline" />
            <form className="space-y-3" onSubmit={onEmail}>
              {mode === "up" ? (
                <div>
                  <Label>الاسم</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              ) : null}
              <div>
                <Label>الإيميل</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>كلمة السر</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button className="w-full" disabled={busy}>
                {mode === "in" ? "دخول" : "إنشاء حساب"}
              </Button>
            </form>
            <button
              type="button"
              className="w-full text-center text-sm text-muted"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
            >
              {mode === "in" ? "أول مرة؟ أنشئ حساب الأدمن" : "عندك حساب؟ دخولي"}
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">تسجيل الدخول مقفول حالياً.</p>
        )}
      </div>
    </main>
  );
}
