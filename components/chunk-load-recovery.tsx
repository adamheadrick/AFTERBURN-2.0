"use client";

import { useEffect } from "react";

function chunkFailureText(value: unknown) {
  if (!value) {
    return "";
  }

  if (value instanceof Error) {
    return `${value.name} ${value.message}`;
  }

  if (typeof value === "string") {
    return value;
  }

  return String(value);
}

function isChunkLoadFailure(value: unknown) {
  const message = chunkFailureText(value).toLowerCase();

  return (
    message.includes("chunkloaderror") ||
    message.includes("loading chunk") ||
    message.includes("failed to fetch dynamically imported module")
  );
}

export function ChunkLoadRecovery() {
  useEffect(() => {
    const retryKey = `afterburn:chunk-recovery:${window.location.pathname}`;

    function recover(value: unknown) {
      if (!isChunkLoadFailure(value) || sessionStorage.getItem(retryKey)) {
        return;
      }

      sessionStorage.setItem(retryKey, "1");
      window.location.reload();
    }

    function handleError(event: ErrorEvent) {
      recover(event.error ?? event.message);
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      recover(event.reason);
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const clearRetry = window.setTimeout(() => {
      sessionStorage.removeItem(retryKey);
    }, 8000);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.clearTimeout(clearRetry);
    };
  }, []);

  return null;
}
