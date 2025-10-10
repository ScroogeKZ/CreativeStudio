import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-[hsl(15_90%_55%)] bg-clip-text text-transparent mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-muted-foreground mb-8">
          К сожалению, запрашиваемая страница не существует
        </p>
        <Link href="/">
          <Button size="lg" data-testid="button-home">
            <Home className="mr-2 h-5 w-5" />
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
