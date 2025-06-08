import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-primary-700 py-12 text-white">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold">ASBhive - A Hub of Innovation & Entrepreneurship Activities</h3>
            <p className="text-sm text-primary-100">
              ASBhive serves as a connection in Malaysia's entrepreneurial ecosystem, fostering collaboration,
              innovation, and growth.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <address className="not-italic text-sm text-primary-100">
              <p>Asia School of Business</p>
              <p>Sasana Kijang, 2 Jalan Dato' Onn, 50480</p>
              <p>Kuala Lumpur</p>
              <p className="mt-2">
                <a href="mailto:contact@asbhive.my" className="hover:underline">
                  contact@asbhive.my
                </a>
              </p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Core Programs</h3>
            <ul className="space-y-2 text-sm text-primary-100">
              <li>
                <Link href="#" className="hover:underline">
                  Mentorship Program
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Incubator Program 2025
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Startup Accelerator
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-600 pt-8 text-center text-sm text-primary-200">
          <p>&copy; {new Date().getFullYear()} ASBhive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
