"use server";

import { redirect } from "next/navigation";
// import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";

export async function signUpWithGithub() {
	const { account } = await createAdminClient();

  // const origin = headers().get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${process.env.NEXT_PUBLIC_APP_URL}/oauth`,
		`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
	);

	return redirect(redirectUrl);
};

export async function signUpWithGoogle() {
  const { account } = await createAdminClient();

  // const origin = headers().get("origin");

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${process.env.NEXT_PUBLIC_APP_URL}/oauth`,
    `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`
  );

  return redirect(redirectUrl);
}
