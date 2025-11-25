import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import Image from "next/image";

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Logo central */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center ">
          <Image
            src="/NQ.svg"
            alt="Vizion"
            width={60}
            height={60}
            className="object-contain dark:brightness-0 dark:invert-0 dark:[filter:brightness(0)_invert(1)]"
          />
        </div>
      </div>

      <OrbitingCircles iconSize={30} radius={120}>
        <Image
          src="/logoIndices/McDonald’s Corporation.svg"
          alt="McDonald's"
          width={50}
          height={50}
          className="object-contain"
        />
        <Image
          src="/logoIndices/NVIDIA Corporation.svg"
          alt="NVIDIA"
          width={50}
          height={50}
          className="object-contain"
        />
        <Image
          src="/logoIndices/Netflix, Inc..svg"
          alt="Netflix"
          width={50}
          height={50}
          className="object-contain"
        />
      </OrbitingCircles>
      <OrbitingCircles iconSize={20} radius={70} reverse speed={2}>
        <Image
          src="/logoIndices/Tesla, Inc..svg"
          alt="Tesla"
          width={40}
          height={40}
          className="object-contain"
        />
        <Image
          src="/logoIndices/amazon.svg"
          alt="Amazon"
          width={40}
          height={40}
          className="object-contain"
        />
      </OrbitingCircles>
    </div>
  );
}
