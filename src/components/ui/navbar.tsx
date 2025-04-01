
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, X, Menu, ShoppingCart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon?: JSX.Element;
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  
  const navItems: NavItem[] = [
    { title: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Products", href: "/products" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Admin", href: "/admin", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-2 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c13d30e7-eaf2-483c-9dca-5a6aaa115cd1.png" 
              alt="Particle Investment Logo" 
              className="h-10 w-auto" 
            />
          </Link>

          <nav className="hidden gap-6 md:flex">
            {navItems.map(
              (item, index) =>
                index < navItems.length - 1 && (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin" className="hidden md:flex">
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Button>
          </Link>

          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="flex md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader>
                <SheetTitle asChild>
                  <Link
                    to="/"
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                  >
                    <img 
                      src="/lovable-uploads/c13d30e7-eaf2-483c-9dca-5a6aaa115cd1.png" 
                      alt="Particle Investment Logo" 
                      className="h-10 w-auto" 
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2 py-6">
                {navItems.map((item, index) => (
                  <div key={item.href}>
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-2 py-2 text-lg font-semibold"
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                    {index < navItems.length - 1 && (
                      <Separator className="mt-2" />
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
