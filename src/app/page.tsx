import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "./globals.css";

export default async function HomePage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");

  if (jwt) {
    redirect("/appointments");
  }

  redirect("/login");
}
