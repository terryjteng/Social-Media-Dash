import { SignedIn, SignedOut, SignIn, useUser, useClerk } from "@clerk/clerk-react";
import Dashboard from "./dashboard";

function RoleGate({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#12102A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #8B7EC8', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const role = user?.publicMetadata?.role;

  if (!role) {
    return (
      <div style={{ minHeight: '100vh', background: '#12102A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', margin: '0 auto 1.5rem' }}>
            <img src="/kato8-logo-circle.png" alt="Kato.8" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ color: '#F0EEFF', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Access Pending</h1>
          <p style={{ color: '#7A75A0', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            Your account <strong style={{ color: '#9D98C0' }}>{user?.primaryEmailAddress?.emailAddress}</strong> hasn't been assigned a role yet.
          </p>
          <p style={{ color: '#4A4580', fontSize: '0.8rem', marginBottom: '2rem' }}>
            A Kato.8 admin will approve your access shortly.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <a
              href="https://kato8studiosapp.xyz"
              style={{ background: 'transparent', border: '1px solid #3A3660', color: '#7A75A0', padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', textDecoration: 'none' }}
            >
              ← Central Command
            </a>
            <button
              onClick={() => signOut()}
              style={{ background: 'transparent', border: '1px solid #3A3660', color: '#7A75A0', padding: '0.5rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <>
      <SignedIn>
        <RoleGate>
          <Dashboard />
        </RoleGate>
      </SignedIn>
      <SignedOut>
        <div
          className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
          style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}
        >
          <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap')`}</style>
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-4">
                <img src="/kato8-logo-circle.png" alt="Kato.8" className="w-full h-full object-cover"/>
              </div>
              <h1 className="text-xl font-bold text-slate-800">Kato.8 Social</h1>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to access your dashboard
              </p>
            </div>
            <SignIn routing="hash" appearance={{
              elements: {
                card: "shadow-sm border border-slate-100 rounded-2xl",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              }
            }} />
          </div>
        </div>
      </SignedOut>
    </>
  );
}
