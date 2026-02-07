import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-mist">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold italic text-brand-primary">
          Məlhəm Content Hub
        </h1>

        <div className="space-y-4">
          <Link
            to="/login/doctor"
            className="block px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold"
          >
            Həkim kimi daxil ol
          </Link>

          <Link
            to="/login/marketing"
            className="block px-8 py-4 bg-white border border-brand-primary text-brand-primary rounded-2xl font-bold"
          >
            Marketinq kimi daxil ol
          </Link>
        </div>
      </div>
    </div>
  );
}
