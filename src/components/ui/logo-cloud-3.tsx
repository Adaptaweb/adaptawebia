import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
};

function LogoImage({ logo }: { logo: Logo }) {
  return (
    <img
      alt={logo.alt}
      className="select-none h-4 md:h-5"
      loading="lazy"
      src={logo.src}
    />
  );
}

const logos: Logo[] = [
  {
    src: "https://svgl.app/library/react_wordmark_dark.svg",
    alt: "React",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg",
    alt: "Python",
  },
  {
    src: "https://svgl.app/library/astro-wordmark-dark.svg",
    alt: "Astro",
  },
  {
    src: "https://svgl.app/library/tailwindcss-wordmark-dark.svg",
    alt: "Tailwind CSS",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/36/Logo.min.svg",
    alt: "Laravel",
  },
  {
    src: "https://svgl.app/library/opencode-wordmark.svg",
    alt: "OpenCode",
  },
  {
    src: "https://svgl.app/library/claude-ai-wordmark-icon_dark.svg",
    alt: "Claude AI",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark_dark.svg",
    alt: "Vercel",
  },
  {
    src: "https://svgl.app/library/github_wordmark_dark.svg",
    alt: "GitHub",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_dark.svg",
    alt: "OpenAI",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_dark.svg",
    alt: "Supabase",
  },
  {
    src: "https://svgl.app/library/cloudflare.svg",
    alt: "Cloudflare",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
    alt: "CSS3",
  },
];

export function LogoCloud({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-17 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={42} reverse speed={50} speedOnHover={25}>
        {logos.map((logo) => (
          <LogoImage key={`logo-${logo.alt}`} logo={logo} />
        ))}
      </InfiniteSlider>
    </div>
  );
}
