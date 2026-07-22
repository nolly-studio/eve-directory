import { ButtonLink } from "@/components/ui/button-link";
import { githubLogo as GithubLogo } from "@/lib/integrations/logos";

export function ViewGithubButton({ href }: { href: string }) {
  return (
    <ButtonLink
      href={href}
      variant="outline"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GithubLogo className="size-4" data-icon="inline-start" />
      View GitHub
    </ButtonLink>
  );
}
