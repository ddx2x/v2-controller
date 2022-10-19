import { useCallback, useState } from 'react';

interface Menu {}

interface User {
  username: string;
  token: string;
  menu: Menu;
}

export default () => {
  const [user, setUser] = useState<User | null>(null);
  const clear = useCallback(() => setUser(null), []);
  const init = useCallback((userConfig: User) => setUser(userConfig), []);

  return { user, clear, init };
};
