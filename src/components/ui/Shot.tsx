import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";
import horizon from "../../../public/gradients/gradient-horizon.jpg";
import tide from "../../../public/gradients/gradient-tide.jpg";
import depth from "../../../public/gradients/gradient-depth.jpg";

/** Brand gradients extracted from the Odyssey reference boards. */
export const gradients = { horizon, tide, depth } satisfies Record<string, StaticImageData>;
export type GradientName = keyof typeof gradients;

/**
 * A gradient frame holding a visual, like the product shots on cube.computer.
 * Until real photography exists, the visual is a labeled black placeholder.
 *
 * layout "bleed": the visual runs off the bottom-right edge (large shots).
 * layout "center": the visual sits centered with even padding (cards).
 */
export function Shot({
  gradient = "horizon",
  label,
  layout = "bleed",
  ratio = "1048/700",
  position = "center",
  flip = false,
  sizes = "(min-width: 1024px) 1048px, 100vw",
  priority = false,
  className,
}: {
  gradient?: GradientName;
  label: string;
  layout?: "bleed" | "center";
  ratio?: string;
  position?: string;
  flip?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={cn("relative isolate w-full overflow-hidden rounded-frame bg-plate", className)}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={gradients[gradient]}
        alt=""
        fill
        placeholder="blur"
        quality={90}
        sizes={sizes}
        priority={priority}
        className={cn("-z-10 object-cover", flip && "-scale-x-100")}
        style={{ objectPosition: position }}
      />
      <div
        role="img"
        aria-label={`Placeholder: ${label}`}
        className={cn(
          "absolute rounded-[10px] bg-ink",
          layout === "bleed" ? "left-[12%] top-[10%] -bottom-[4%] -right-[4%]" : "inset-[9%]",
        )}
      >
        <span className="absolute bottom-4 left-5 text-micro text-paper/40">{label}</span>
      </div>
    </div>
  );
}
