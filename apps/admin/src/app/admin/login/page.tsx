import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="page-shell login-page">
      <div>
        <p className="eyebrow">Forge & Form administration</p>
        <h1>Sign in.</h1>
        <p>Use your administrator account. There is no public registration.</p>
      </div>
      <LoginForm />
    </section>
  );
}
