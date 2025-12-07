import Image from "next/image";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="my-6 mb-12 text-center">
      <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <Sparkles className="mr-2 h-4 w-4 text-brand-500" />
        Powered by Lens Protocol
      </div>

      <div className="mb-8 flex justify-center">
        <Image
          src="/logo.png"
          alt="LensForum Logo"
          width={80}
          height={80}
          className="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
        Web3
        <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
          Forum
        </span>
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
        Connect, create, and contribute to the future of decentralized communities
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center"></div>
    </section>
  );
}
