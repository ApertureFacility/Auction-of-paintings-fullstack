import ResetPasswordClient from "./ResetPasswordClient";


export default function ResetPasswordPage({ searchParams }: any) {
  const token =
    typeof searchParams?.token === "string" ? searchParams.token : undefined;

  return <ResetPasswordClient token={token} />;
}
