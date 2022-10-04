// import { GitHubSignIn } from "../components/github-sign-in";

import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex items-center justify-center h-full gap-2">
      <Link href="/auth/login">
        <a className={router.pathname == "/auth/login" ? "text-gray-900" : ""}>
          Login
        </a>
      </Link>
      <Link href="/auth/register">
        <a
          className={router.pathname == "/auth/register" ? "text-gray-900" : ""}
        >
          Register
        </a>
      </Link>
    </main>
  );
}
