"use client";

export default function ProfessionalBenefitsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-4">
        Join KindAu as a Professional
      </h1>

      <p className="text-lg text-gray-700 mb-8">
        Get priority access to customers, direct messaging, job offers, and full
        platform features — all designed to help you win more work with less
        hassle.
      </p>

      <div className="space-y-6 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-2">Why Professionals Choose KindAu</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Rotation Priority</strong> — appear earlier in customer job matching.</li>
            <li><strong>Unlimited Job Offers</strong> — receive offers from customers across your trade.</li>
            <li><strong>Direct Messaging</strong> — talk to customers instantly, no middlemen.</li>
            <li><strong>Verified Professional Badge</strong> — stand out and build trust.</li>
            <li><strong>Full Platform Access</strong> — messaging, offers, job management, and more.</li>
            <li><strong>Premium Visibility</strong> — be seen first when customers search.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">How It Works</h2>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li>Customers post jobs in your trade.</li>
            <li>KindAu matches you based on rotation priority.</li>
            <li>You receive job offers directly.</li>
            <li>You message customers to confirm details.</li>
            <li>You win the job and get paid.</li>
          </ol>
        </div>

        <div className="bg-gray-100 p-5 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Only $49/month</h2>
          <p className="text-gray-700">
            One job easily pays for your entire subscription. No lock-in
            contracts. Cancel anytime.
          </p>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/professional/subscribe"
          className="inline-block bg-black text-white px-6 py-3 rounded-md text-lg font-medium"
        >
          Subscribe Now — $49/month
        </a>
        <p className="text-gray-600 text-sm mt-2">
          Cancel anytime. No lock-in contracts.
        </p>
      </div>
    </div>
  );
}
