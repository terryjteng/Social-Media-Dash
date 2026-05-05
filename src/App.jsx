import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Dashboard from "./dashboard";

export default function App() {
  return (
    <>
      <SignedIn>
        <Dashboard />
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
