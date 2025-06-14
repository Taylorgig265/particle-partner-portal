
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, X, Menu, FileText, Settings, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";

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
    { title: "Gallery", href: "/gallery", icon: <Image className="h-5 w-5" /> },
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
                // Hide the Admin link from the main desktop nav items
                item.href !== "/admin" && (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-foreground/80"
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

          <QuoteRequestDialog 
            trigger={
              <Button variant="outline" className="hidden md:flex">
                <FileText className="mr-2 h-5 w-5" />
                Request a Quote
              </Button>
            }
          />

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
                    {/* Add separator for all items except the last one in the sheet menu */}
                    {index < navItems.length -1 && (
                      <Separator className="mt-2" />
                    )}
                  </div>
                ))}
                {/* Ensure "Request a Quote" is separated in the mobile menu */}
                <Separator className="mt-2" />
                <div>
                  <QuoteRequestDialog 
                    trigger={
                      <button
                        className="flex items-center gap-2 py-2 text-lg font-semibold w-full text-left"
                        onClick={() => { setOpen(false); }}
                      >
                        <FileText className="h-5 w-5" />
                        Request a Quote
                      </button>
                    }
                  />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

