import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/vendor/ui/accordion";
import { tv } from "tailwind-variants";

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
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full p-4 bg-white mt-4 space-y-4 rounded-[16px] xl:p-8"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className={accordionTrigger()}>
            Starting your traveling blog with Vasco
          </AccordionTrigger>
          <AccordionContent>
            <p className={accordionText()}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              bibendum placerat faucibus. Nullam quis vulputate purus. Aenean
              sed purus orci.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className={accordionTrigger()}>
            Exploring hidden gems in your city with Vasco
          </AccordionTrigger>
          <AccordionContent>
            <p className={accordionText()}>
              We offer worldwide shipping through trusted courier partners.
              Standard delivery takes 3-5 business days, while express shipping
              ensures delivery within 1-2 business days.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className={accordionTrigger()}>
            Tips for creating engaging travel content with Vasco
          </AccordionTrigger>
          <AccordionContent>
            <p className={accordionText()}>
              We stand behind our products with a comprehensive 30-day return
              policy. If you&apos;re not completely satisfied, simply return the
              item in its original condition.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className={accordionTrigger()}>
            Building a community around your travel experiences with Vasco
          </AccordionTrigger>
          <AccordionContent>
            <p className={accordionText()}>
              We stand behind our products with a comprehensive 30-day return
              policy. If you&apos;re not completely satisfied, simply return the
              item in its original condition. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Error ab quod ducimus praesentium
              cupiditate voluptatum odit eius saepe. Magni vero accusantium
              consectetur neque laboriosam ullam eveniet nam ea? Minus,
              mollitia?
            </p>
            <br />
            <p className={accordionText()}>
              Our hassle-free return process includes free return shipping and
              full refunds processed within 48 hours of receiving the returned
              item. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              perspiciatis reiciendis, beatae libero exercitationem ad. Mollitia
              rem, vel veniam modi natus ad numquam facilis ratione quo atque?
              Voluptatem, assumenda iste.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className={accordionTrigger()}>
            Monetizing your travel blog: Strategies with Vasco
          </AccordionTrigger>
          <AccordionContent>
            <p className={accordionText()}>
              We stand behind our products with a comprehensive 30-day return
              policy. If you&apos;re not completely satisfied, simply return the
              item in its original condition. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Error ab quod ducimus praesentium
              cupiditate voluptatum odit eius saepe. Magni vero accusantium
              consectetur neque laboriosam ullam eveniet nam ea? Minus,
              mollitia?
            </p>
            <br />
            <p className={accordionText()}>
              Our hassle-free return process includes free return shipping and
              full refunds processed within 48 hours of receiving the returned
              item. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              perspiciatis reiciendis, beatae libero exercitationem ad. Mollitia
              rem, vel veniam modi natus ad numquam facilis ratione quo atque?
              Voluptatem, assumenda iste.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
