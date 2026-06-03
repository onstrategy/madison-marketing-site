import meta from "./meta";
import { Button } from "@northwind/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@northwind/ui/card";

function formatPrice(amount: number): string {
  return amount === 0 ? "Free" : `$${amount}/mo`;
}

const PLANS = [
  { name: "Starter", price: 0, blurb: "For trying things out.", featured: false },
  { name: "Team", price: 29, blurb: "For small teams shipping together.", featured: true },
  { name: "Enterprise", price: 99, blurb: "For organizations at scale.", featured: false },
];

export default function PricingPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        <header className="space-y-2">
          <a
            href="/"
            className="text-sm text-secondary transition-colors hover:text-primary"
          >
            ← All prototypes
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="text-secondary">{meta.description}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "border-2 border-brand bg-brand-subtle" : ""}
            >
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.blurb}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatPrice(plan.price)}</div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.price === 0 ? "Get started" : "Choose plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
