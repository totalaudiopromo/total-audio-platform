import type { CaseStudyHeroData } from "@/types/case-study";

interface CaseStudyHeroProps {
  data: CaseStudyHeroData;
}

export function CaseStudyHero({ data }: CaseStudyHeroProps) {
  return (
    <header className="mb-12">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
        {data.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
        <span>{data.byline.author}</span>
        <span className="hidden sm:inline">•</span>
        <span>{data.byline.role}</span>
        <span className="hidden sm:inline">•</span>
        <span>{data.byline.format}</span>
        <span className="hidden sm:inline">•</span>
        <span>{data.byline.readTime}</span>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <p className="text-lg text-gray-800 font-medium leading-relaxed">
          {data.introCallout}
        </p>
      </div>
    </header>
  );
}
