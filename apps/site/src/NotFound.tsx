import { Button } from "@madison/ui/button";

/**
 * Catch-all for paths that don't map to a prototype slug.
 *
 * React Router prerenders this view at `/404/`. Netlify rewrites unmatched
 * requests to that file with status 404, preserving the requested URL.
 */
export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-stack bg-app px-gutter text-center text-primary">
      <p className="text-sm font-medium tracking-widest text-secondary uppercase">
        404
      </p>
      <h1 className="font-serif text-4xl font-medium text-primary">
        We couldn&rsquo;t find that page
      </h1>
      <p className="max-w-md text-base text-secondary">
        The link may be out of date, or the page may have moved.
      </p>
      <Button asChild className="mt-2">
        <a href="/">Back to Madison Ai</a>
      </Button>
    </div>
  );
}
