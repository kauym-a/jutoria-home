import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router does NOT reset scroll position on navigation by default — without this,
// if a user is scrolled down on one page and clicks a link to another page, they land
// on the new page still scrolled down. Mounted once inside <BrowserRouter> in App.tsx,
// this scrolls back to the top on every route (pathname) change.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
