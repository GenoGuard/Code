import { FileText, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-8 text-white">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white flex items-center gap-2 text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-indigo-100 mt-1">Last updated: February 8, 2026</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Agreement to Terms</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          These Terms of Service ("Terms") constitute a legally binding agreement between you and GenoGuard 
          ("we," "us," or "our") regarding your use of our genetic mutation analysis platform.
        </p>
        <p className="text-slate-700 leading-relaxed">
          By accessing or using GenoGuard, you agree to be bound by these Terms. If you do not agree with 
          these Terms, you may not use our services.
        </p>
      </div>

      {/* Educational Purpose */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Educational & Research Use Only
        </h2>
        <div className="space-y-3 text-amber-900">
          <p className="font-semibold text-lg">
            IMPORTANT: GenoGuard is designed exclusively for educational and research purposes.
          </p>
          <p>By using this platform, you acknowledge and agree that:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>GenoGuard does NOT provide medical diagnoses, treatment, or clinical advice</li>
            <li>Results should NOT be used for clinical decision-making</li>
            <li>This platform is NOT a substitute for professional genetic counseling or medical care</li>
            <li>GenoGuard has NOT been approved by the FDA or other regulatory agencies for clinical use</li>
            <li>You should consult qualified healthcare professionals for any medical decisions</li>
          </ul>
        </div>
      </div>

      {/* Eligibility */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Eligibility</h2>
        <div className="space-y-3 text-slate-700">
          <p>To use GenoGuard, you must:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Not be prohibited from using the service under applicable laws</li>
            <li>Provide accurate and complete registration information</li>
          </ul>
        </div>
      </div>

      {/* Account Responsibilities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Account Responsibilities</h2>
        <div className="space-y-4 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">You are responsible for:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your contact information is current and accurate</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">You agree NOT to:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Share your account credentials with others</li>
              <li>Create multiple accounts for fraudulent purposes</li>
              <li>Use another person's account without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Acceptable Use */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptable Use Policy</h2>
        <div className="space-y-4 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Permitted Uses
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Educational purposes and learning about genetics</li>
              <li>Academic research projects</li>
              <li>Scientific investigation (non-clinical)</li>
              <li>Bioinformatics training and development</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Prohibited Uses
            </h3>
            <p className="mb-2">You agree NOT to use GenoGuard to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Make clinical or medical decisions</li>
              <li>Provide medical diagnoses or treatment recommendations</li>
              <li>Upload data without proper authorization or consent</li>
              <li>Violate any person's privacy or data protection rights</li>
              <li>Engage in any unlawful, harmful, or fraudulent activity</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>Use automated tools to scrape or harvest data</li>
              <li>Interfere with or disrupt our services</li>
              <li>Upload malicious code or viruses</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Ownership */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          Data Ownership & Rights
        </h2>
        <div className="space-y-3 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">Your Data</h3>
            <p className="mt-1">
              You retain all rights to your genetic data and sequences. By using GenoGuard, you grant us a 
              limited license to process your data solely for the purpose of providing our services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Our Platform</h3>
            <p className="mt-1">
              All rights, title, and interest in GenoGuard's software, algorithms, and content (excluding your data) 
              belong to us and are protected by copyright, trademark, and other laws.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Data Deletion</h3>
            <p className="mt-1">
              You may delete your account and data at any time through your account settings. Upon deletion, 
              we will permanently remove your genetic data within 30 days.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Disclaimers & Limitations</h2>
        <div className="space-y-4 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">No Warranties</h3>
            <p className="mt-1">
              GenoGuard is provided "as is" and "as available" without warranties of any kind, either express or implied, 
              including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Accuracy of Results</h3>
            <p className="mt-1">
              While we strive for accuracy, we do not guarantee that our analysis results are complete, accurate, 
              reliable, or error-free. Results should be verified through proper clinical channels.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Service Availability</h3>
            <p className="mt-1">
              We do not guarantee uninterrupted access to GenoGuard. We may modify, suspend, or discontinue 
              any aspect of the service at any time without notice.
            </p>
          </div>
        </div>
      </div>

      {/* Limitation of Liability */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitation of Liability</h2>
        <div className="space-y-3 text-slate-700">
          <p className="font-semibold">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              GenoGuard and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages
            </li>
            <li>
              Our total liability shall not exceed the amount you paid us (if any) in the 12 months preceding 
              the claim
            </li>
            <li>
              We are not liable for any health outcomes, medical decisions, or clinical consequences resulting 
              from use of our platform
            </li>
            <li>
              We are not responsible for any loss of data due to user error, system failure, or unauthorized access
            </li>
          </ul>
        </div>
      </div>

      {/* Indemnification */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Indemnification</h2>
        <p className="text-slate-700">
          You agree to indemnify, defend, and hold harmless GenoGuard, its officers, directors, employees, and agents 
          from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4 mt-3 text-slate-700">
          <li>Your use of GenoGuard</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another person or entity</li>
          <li>Your data or content uploaded to the platform</li>
        </ul>
      </div>

      {/* Third Party Links */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Links & Services</h2>
        <p className="text-slate-700">
          GenoGuard may contain links to third-party websites or services (such as Google OAuth, Supabase, etc.). 
          We are not responsible for the content, privacy policies, or practices of any third-party sites or services. 
          Your use of third-party services is at your own risk.
        </p>
      </div>

      {/* Modifications */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Modifications to Terms</h2>
        <p className="text-slate-700">
          We reserve the right to modify these Terms at any time. We will notify you of material changes by 
          updating the "Last updated" date. Continued use of GenoGuard after changes constitutes acceptance 
          of the modified Terms. If you do not agree to the changes, you must stop using our services.
        </p>
      </div>

      {/* Termination */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Termination</h2>
        <div className="space-y-3 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">By You</h3>
            <p className="mt-1">You may terminate your account at any time through your account settings.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">By Us</h3>
            <p className="mt-1">
              We may suspend or terminate your access to GenoGuard at any time, without notice, for any reason, 
              including but not limited to violation of these Terms, fraudulent activity, or abuse of the platform.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Effect of Termination</h3>
            <p className="mt-1">
              Upon termination, your right to use GenoGuard will immediately cease. We will delete your account 
              data according to our data retention policy.
            </p>
          </div>
        </div>
      </div>

      {/* Governing Law */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Governing Law & Dispute Resolution</h2>
        <div className="space-y-3 text-slate-700">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Ireland, 
            without regard to its conflict of law provisions.
          </p>
          <p>
            Any disputes arising out of or relating to these Terms or your use of GenoGuard shall be resolved 
            through binding arbitration, except that either party may seek injunctive relief in court.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Information</h2>
        <div className="space-y-2 text-slate-700">
          <p>If you have questions about these Terms, please contact us:</p>
          <div className="mt-4 space-y-1">
            <p><strong>Email:</strong> genoguard@outlook.com</p>
            <p><strong>General Inquiries:</strong> genoguard@outlook.com</p>
          </div>
        </div>
      </div>

      {/* Entire Agreement */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Entire Agreement</h2>
        <p className="text-slate-700">
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and GenoGuard 
          regarding your use of our services and supersede all prior agreements and understandings.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-sm text-slate-500">
          © 2026 GenoGuard. All rights reserved.
        </p>
      </div>
    </div>
  );
}