import { FooterWithDisclaimer } from "@/components/footer-with-disclaimer";
import { Navigation } from "@/components/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-2 items-center">
        <Navigation />
        <div className="flex-1 w-full max-w-none p-2">
          {children}
        </div>
        <FooterWithDisclaimer />
      </div>
    </main>
  );
}
