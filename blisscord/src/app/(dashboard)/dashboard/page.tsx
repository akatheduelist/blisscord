import { FC } from "react";

interface pageProps { }

// Main landing page for the dashboard. Dashboard
// is only available to users who are logged in and verified.
const page: FC<pageProps> = ({ }) => {
  return (
    <main>
      <div>dashboard page</div>
    </main>
  );
};

export default page;
