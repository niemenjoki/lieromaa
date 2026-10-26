import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// False during the server render and hydration, true after it. Lets components read browser-only values that stay
// the same while the component is mounted (storage, today's date, the URL of a page opened directly) during render
// without copying them into state in an effect. The hook does not re-render on changes: use usePathname or
// useSearchParams for URL values that change with client-side navigation.
const useHydrated = () =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

export default useHydrated;
