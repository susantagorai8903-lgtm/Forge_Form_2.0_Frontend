import { BookingForm } from "@/components/BookingForm";

export const metadata = {
  title: "Request a Consultation | Forge & Form",
};

export default function BookingPage() {
  return (
    <section className="booking-page">
      <div className="booking-intro">
        <p className="eyebrow">Start with a conversation</p>
        <h1>Your first step.</h1>
        <p>Tell us what you are looking for and request a time to connect. The studio will follow up to confirm the details.</p>
      </div>
      <BookingForm />
    </section>
  );
}
