import RevolutCheckout from "@revolut/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import LanguageMenu from "@/components/LanguageMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, CheckCircle2, MapPin, Package, WalletCards } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const initialForm = { customerName: "", customerEmail: "", pickupAddress: "", dropoffAddress: "", itemDescription: "", amount: "25" };

type CheckoutInstance = { destroy: () => void };

export default function OrderCheckout() {
  const { language } = useLanguage();
  const isGreek = language === "el";
  const [form, setForm] = useState(initialForm);
  const [paid, setPaid] = useState(false);
  const checkoutTarget = useRef<HTMLDivElement>(null);
  const checkoutInstance = useRef<CheckoutInstance | null>(null);
  const config = trpc.orders.checkoutConfig.useQuery();
  const createOrder = trpc.orders.createCheckoutOrder.useMutation();

  const update = (field: keyof typeof initialForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(current => ({ ...current, [field]: event.target.value }));
  const formReady = Boolean(form.customerName && form.customerEmail && form.pickupAddress && form.dropoffAddress && form.itemDescription && Number(form.amount) >= 1);

  useEffect(() => {
    let cancelled = false;
    const mount = async () => {
      if (!config.data?.publicKey || !checkoutTarget.current || !formReady) return;
      checkoutInstance.current?.destroy();
      checkoutTarget.current.innerHTML = "";
      try {
        const instance = await RevolutCheckout.embeddedCheckout({
          publicToken: config.data.publicKey,
          mode: config.data.mode,
          locale: "auto",
          target: checkoutTarget.current,
          email: form.customerEmail,
          createOrder: async () => {
            const result = await createOrder.mutateAsync({
              customerName: form.customerName,
              customerEmail: form.customerEmail,
              pickupAddress: form.pickupAddress,
              dropoffAddress: form.dropoffAddress,
              itemDescription: form.itemDescription,
              amountCents: Math.round(Number(form.amount) * 100),
            });
            return { publicId: result.token };
          },
          onSuccess: () => {
            if (!cancelled) setPaid(true);
          },
          onError: ({ error }) => toast.error(error.message || (isGreek ? "Η πληρωμή δεν ολοκληρώθηκε." : "Payment could not be completed.")),
          onCancel: () => toast.message(isGreek ? "Η πληρωμή ακυρώθηκε. Μπορείς να δοκιμάσεις ξανά." : "Payment cancelled. Your order is still available to retry."),
        });
        if (!cancelled) checkoutInstance.current = instance;
        else instance.destroy();
      } catch (error) {
        if (!cancelled) toast.error(error instanceof Error ? error.message : (isGreek ? "Η πληρωμή δεν φόρτωσε." : "Checkout could not be loaded."));
      }
    };
    void mount();
    return () => {
      cancelled = true;
      checkoutInstance.current?.destroy();
      checkoutInstance.current = null;
    };
  }, [config.data?.publicKey, config.data?.mode, formReady, form.customerEmail, form.customerName, form.pickupAddress, form.dropoffAddress, form.itemDescription, form.amount]);

  return (
    <main className="min-h-screen bg-[#0c0d0d] text-[#f6f4eb] px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between"><a href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-white/60 hover:text-[#d8ff29]"><ArrowLeft size={16} /> {isGreek ? "Πίσω στο FASTMOVMENT" : "Back to FASTMOVMENT"}</a><LanguageMenu /></div>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-[#ff7040]">{isGreek ? "ΖΗΤΑ ΟΔΗΓΟ / 01" : "REQUEST A DRIVER / 01"}</p>
            <h1 className="mt-3 text-5xl font-black leading-[.92] tracking-tight md:text-7xl">{isGreek ? "ΜΕΤΑΚΙΝΗΣΕ ΤΟ." : "Move it."}<br /><span className="text-[#d8ff29]">{isGreek ? "ΠΛΗΡΩΣΕ ΜΙΑ ΦΟΡΑ." : "Pay once."}</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{isGreek ? "Πες μας τι πρέπει να μετακινηθεί και πού πηγαίνει. Το αίτημά σου δημιουργείται πρώτα και μετά η Revolut εμφανίζει με ασφάλεια τους διαθέσιμους τρόπους πληρωμής του FASTMOVMENT." : "Tell us what needs to move and where it is going. Your request will be created first, then Revolut will securely present the available payment methods configured for FASTMOVMENT."}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="border border-white/10 bg-white/[.03] p-4"><MapPin className="mb-3 text-[#d8ff29]" size={19} /><p className="text-sm font-bold">{isGreek ? "Πρώτα η διαδρομή" : "Route first"}</p><p className="mt-1 text-xs text-white/45">{isGreek ? "Παραλαβή και παράδοση σε μία εικόνα." : "Pickup and drop-off in one view."}</p></div><div className="border border-white/10 bg-white/[.03] p-4"><Package className="mb-3 text-[#ff7040]" size={19} /><p className="text-sm font-bold">{isGreek ? "Περιέγραψέ το" : "Describe it"}</p><p className="mt-1 text-xs text-white/45">{isGreek ? "Δώσε στον οδηγό τις χρήσιμες λεπτομέρειες." : "Give the driver the useful details."}</p></div><div className="border border-white/10 bg-white/[.03] p-4"><WalletCards className="mb-3 text-[#d8ff29]" size={19} /><p className="text-sm font-bold">{isGreek ? "Πλήρωσε με ασφάλεια" : "Pay securely"}</p><p className="mt-1 text-xs text-white/45">{isGreek ? "Κάρτα και διαθέσιμα wallets." : "Card and enabled wallets."}</p></div></div>
          </section>

          <section className="border border-white/10 bg-[#151716] p-6 md:p-8">
            {paid ? <div className="grid min-h-[520px] place-items-center text-center"><div><CheckCircle2 className="mx-auto mb-5 text-[#d8ff29]" size={54} /><p className="text-xs uppercase tracking-[.3em] text-[#d8ff29]">{isGreek ? "Η ΠΛΗΡΩΜΗ ΕΛΗΦΘΗ" : "PAYMENT RECEIVED"}</p><h2 className="mt-3 text-3xl font-black">{isGreek ? "Το αίτημά σου ξεκινά." : "Your request is moving."}</h2><p className="mt-4 text-white/55">{isGreek ? "Η πληρωμή ολοκληρώθηκε. Το FASTMOVMENT μπορεί τώρα να ξεκινήσει το matching οδηγού." : "The payment was completed. FASTMOVMENT can now continue with driver matching."}</p><a className="mt-7 inline-flex bg-[#ff7040] px-5 py-3 font-bold uppercase tracking-wider text-black" href="/">{isGreek ? "Επιστροφή στο portal" : "Return to portal"}</a></div></div> : <>
              <div className="mb-7"><p className="text-xs uppercase tracking-[.24em] text-[#d8ff29]">{isGreek ? "ΣΤΟΙΧΕΙΑ ΠΑΡΑΔΟΣΗΣ" : "DELIVERY DETAILS"}</p><h2 className="mt-2 text-2xl font-bold">{isGreek ? "Ξεκίνα ένα αίτημα" : "Start a request"}</h2></div>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="customerName">{isGreek ? "Ονοματεπώνυμο" : "Your name"}</Label><Input id="customerName" value={form.customerName} onChange={update("customerName")} placeholder="Maria Papadopoulou" className="border-white/15 bg-black/30 text-white" /></div><div className="space-y-2"><Label htmlFor="customerEmail">Email</Label><Input id="customerEmail" type="email" value={form.customerEmail} onChange={update("customerEmail")} placeholder="maria@example.com" className="border-white/15 bg-black/30 text-white" /></div></div>
                <div className="space-y-2"><Label htmlFor="pickupAddress">{isGreek ? "Διεύθυνση παραλαβής" : "Pickup address"}</Label><Input id="pickupAddress" value={form.pickupAddress} onChange={update("pickupAddress")} placeholder={isGreek ? "Πού θα γίνει η παραλαβή;" : "Where should the driver collect it?"} className="border-white/15 bg-black/30 text-white" /></div>
                <div className="space-y-2"><Label htmlFor="dropoffAddress">{isGreek ? "Διεύθυνση παράδοσης" : "Drop-off address"}</Label><Input id="dropoffAddress" value={form.dropoffAddress} onChange={update("dropoffAddress")} placeholder={isGreek ? "Πού πρέπει να παραδοθεί;" : "Where should it go?"} className="border-white/15 bg-black/30 text-white" /></div>
                <div className="space-y-2"><Label htmlFor="itemDescription">{isGreek ? "Τι μετακινείται;" : "What is moving?"}</Label><textarea id="itemDescription" value={form.itemDescription} onChange={update("itemDescription")} placeholder={isGreek ? "Μικρό δέμα, έγγραφα, λουλούδια…" : "Small parcel, documents, flowers…"} className="min-h-24 w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-offset-background placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#d8ff29]" /></div>
                <div className="space-y-2"><Label htmlFor="amount">{isGreek ? "Ποσό παράδοσης (€)" : "Delivery amount (€)"}</Label><Input id="amount" type="number" min="1" step="0.01" value={form.amount} onChange={update("amount")} className="border-white/15 bg-black/30 text-white" /></div>
              </div>
              <div className="mt-7 border-t border-white/10 pt-7"><p className="mb-4 text-xs uppercase tracking-[.2em] text-white/45">{isGreek ? "ΠΛΗΡΩΜΗ" : "CHECKOUT"}</p>{!config.data?.configured ? <div className="border border-[#ff7040]/40 bg-[#ff7040]/10 p-4 text-sm text-[#ffb49a]">{isGreek ? "Η πληρωμή δεν έχει ρυθμιστεί ακόμη. Ο διαχειριστής πρέπει να προσθέσει τα κλειδιά Revolut στις" : "Checkout is not configured yet. An administrator must add the Revolut Merchant keys in"} <a className="underline" href="/admin/payments">{isGreek ? "Ρυθμίσεις πληρωμών" : "Payment Settings"}</a>.</div> : !formReady ? <p className="text-sm text-white/45">{isGreek ? "Συμπλήρωσε όλα τα στοιχεία για να φορτώσουν οι ασφαλείς τρόποι πληρωμής." : "Complete all delivery fields to load secure payment methods."}</p> : <div ref={checkoutTarget} className="min-h-24" />}</div>
            </>}
          </section>
        </div>
      </div>
    </main>
  );
}
