import { useContext, useState, useEffect, createContext } from "react";
import { account, isAppwriteConfigured } from "../appwriteConfig";
import { ID } from "appwrite";
import Brand from "../components/Brand";
const AuthContext = createContext();
// The app intentionally uses plain JavaScript without a runtime prop-types dependency.
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(isAppwriteConfigured);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!isAppwriteConfigured) return;
    let active = true;
    account.get().then(details => { if (active) setUser(details); }).catch(() => {
      if (active) setUser(null);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const requireConfig = () => { if (!isAppwriteConfigured) throw new Error("Accounts are not configured on this deployment. You can still practice as a guest."); };
  const loginUser = async ({ email, password }) => {
    requireConfig();
    await account.createEmailPasswordSession(email, password);
    setUser(await account.get());
  };
  const registerUser = async ({ email, password1, name }) => {
    requireConfig();
    await account.create(ID.unique(), email, password1, name);
    await account.createEmailPasswordSession(email, password1);
    setUser(await account.get());
  };
  const logoutUser = async () => { await account.deleteSession("current"); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, loading, setLoading, loginUser, registerUser, logoutUser }}>
    {loading ? <div className="results-page" role="status"><Brand /><p>Getting ready…</p></div> : children}
  </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
export default AuthContext;
