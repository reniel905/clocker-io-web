"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const { googleLogin } = useAuth();
  const router = useRouter();

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        await googleLogin(response.credential);
        router.push("/dashboard");
      } catch (err) {
        console.error("Google login failed", err);
      }
    },
    [googleLogin, router],
  );

  useEffect(() => {
    if (initialized.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google || initialized.current) return;
      initialized.current = true;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      });
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          type: "standard",
          shape: "rectangular",
          text: "signin_with",
          logo_alignment: "left",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      initialized.current = false;
    };
  }, [handleCredentialResponse]);

  return <div ref={buttonRef} className="w-full flex justify-center [&>div]:!w-full" />;
}
