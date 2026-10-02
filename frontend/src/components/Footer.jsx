import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-navy-800/10 bg-navy-950 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl text-white">
            Stay<span className="text-gold-500">Ease</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Thoughtfully designed stays with seamless booking — your comfort,
            from reservation to checkout.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-gold-500 uppercase">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/rooms" className="transition hover:text-white">
                Browse rooms
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition hover:text-white">
                Guest login
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition hover:text-white">
                Create account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-gold-500 uppercase">
            Information
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            StayEase is a demo hotel booking platform for portfolio and learning
            purposes. Staff accounts are created in the database — there is no
            public staff registration.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} StayEase. All rights reserved.
      </div>
    </footer>
  );
}
