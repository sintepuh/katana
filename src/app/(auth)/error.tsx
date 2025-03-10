"use client";

import PageError from "@/components/page-error";

const AuthErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <PageError message={error.message} reset={reset} />;
};

export default AuthErrorPage;
