"use server";
export const runtime = 'nodejs';

import { createSessionClient } from "@/lib/appwrite";

export const getCurrentUser = async () => {
  try {
    const { account } = await createSessionClient();
    return (await account.get()) ?? null;
  } catch {
    return null;
  }
};
