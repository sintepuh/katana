import PageTransitionWrapper from "@/components/page-transition-wrapper";
import { PropsWithChildren } from "react";

const PublicPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <PageTransitionWrapper>
      {children}
    </PageTransitionWrapper>
  );
};

export default PublicPageLayout;
