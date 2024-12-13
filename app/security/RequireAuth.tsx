import { useAuth } from "./AuthProvider";
import { Redirect } from "expo-router";

type Props = {
  children: JSX.Element;
  roles?: string[];
};

export default function RequireAuth({ children, roles }: Props) {
  const auth = useAuth();

  if (roles && !auth.isLoggedInAs(roles)) {
    return <Redirect href="../(auth)/login" />;
  }

  if (!auth.username) {
    return <Redirect href="../(auth)/login" />;
  }

  return children;
}