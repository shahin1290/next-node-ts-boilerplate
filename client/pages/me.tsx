import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FC } from "react";
import { useUser } from "../contexts/user-context";
import { environment } from "../lib/environment";
import { fetcher } from "../lib/fetcher-ssr";

const MeSSR: FC = () => {
  const { user } = useUser();

  return (
    <main className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Server side authentication
        </h1>
        <p>Hi, {user!.name} 👋</p>
        {/* <Logout /> */}
      </div>
    </main>
  );
};

export default MeSSR;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const [error, user] = await fetcher(
    { headers: ctx.req.headers },
    ctx.res,
    `${environment.apiUrl}/api/me`
  );

  if (!user)
    return { redirect: { statusCode: 307, destination: "/auth/login" } };
  return { props: { user } };
};
