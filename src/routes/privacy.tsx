import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, Eye, Cookie, Info, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Secret Word Room" },
      {
        name: "description",
        content:
          "Comprehensive Privacy Policy for Secret Word Room detailing our data protection practices, Google AdSense cookie usage, GDPR compliance, and user rights.",
      },
    ],
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12 pb-32 text-white">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="panel p-8 sm:p-12 border border-white/10 rounded-3xl space-y-10 bg-zinc-950/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">
            <ShieldCheck className="w-4 h-4" /> Legal & Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-mono">
            Effective Date: September 16, 2026 · Compliant with GDPR, CCPA, and Google AdSense Publisher Policies
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> 1. Overview & Commitment to Privacy
          </h2>
          <p>
            At <strong>Secret Word Room</strong> (accessible from <a href="https://secret-word-room.vercel.app" className="text-primary hover:underline">https://secret-word-room.vercel.app</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by Secret Word Room and how we use it.
          </p>
          <p>
            Secret Word Room is designed as a frictionless social party game. We do not require you to create an account, register an email address, or provide real names to play. Game lobbies are ephemeral and automatically expire after gameplay finishes.
          </p>
        </section>

        {/* Information Collected */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> 2. Information We Collect
          </h2>
          <p>We collect minimal data strictly required to provide multiplayer game functionality:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>
              <strong>Gameplay Session Data:</strong> Temporary 5-letter room codes, chosen player nicknames, vote records, and round scores. This data is kept solely for the active session and is purged automatically.
            </li>
            <li>
              <strong>Log Files:</strong> Like standard web platforms, Secret Word Room uses log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any personally identifiable information.
            </li>
          </ul>
        </section>

        {/* Google AdSense and Cookies */}
        <section className="space-y-4 text-sm text-gray-300 leading-relaxed p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-primary" /> 3. Cookies, Web Beacons & Google AdSense Disclosures
          </h2>
          <p>
            Like any other website, Secret Word Room uses &lsquo;cookies&rsquo;. These cookies are used to store information including visitors&rsquo; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&rsquo; experience by customizing our web page content based on visitors&rsquo; browser type and/or other information.
          </p>
          <div className="space-y-3 pl-2 border-l-2 border-primary/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Google DoubleClick DART Cookie</h3>
            <p className="text-gray-400">
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
            </p>
            <p className="text-gray-400">
              Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline break-all"
              >
                https://policies.google.com/technologies/ads
              </a>
            </p>
          </div>

          <div className="space-y-3 pl-2 border-l-2 border-purple-500/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Our Advertising Partners</h3>
            <p className="text-gray-400">
              Some of advertisers on our site may use cookies and web beacons. Our advertising partners include <strong>Google AdSense</strong>. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Secret Word Room, which are sent directly to users&rsquo; browser. They automatically receive your IP address when this occurs.
            </p>
            <p className="text-gray-400">
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                AboutAds Choices (www.aboutads.info)
              </a>{" "}
              or{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Google Ad Settings
              </a>.
            </p>
          </div>
        </section>

        {/* GDPR & European User Rights */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> 4. GDPR Data Protection Rights (EEA, UK & Switzerland)
          </h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
            <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization.</li>
          </ul>
          <p className="text-gray-400 mt-2">
            For visitors from the EEA, UK, and Switzerland, we utilize Google's Certified Consent Management Platform (CMP) to present a compliant consent prompt giving choices to consent, decline, or customize cookie preferences.
          </p>
        </section>

        {/* CCPA Disclosures */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" /> 5. CCPA Privacy Rights (Do Not Sell My Personal Information)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
            <li>Request that a business disclose the categories and specific pieces of personal data collected.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer&rsquo;s personal data, not sell the consumer&rsquo;s personal data.</li>
          </ul>
          <p className="text-gray-400">
            Secret Word Room does not sell personal data. If you make a request, we have one month to respond to you.
          </p>
        </section>

        {/* Children's Information */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> 6. Children&rsquo;s Information (COPPA)
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p className="text-gray-400">
            Secret Word Room does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        {/* Contact Us */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> 7. Contact Information
          </h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
          </p>
          <p className="font-mono text-primary">
            Email: <a href="mailto:codeversestudio8@gmail.com" className="underline">codeversestudio8@gmail.com</a>
          </p>
          <p className="text-xs text-gray-500">
            Website: <a href="https://secret-word-room.vercel.app" className="underline">https://secret-word-room.vercel.app</a>
          </p>
        </section>
      </div>
    </main>
  );
}
