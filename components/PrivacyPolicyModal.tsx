"use client";

import Button from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PrivacyPolicyModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        className="relative w-full max-w-lg max-h-[85vh] m3-shape-xl bg-surface text-on-surface m3-elevation-3 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 pt-6 pb-3">
          <h2 className="m3-title-large text-on-surface">Privacy Policy</h2>
        </div>

        <div className="overflow-y-auto px-6 pb-4 space-y-4 m3-body-medium text-on-surface-variant">
          <p>
            <strong className="text-on-surface">Last updated:</strong>{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            1. Information We Collect
          </h3>
          <p>
            When you register for Clocker-io, we collect your name, email
            address, and a secure password hash. If you sign in with Google, we
            receive your name and email from your Google account.
          </p>
          <p>
            As you use the service, we record clock-in and clock-out timestamps
            along with any manual time entries you create. This data is stored
            securely and associated with your account.
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            2. How We Use Your Information
          </h3>
          <p>We use the collected data to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Authenticate your identity and authorize access</li>
            <li>Display your time records, statistics, and reports</li>
            <li>Generate Daily Time Record (DTR) documents</li>
            <li>Improve and maintain the application</li>
          </ul>

          <h3 className="m3-title-small text-on-surface mt-4">
            3. Data Storage and Security
          </h3>
          <p>
            Your data is stored in a secure MongoDB database hosted on
            accredited cloud infrastructure. Passwords are hashed using
            industry-standard bcrypt. We use HTTP-only cookies for session
            management and employ HTTPS encryption for all data in transit.
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            4. Third-Party Services
          </h3>
          <p>Clocker-io uses the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Google Identity Services</strong> — for optional Google
              Sign-In
            </li>
            <li>
              <strong>MongoDB Atlas</strong> — for database hosting
            </li>
          </ul>
          <p>
            These services have their own privacy policies governing how they
            handle your data.
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            5. Cookies
          </h3>
          <p>
            We use essential cookies for authentication (access tokens and
            refresh tokens stored as HTTP-only cookies). These cookies are
            strictly necessary for the application to function. No tracking or
            analytics cookies are used.
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            6. Your Rights
          </h3>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct any inaccurate information</li>
            <li>
              Request deletion of your account and associated data
            </li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise these rights, please contact the developer using the
            details provided on the landing page.
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            7. Changes to This Policy
          </h3>
          <p>
            We may update this privacy policy periodically. Any changes will be
            reflected on this page with an updated date.
          </p>

          <h3 className="m3-title-small text-on-surface mt-4">
            8. Contact
          </h3>
          <p>
            If you have questions about this privacy policy, please reach out to
            the developer at{" "}
            <a
              href="mailto:baldove.reniel905@gmail.com"
              className="text-primary underline"
            >
              baldove.reniel905@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="shrink-0 px-6 pb-6 pt-2 flex justify-end">
          <Button variant="filled" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
