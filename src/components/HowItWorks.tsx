export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-center">
          How It Works
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2">

          <div className="rounded-xl border p-8">
            <h3 className="text-2xl font-semibold mb-6">
              For Customers
            </h3>

            <ol className="space-y-4">
              <li>
                <strong>1.</strong> Post your job requirements.
              </li>
              <li>
                <strong>2.</strong> Get matched with suitable professionals.
              </li>
              <li>
                <strong>3.</strong> Choose the right professional for your job.
              </li>
            </ol>
          </div>

          <div className="rounded-xl border p-8">
            <h3 className="text-2xl font-semibold mb-6">
              For Professionals
            </h3>

            <ol className="space-y-4">
              <li>
                <strong>1.</strong> Join KindAu for a simple monthly fee.
              </li>
              <li>
                <strong>2.</strong> Receive opportunities through fair rotation.
              </li>
              <li>
                <strong>3.</strong> Focus on your work instead of chasing leads.
              </li>
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}