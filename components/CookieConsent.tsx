"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";

const LS_KEY = "clockerCookieConsent";

export default function CookieConsent() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem(LS_KEY);
    if (!consented) setBannerVisible(true);
  }, []);

  useEffect(() => {
    const handler = () => setPrivacyOpen(true);
    window.addEventListener("open-privacy-policy", handler);
    return () => window.removeEventListener("open-privacy-policy", handler);
  }, []);

  function accept() {
    localStorage.setItem(LS_KEY, "true");
    setBannerVisible(false);
  }

  return (
    <>
      {bannerVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-high border-t border-outline-variant/40 p-4 m3-elevation-3">
          <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="m3-body-small text-on-surface-variant max-w-2xl">
              This website uses essential cookies for authentication and to
              provide the service. No tracking or analytics cookies are used.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="text"
                onClick={() => setPrivacyOpen(true)}
                className="!px-3"
              >
                Learn More
              </Button>
              <Button variant="filled" onClick={accept} className="!px-5">
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      <PrivacyPolicyModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
    </>
  );
}
