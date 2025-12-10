import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-3xl mx-auto text-center mb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Visualizing the future of work</h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          OnDuty is on a mission to simplify workforce management for teams of all sizes. 
          We believe in transparency, efficiency, and beautiful software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Built for modern teams</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            Traditional attendance systems are clunky, ugly, and hard to use. We built OnDuty to change that. 
            With a focus on user experience and powerful features, we help companies save time and money.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-gray-700">User-first design approach</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-gray-700">Enterprise-grade security</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-gray-700">Real-time data synchronization</span>
            </li>
          </ul>
        </div>
        <div className="order-1 md:order-2 rounded-[2.5rem] aspect-square relative overflow-hidden shadow-lg">
            <Image 
                src="/images/team.png" 
                alt="OnDuty Team" 
                fill 
                className="object-cover"
            />
        </div>
      </div>

      <div className="bg-brand-900 rounded-[3rem] p-12 md:p-24 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Join our journey</h2>
        <p className="text-brand-100 max-w-2xl mx-auto mb-8">
            We are always looking for talented individuals to join our team. 
            Check out our open positions.
        </p>
        <button className="bg-white text-brand-900 px-8 py-3 rounded-full font-bold hover:bg-brand-50 transition-colors">
            View Careers
        </button>
      </div>
    </div>
  )
}
