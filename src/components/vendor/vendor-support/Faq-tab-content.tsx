"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/vendor/ui/accordion";
import { tv } from "tailwind-variants";
import { useFAQs } from "@/hooks/vendor/useFAQs";

const faqTabContent = tv({
  slots: {
    accordionTrigger:
      "font-semibold text-[#292929] text-left text-base leading-[22px] px-3 py-4 hover:no-underline outline-none xl:text-lg/5",
    accordionText:
      "font-normal text-sm px-3 text-[#333333] xl:text-[16px] xl:leading-[22px]",
  },
});

const { accordionTrigger, accordionText } = faqTabContent();

export default function FaqTabContent() {
  const { data: faqData, isLoading, error } = useFAQs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white mt-4 rounded-[16px] xl:p-8">
        <p className="text-red-500 text-center">
          Failed to load FAQs. Please try again later.
        </p>
      </div>
    );
  }

  if (!faqData?.data?.length) {
    return (
      <div className="p-4 bg-white mt-4 rounded-[16px] xl:p-8">
        <p className="text-gray-500 text-center">No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full p-4 bg-white mt-4 space-y-4 rounded-[16px] xl:p-8"
      >
        {faqData.data.map((faq, index) => (
          <AccordionItem key={faq.id} value={`item-${index + 1}`}>
            <AccordionTrigger className={accordionTrigger()}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <div className={accordionText()}>
                {faq.answer.split('\r\n').map((line, lineIndex) => (
                  <p key={lineIndex} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
