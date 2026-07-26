import { Topbar } from "@/components/app-shell/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Topbar />
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
