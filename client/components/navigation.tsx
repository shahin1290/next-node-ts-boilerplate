import Link from "next/link";
import { useRouter } from "next/router";

export function Navigation() {
  const router = useRouter();

  return (
    <div className="fixed top-0 w-full">
      <div className="flex justify-center p-4 space-x-4 text-sm text-gray-500">
        <Link href="/">
          <a className={router.pathname == "/" ? "text-gray-900" : ""}>Home</a>
        </Link>
        <Link href="/me-csr">
          <a className={router.pathname == "/me-csr" ? "text-gray-900" : ""}>
            CSR
          </a>
        </Link>
        <Link href="/me-ssr">
          <a className={router.pathname == "/me-ssr" ? "text-gray-900" : ""}>
            SSR
          </a>
        </Link>
        
      </div>
    </div>
  );
}
