import Logo from "@/components/logo";
import PageTransitionWrapper from "@/components/page-transition-wrapper";
import { PropsWithChildren } from "react";

const StandAloneLayout = ({ children }: PropsWithChildren) => {
  return (
    <PageTransitionWrapper>
      <main className="min-h-screen">
        <div className="mx-auto max-w-screen-2xl p-2 sm:p-4">
          <nav className="flex items-center justify-between py-4 h-[73px]">
            <Logo />
          </nav>
          <div className="flex flex-col items-center justify-center py-4">
            {children}
          </div>
        </div>
      </main>
    </PageTransitionWrapper>
  );
};

export default StandAloneLayout;
