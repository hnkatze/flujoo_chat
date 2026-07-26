import { Topbar } from "@/components/app-shell/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
