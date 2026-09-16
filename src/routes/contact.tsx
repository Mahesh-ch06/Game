import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, CheckCircle2, HelpCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Support | Secret Word Room" },
      {
        name: "description",
        content:
          "Need help with Secret Word Room? Contact our support team for game inquiries, bug reports, word suggestions, or advertising information.",
      },
    ],
  }),
  component: ContactPage,
});

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12 pb-32 text-white">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left column: Contact Info & Support FAQ */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Mail className="w-3.5 h-3.5" /> Support & Contact
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Have feedback, found a glitch, or want to suggest new word pairs? We read every message and respond within
              24-48 business hours.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Email</h3>
                <a
                  href="mailto:codeversestudio8@gmail.com"
                  className="text-white font-bold hover:text-primary transition-colors text-sm sm:text-base"
                >
                  codeversestudio8@gmail.com
                </a>
                <p className="text-xs text-gray-400 mt-1">For account, technical, or publisher inquiries.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Word Suggestions</h3>
                <p className="text-white font-semibold text-sm">Community Curation Pool</p>
                <p className="text-xs text-gray-400 mt-1">
                  Have a creative word pair idea? Send it our way and we'll add it to the next database drop!
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" /> Quick Troubleshooting
            </h3>
            <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <li>• <strong>Room Code Invalid:</strong> Confirm the 5-letter uppercase code with the host.</li>
              <li>• <strong>Connection Dropped:</strong> Reconnect with the same nickname to resume your active seat.</li>
              <li>• <strong>Browser Audio:</strong> Tap anywhere on the screen to unmute round buzzer sounds.</li>
            </ul>
          </div>
        </div>

        {/* Right column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="panel p-6 sm:p-10 border border-white/10 rounded-3xl bg-zinc-950/90 backdrop-blur-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Message Received!</h2>
                <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, {name}. Our team has received your note and will reply to{" "}
                  <strong className="text-primary">{email}</strong> shortly.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  variant="outline"
                  className="mt-6 border-white/20 text-white hover:bg-white/10"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Send us a Message</h2>
                <p className="text-xs sm:text-sm text-gray-400 mb-6">
                  Fill in the details below and we will get back to you as soon as possible.
                </p>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Your Name *
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Inquiry Topic
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-12 rounded-md bg-zinc-900 border border-white/10 text-white px-3 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="support">Game Support & Troubleshooting</option>
                    <option value="words">Word Pair Suggestion</option>
                    <option value="bug">Report a Bug / Error</option>
                    <option value="feedback">General Feedback & Feature Ideas</option>
                    <option value="business">Advertising & Business Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need help with or share your idea..."
                    className="w-full rounded-md bg-white/5 border border-white/10 text-white p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  size="xl"
                  className="w-full font-black uppercase tracking-wider bg-primary text-black hover:bg-white transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>

                <p className="text-[11px] text-gray-500 text-center mt-3">
                  We respect your privacy. Your information is never sold or shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
