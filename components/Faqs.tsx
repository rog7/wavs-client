import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "How diverse are the chord voicings in the library?",
    answer:
      "Vault has a vast array of chord voicings spanning different genres and playing styles. The collection offers a rich variety to suit every pianist's needs.",
  },
  {
    question: "Can I access this app from multiple devices?",
    answer:
      "Most definitely! Vault is accessible across multiple platforms, ensuring that you can seamlessly switch between desktop, tablet, and smartphone.",
  },
  {
    question: "What sets your app apart from other chord libraries?",
    answer:
      "This app has a strong commitment to accuracy and providing an enjoyable user experience. Each chord is meticulously crafted, and the app is regularly updated with new chords to keep your musical exploration on the cutting edge.",
  },
  {
    question: "Can I submit a feature request?",
    answer:
      "Absolutely! I highly encourage and value user feedback. Your input drives the evolution of this app. Please feel free to reach out to me at roger@suavekeys.com.",
  },
];

export default function Faqs() {
  return (
    <div id="faqs" className="bg-white mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
