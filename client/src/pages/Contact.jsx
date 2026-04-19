const Contact = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-primary/15 via-white to-emerald-50 shadow-sm">
        <div className="grid gap-10 p-6 md:grid-cols-[1fr_1.15fr] md:p-10 lg:p-12">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Contact
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-gray-900 md:text-5xl">
                Reach us for orders and delivery support
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
                Call us directly or visit our location along Entebbe Road. Cash on
                Delivery orders and customer support are handled from this branch.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-gray-200 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Phone
                </p>
                <div className="mt-3 space-y-2 text-lg font-medium text-gray-900">
                  <a
                    href="tel:+256756991025"
                    className="block transition hover:text-primary"
                  >
                    +256756991025
                  </a>
                  <a
                    href="tel:+256741629044"
                    className="block transition hover:text-primary"
                  >
                    +256741629044
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-gray-200 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Address
                </p>
                <p className="mt-3 text-lg leading-8 text-gray-900">
                  Seguku Katale, Entebbe Road, Kampala, Uganda
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-sm">
            <iframe
              title="GreenCart location map"
              src="https://www.google.com/maps?q=Seguku+Katale,+Entebbe+Road,+Kampala,+Uganda&z=15&output=embed"
              className="h-[420px] w-full rounded-[20px] md:h-full min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
