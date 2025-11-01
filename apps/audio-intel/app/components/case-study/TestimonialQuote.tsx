import type { TestimonialQuoteData } from '@/types/case-study';

interface TestimonialQuoteProps {
  data: TestimonialQuoteData;
}

export function TestimonialQuote({ data }: TestimonialQuoteProps) {
  return (
    <section id="testimonials" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">{data.heading}</h2>
      <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
        {data.quote}
      </blockquote>
      {data.attribution && <p className="text-sm text-gray-500">{data.attribution}</p>}
    </section>
  );
}
