import AbstractBackground from "@/components/AbstractBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import HowItWorks from "@/components/HowItWorks";
import WarrantyForm from "@/components/WarrantyForm";
import VoucherTerms from "@/components/VoucherTerms";
import WarrantyTerms from "@/components/WarrantyTerms";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <AbstractBackground />
      <Header />
      <main className="relative">
        <Hero />
        <TrustBadges />
        <HowItWorks />
        <WarrantyForm />
        <VoucherTerms />
        <WarrantyTerms />
      </main>
      <Footer />
    </>
  );
}
