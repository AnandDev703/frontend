import React, { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

const VERIFY_URL =
  "https://backend-contract-risk-clause-detect.vercel.app/auth/verify";

export const CallbackPage: React.FC = () => {
  const [status, setStatus] = useState<
    "processing" | "success" | "error"
  >("processing");

  const [message, setMessage] = useState(
    "Verifying authorization code with security server...",
  );

  const hasExecutedRef = useRef(false);

  const handleVerify = async () => {
    setStatus("processing");
    setMessage("Verifying authorization code with security server...");

    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get("code");

    const errorParam =
      urlParams.get("error") ||
      urlParams.get("error_description");

    /*
     * Google/backend returned an error
     */
    if (errorParam) {
      setStatus("error");
      setMessage(decodeURIComponent(errorParam));
      return;
    }

    /*
     * No temporary OAuth code
     */
    if (!code) {
      setStatus("error");
      setMessage("No authorization code found in callback URL.");
      return;
    }

    try {
      /*
       * Exchange temporary OAuth code for an
       * HTTP-only authentication cookie.
       */
      const response = await fetch(VERIFY_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        /*
         * IMPORTANT:
         * Allows the browser to accept the Set-Cookie
         * header returned by the backend.
         */
        credentials: "include",

        body: JSON.stringify({
          code,
        }),
      });

      const data = await response.json().catch(() => null);

      /*
       * Backend rejected the code
       */
      if (!response.ok) {
        setStatus("error");

        setMessage(
          data?.message ||
            data?.error ||
            `Verification failed with status ${response.status}.`,
        );

        return;
      }

      /*
       * Remove ?code=... from the browser URL.
       *
       * The code is temporary and should not remain
       * visible in the address bar.
       */
      window.history.replaceState(
        {},
        document.title,
        "/callback",
      );

      /*
       * Authentication successful.
       *
       * The backend has already set the HTTP-only cookie.
       */
      setStatus("success");

      setMessage(
        "Authentication successful! Secure session established. Redirecting to workspace...",
      );

      /*
       * Give the user a moment to see the success state.
       */
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      console.error(
        "[CallbackPage] Verification error:",
        error,
      );

      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Network error occurred while connecting to authentication server.",
      );
    }
  };

  /*
   * Prevent React StrictMode from executing
   * the OAuth verification twice during development.
   */
  useEffect(() => {
    if (hasExecutedRef.current) {
      return;
    }

    hasExecutedRef.current = true;

    handleVerify();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070b14] text-white p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-600/25 to-transparent blur-[140px] pointer-events-none -top-20 -left-20 animate-pulse" />

      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-600/25 to-transparent blur-[140px] pointer-events-none -bottom-20 -right-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-[#0d1322]/85 backdrop-blur-3xl border border-white/10 shadow-2xl text-center space-y-6 animate-scale-in">
        {/* Top highlight */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group mb-3">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 opacity-50 blur-md animate-pulse" />

            <img
              src="/logo.png"
              alt="ClauseX"
              className="relative w-16 h-16 object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] animate-float"
            />
          </div>

          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 justify-center">
            <span>Clause</span>

            <span className="text-purple-400">
              X
            </span>

            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono font-bold">
              SSO
            </span>
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            OAuth & Token Verification Service
          </p>
        </div>

        {/* Verification status */}
        <div className="py-5 px-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-3">
          {/* Processing */}
          {status === "processing" && (
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-3 border-purple-500/20 border-t-purple-500 animate-spin" />

              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles
                  size={20}
                  className="text-purple-400 animate-pulse"
                />
              </div>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-scale-in shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center animate-scale-in shadow-lg shadow-rose-500/20">
              <AlertCircle size={32} />
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-100">
              {status === "processing" &&
                "Verifying Session & Setting Cookies..."}

              {status === "success" &&
                "Authentication Verified!"}

              {status === "error" &&
                "Authentication Error"}
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Security information */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck
            size={14}
            className="text-purple-400"
          />

          <span>
            Encrypted Handshake with
            backend-contract-risk-clause-detect
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          {status === "error" && (
            <button
              onClick={handleVerify}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
            >
              <RefreshCw size={14} />

              <span>
                Retry Verification
              </span>
            </button>
          )}

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              Return to Workspace
            </span>

            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;