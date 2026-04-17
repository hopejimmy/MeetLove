import { useLang } from "@/context/LanguageContext";
import OnboardingForm from "@/components/OnboardingForm";

export default function Home() {
  return (
    <main className="container">
      <OnboardingForm />
    </main>
  );
}
