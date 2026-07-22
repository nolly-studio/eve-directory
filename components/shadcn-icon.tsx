import Image from "next/image";

export const ShadcnIcon = ({ className }: { className?: string }) => (
  <Image
    alt="Shadcn Icon"
    className={className}
    height={48}
    src="/avatars/shadcn.jpg"
    width={48}
  />
);
