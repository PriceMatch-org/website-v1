'use client';

import Link from 'next/link';
import EarthBackground from '@/components/EarthBackground';

export default function SupportPage() {
  return (
    <div className="relative min-h-screen">
      <EarthBackground />
      
      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-5 text-center">
        <div className="animate-fade-in max-w-2xl">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
            DZDX Solutions
          </h1>
          <h2 className="text-2xl md:text-3xl text-dzdx-blue font-light mb-8 text-shadow-default">
            Support
          </h2>

          {/* Support Content */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 mb-8 text-left">
            <p className="text-lg text-white/90 mb-6 text-center">
              For any assistance or inquiries, please contact us at:
            </p>
            
            <div className="text-center mb-8">
              <a 
                href="mailto:adm.dzdx@gmail.com"
                className="text-2xl text-dzdx-blue hover:text-dzdx-light-blue transition-colors duration-300 font-medium"
              >
                adm.dzdx@gmail.com
              </a>
            </div>

            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-lg font-semibold text-dzdx-blue mb-2">Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
                <p>Saturday: 10:00 AM - 4:00 PM (IST)</p>
                <p>Sunday: Closed</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dzdx-blue mb-2">Response Time</h3>
                <p>We typically respond to all inquiries within 24 hours during business days.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dzdx-blue mb-2">What to Include</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Detailed description of your inquiry or issue</li>
                  <li>Your contact information</li>
                  <li>Any relevant screenshots or documents</li>
                  <li>Timeline or urgency level</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Link 
            href="/"
            className="inline-block px-6 py-3 btn-primary text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-dzdx-blue"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}