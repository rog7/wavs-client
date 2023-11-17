const featuredTestimonial = {
  body: "Your playing is so inspiring and also a vibe. I have learned so many extended chords from you man. There are many musicians on here but few capture the soul of the keys so much."
};
const testimonials = [
  [
    [
      {
        body: "Let's sample this masterclass bro 🔥"
      },
    ],
    [
      {
        body: "There's something about these chord progressions that got me stink-faced the entire time. It's so magical to hear."
      },
    ],
  ],
  [
    [
      {
        body: "This is so peaceful, as always. Thank you for continuing to serenade us with your incredible talents."
      },
    ],
    [
      {
        body: "I feel like you play all the chords I gravitate to in music. Makes me wanna sing 🙌🏽",
      },
    ],
  ],
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Testimonials() {
  return (
    <div id="testimonials" className="relative isolate bg-white mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-[#0070F3]">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What people have to say
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={columnGroupIdx}
              className="space-y-8 xl:contents xl:space-y-0"
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={classNames(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? "xl:row-span-2"
                      : "xl:row-start-1",
                    "space-y-8"
                  )}
                >
                  {column.map((testimonial, idx) => (
                    <figure
                      key={idx}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
