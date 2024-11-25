import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
// import { Breadcrumbs } from "../breadcrumbs";

export default function Header() {
  return (
    <header className="flex h-16 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        {/* <Breadcrumbs /> */}
      </div>
    </header>
  );
}
