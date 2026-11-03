import Image from "next/image";

/** Ista visina hero sekcije na svim stranicama osim početne. */
const HEIGHT = "h-72 sm:h-60 lg:h-72";

export function PageHero({
  title,
  eyebrow,
  image,
  mobileImage,
  imagePosition,
  mobileImagePosition,
  bright = false,
  animated,
  children,
}: {
  title: string;
  eyebrow?: string;
  image?: string | null;
  /** Posebna slika za telefone (kao na originalnom sajtu). */
  mobileImage?: string | null;
  /** CSS object-position za hero sliku, npr. "center top". */
  imagePosition?: string;
  /** CSS object-position za mobilnu sliku. */
  mobileImagePosition?: string;
  /** Slika je jasno vidljiva (kao hero na početnoj), a ne samo zatamnjena pozadina. */
  bright?: boolean;
  /** Animirana pozadina (GIF) sa originalnog sajta: desktop i mobilna verzija. */
  animated?: { desktop: string; mobile: string };
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`relative isolate flex items-center overflow-hidden text-white ${animated ? "" : "bg-navy-950"} ${HEIGHT}`}
    >
      {animated ? (
        <>
          {/* Animacija (ista vodoravna verzija na svim ekranima), u okviru širine stranice (max-w-7xl) */}
          <div className="absolute inset-0 -z-[5]">
            <div className="mx-auto flex h-full max-w-7xl justify-end px-5">
              <div className="h-full max-w-[70%] overflow-hidden max-md:max-w-full">
                {/* scale uklanja sivi okvir GIF-a */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={animated.desktop}
                  alt=""
                  className="h-full w-auto scale-[1.12] object-cover object-center max-md:w-full max-md:object-contain max-md:opacity-60"
                />
              </div>
            </div>
          </div>
          {/* Svetliji overlay – slika ostaje vidljiva */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/40 to-transparent max-md:from-navy-950/90 max-md:via-navy-950/45 max-md:to-navy-950/15" />
        </>
      ) : (
        <>
          {image && (
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
              className={
                bright
                  ? `-z-20 object-cover ${mobileImage ? "max-md:hidden" : ""}`
                  : "-z-20 object-cover opacity-30"
              }
            />
          )}
          {image && mobileImage && (
            <Image
              src={mobileImage}
              alt=""
              fill
              priority
              sizes="100vw"
              style={mobileImagePosition ? { objectPosition: mobileImagePosition } : undefined}
              className="-z-20 object-cover md:hidden"
            />
          )}
          <div
            className={
              bright
                ? "absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/40 to-transparent max-md:from-navy-950/90 max-md:via-navy-950/45 max-md:to-navy-950/15"
                : "absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-800/60"
            }
          />
        </>
      )}
      <div className="mx-auto w-full max-w-7xl px-5">
        {eyebrow && (
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-gold-400">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
          {title}
        </h1>
        {children && (
          <div className="mt-4 hidden max-w-2xl text-lg text-white/80 sm:block">{children}</div>
        )}
      </div>
    </section>
  );
}
