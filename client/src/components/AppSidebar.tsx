import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Camera,
  Trophy,
  Bell,
  Store,
  Users,
  Settings,
  HelpCircle,
  Fuel,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainItems = [
  { title: "Panel Principal", url: "/", icon: LayoutDashboard },
  { title: "Agregar Registro", url: "/register", icon: Camera },
  { title: "Gamificación", url: "/gamification", icon: Trophy },
  { title: "Alertas", url: "/alerts", icon: Bell },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "Modo Flota", url: "/fleet", icon: Users },
];

const secondaryItems = [
  { title: "Configuración", url: "/settings", icon: Settings },
  { title: "Ayuda", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Fuel className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">FuelSmart CR</span>
            <span className="text-xs text-sidebar-foreground/60">Gestión de Energía</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Soporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">CR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">Carlos Rodríguez</span>
            <span className="text-xs text-sidebar-foreground/60">Plan Premium</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
