import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminPaymentSettings() {
  const { user, loading } = useAuth();
  const summary = trpc.paymentSettings.summary.useQuery(undefined, { enabled: Boolean(user?.role === "admin"), retry: false });
  const save = trpc.paymentSettings.save.useMutation({
    onSuccess: () => {
      toast.success("Revolut payment settings saved securely.");
      setSecretKey("");
      setPublicKey("");
      setWebhookSecret("");
      summary.refetch();
    },
    onError: error => toast.error(error.message || "Could not save payment settings."),
  });
  const [secretKey, setSecretKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  if (loading) return <div className="min-h-screen bg-[#0c0d0d] text-white grid place-items-center">Loading secure settings…</div>;
  if (!user) return <div className="min-h-screen bg-[#0c0d0d] text-white grid place-items-center p-6">Please sign in to access payment settings.</div>;
  if (user.role !== "admin") return <div className="min-h-screen bg-[#0c0d0d] text-white grid place-items-center p-6">Administrator access is required for payment settings.</div>;

  const configured = summary.data?.configured;

  return (
    <main className="min-h-screen bg-[#0c0d0d] text-[#f6f4eb] px-5 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-start justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d8ff29]"><WalletCards size={15} /> FASTMOVMENT / ADMIN</div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Payment control.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">Connect Revolut Merchant once, then let the portal handle card payments, Revolut Pay, and eligible Google Pay checkout flows.</p>
          </div>
          <a className="border border-[#ff7040] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#ff7040] transition hover:bg-[#ff7040] hover:text-black" href="/">Back to portal</a>
        </div>

        <section className="grid gap-5 md:grid-cols-3 mb-8">
          <div className="border border-white/10 bg-white/[0.03] p-5"><ShieldCheck className="mb-4 text-[#d8ff29]" /><p className="text-sm font-bold uppercase tracking-wider">Encrypted at rest</p><p className="mt-2 text-sm text-white/50">Credentials are encrypted server-side before database storage.</p></div>
          <div className="border border-white/10 bg-white/[0.03] p-5"><LockKeyhole className="mb-4 text-[#ff7040]" /><p className="text-sm font-bold uppercase tracking-wider">Admin only</p><p className="mt-2 text-sm text-white/50">Only the authenticated project administrator can open this page.</p></div>
          <div className="border border-white/10 bg-white/[0.03] p-5"><WalletCards className="mb-4 text-[#d8ff29]" /><p className="text-sm font-bold uppercase tracking-wider">Current status</p><p className="mt-2 text-sm text-white/50">{configured ? "Revolut credentials are configured." : "Revolut credentials are not configured yet."}</p></div>
        </section>

        <section className="border border-white/10 bg-[#151716] p-6 md:p-8">
          <div className="mb-8"><p className="text-xs uppercase tracking-[0.25em] text-[#ff7040]">REVOLUT MERCHANT</p><h2 className="mt-2 text-2xl font-bold">Add or replace credentials</h2><p className="mt-2 text-sm leading-6 text-white/50">Paste the three values from Revolut Business. Existing values are never returned to the browser; leave the page and fields blank if you do not want to change them.</p></div>
          <form className="space-y-6" onSubmit={event => { event.preventDefault(); save.mutate({ secretKey, publicKey, webhookSecret }); }}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="secretKey" className="text-white/80">Merchant secret API key</Label><Input id="secretKey" type="password" value={secretKey} onChange={event => setSecretKey(event.target.value)} placeholder={summary.data?.secretKey ?? "Paste secret key"} autoComplete="new-password" className="border-white/15 bg-black/30 text-white" /></div>
              <div className="space-y-2"><Label htmlFor="publicKey" className="text-white/80">Merchant public API key</Label><Input id="publicKey" type="password" value={publicKey} onChange={event => setPublicKey(event.target.value)} placeholder={summary.data?.publicKey ?? "Paste public key"} autoComplete="new-password" className="border-white/15 bg-black/30 text-white" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="webhookSecret" className="text-white/80">Webhook signing secret</Label><Input id="webhookSecret" type="password" value={webhookSecret} onChange={event => setWebhookSecret(event.target.value)} placeholder={summary.data?.webhookSecret ?? "Paste webhook secret"} autoComplete="new-password" className="border-white/15 bg-black/30 text-white" /></div>
            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between"><p className="max-w-xl text-xs leading-5 text-white/40">The values are sent only to the authenticated backend over HTTPS and are never printed in logs or rendered after saving.</p><Button type="submit" disabled={save.isPending || !secretKey || !publicKey || !webhookSecret} className="bg-[#d8ff29] px-6 font-black uppercase tracking-wider text-black hover:bg-[#ecff7a]">{save.isPending ? "Saving…" : "Save securely"}</Button></div>
          </form>
        </section>
      </div>
    </main>
  );
}
