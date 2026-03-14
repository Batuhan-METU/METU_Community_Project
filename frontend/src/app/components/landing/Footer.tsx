import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Brand section */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold tracking-tight text-white">
                METU
              </span>
              <span className="text-lg font-semibold text-gray-900">
                METUCom
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              A modern platform for METU students to discover events,
              communities, and campus opportunities.
            </p>
            <div className="mt-6 flex gap-3 text-gray-500">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xs transition duration-200 hover:bg-gray-200"
                aria-label="Visit METUCom on Twitter"
              >
                X
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xs transition duration-200 hover:bg-gray-200"
                aria-label="Visit METUCom on Instagram"
              >
                IG
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xs transition duration-200 hover:bg-gray-200"
                aria-label="Visit METUCom on LinkedIn"
              >
                in
              </button>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-10 text-sm text-gray-600 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/events"
                    className="transition duration-200 hover:text-black"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clubs"
                    className="transition duration-200 hover:text-black"
                  >
                    Communities
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="transition duration-200 hover:text-black"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {/* Add resource links here when available */}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="transition duration-200 hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 md:flex-row">
            <p>© 2026 METUCom. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="transition duration-200 hover:text-black"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

