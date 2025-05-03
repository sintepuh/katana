import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import CreateProjectModel from "@/features/projects/components/create-project-model";
import CreateTaskModel from "@/features/tasks/components/create-task-model";
import EditTaskModel from "@/features/tasks/components/edit-task-model";
import UpdateProfileModel from "@/features/profile/components/update-profile-model";
import CreateWorkspaceModel from "@/features/workspaces/components/create-workspace-model";
import React from "react";
import PageTransitionWrapper from "@/components/page-transition-wrapper";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModel />
      <CreateProjectModel />
      <CreateTaskModel />
      <EditTaskModel />
      <UpdateProfileModel />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto ">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto h-full">
            <Navbar />
            <main className="h-full py-8 px-3 sm:px-6 flex flex-col">
              <PageTransitionWrapper>
                <div className="contents"> {/* Новый враппер */}
                  {children}
                </div>
              </PageTransitionWrapper>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
