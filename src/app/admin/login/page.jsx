import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex max-w-sm flex-col px-6 py-24">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--signal)]">
        Admin
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-[var(--slate)]">
        This area is for the site owner only.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
