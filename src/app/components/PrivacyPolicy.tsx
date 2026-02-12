import { Shield, Lock, Database, UserCheck, FileText, Mail } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-indigo-100 mt-1">Last updated: February 8, 2026</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Introduction</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          GenoGuard ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your genetic data. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our genetic 
          mutation analysis platform.
        </p>
        <p className="text-slate-700 leading-relaxed">
          This policy complies with the General Data Protection Regulation (GDPR), the Health Insurance Portability and 
          Accountability Act (HIPAA), and other applicable data protection laws.
        </p>
      </div>

      {/* What We Collect */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Database className="h-6 w-6 text-indigo-600" />
          Information We Collect
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">1. Account Information</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Account creation date</li>
              <li>Login history</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">2. Genetic Data</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
              <li>DNA sequences you upload</li>
              <li>Mutation analysis results</li>
              <li>Gene library queries</li>
              <li>Analysis history</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">3. Technical Information</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage statistics (anonymized)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">4. OAuth Provider Data (Google Sign-In)</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
              <li>Email address from your Google account</li>
              <li>Profile name (if provided)</li>
              <li>Profile picture URL (if provided)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How We Use Data */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-indigo-600" />
          How We Use Your Information
        </h2>
        
        <div className="space-y-3 text-slate-700">
          <div className="flex items-start gap-3">
            <span className="text-indigo-600 font-bold mt-1">•</span>
            <p><strong>Provide Services:</strong> Process genetic sequences, perform mutation analysis, and generate reports</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-indigo-600 font-bold mt-1">•</span>
            <p><strong>Account Management:</strong> Maintain your account, authenticate logins, and provide customer support</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-indigo-600 font-bold mt-1">•</span>
            <p><strong>Improve Platform:</strong> Analyze usage patterns (anonymized) to enhance our algorithms and user experience</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-indigo-600 font-bold mt-1">•</span>
            <p><strong>Security:</strong> Detect and prevent fraud, abuse, and unauthorized access</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-indigo-600 font-bold mt-1">•</span>
            <p><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>Important:</strong> We NEVER sell your genetic data to third parties. We NEVER use your data for marketing purposes.
            We NEVER share your data with insurance companies or employers.
          </p>
        </div>
      </div>

      {/* Data Security */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="h-6 w-6 text-indigo-600" />
          Data Security & Storage
        </h2>
        
        <div className="space-y-4 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Encryption</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All data is encrypted in transit using TLS/SSL (HTTPS)</li>
              <li>All data is encrypted at rest using AES-256 encryption</li>
              <li>Passwords are hashed using bcrypt</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Infrastructure</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Hosted on Supabase (ISO 27001 certified infrastructure)</li>
              <li>Regular security audits and penetration testing</li>
              <li>Automated backup systems with point-in-time recovery</li>
              <li>Multi-factor authentication available</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Access Controls</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Strict role-based access control (RBAC)</li>
              <li>Only authorized personnel can access systems</li>
              <li>All access is logged and monitored</li>
              <li>Regular access reviews and audits</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Your Rights */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600" />
          Your Rights (GDPR)
        </h2>
        
        <div className="space-y-3 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">Right to Access</h3>
            <p className="mt-1">You can request a copy of all personal data we hold about you</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Right to Rectification</h3>
            <p className="mt-1">You can correct inaccurate or incomplete data through your account settings</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Right to Erasure ("Right to be Forgotten")</h3>
            <p className="mt-1">You can request deletion of your account and all associated data</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Right to Data Portability</h3>
            <p className="mt-1">You can download your data in a machine-readable format</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Right to Withdraw Consent</h3>
            <p className="mt-1">You can withdraw consent for data processing at any time</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Right to Object</h3>
            <p className="mt-1">You can object to certain types of data processing</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-sm text-indigo-900">
            To exercise any of these rights, please contact us at <strong>genoguard@outlook.com</strong>
          </p>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Retention</h2>
        
        <div className="space-y-3 text-slate-700">
          <p>
            <strong>Active Accounts:</strong> We retain your data for as long as your account is active
          </p>
          <p>
            <strong>Deleted Accounts:</strong> Upon account deletion, we permanently delete all your genetic data within 30 days
          </p>
          <p>
            <strong>Anonymized Data:</strong> We may retain anonymized, aggregated statistics for research purposes
          </p>
          <p>
            <strong>Legal Requirements:</strong> We may retain certain data longer if required by law
          </p>
        </div>
      </div>

      {/* Third Party Services */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Services</h2>
        
        <div className="space-y-4 text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">We use the following third-party services:</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <div>
                  <strong>Supabase:</strong> Database and authentication infrastructure
                  <br />
                  <span className="text-sm text-slate-600">Privacy Policy: https://supabase.com/privacy</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <div>
                  <strong>Google OAuth:</strong> Optional sign-in service
                  <br />
                  <span className="text-sm text-slate-600">Privacy Policy: https://policies.google.com/privacy</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <div>
                  <strong>Vercel:</strong> Hosting and deployment
                  <br />
                  <span className="text-sm text-slate-600">Privacy Policy: https://vercel.com/legal/privacy-policy</span>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-sm italic">
            These services are carefully selected for their strong privacy and security practices. 
            They are bound by data processing agreements to protect your information.
          </p>
        </div>
      </div>

      {/* Cookies */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Cookies & Tracking</h2>
        
        <div className="space-y-3 text-slate-700">
          <p>
            <strong>Essential Cookies:</strong> We use essential cookies for authentication and security (cannot be disabled)
          </p>
          <p>
            <strong>Session Storage:</strong> We store your login session locally in your browser
          </p>
          <p>
            <strong>No Analytics Tracking:</strong> We do not use third-party analytics or advertising cookies
          </p>
          <p>
            <strong>Demo Mode:</strong> We use localStorage to remember demo mode preference
          </p>
        </div>
      </div>

      {/* Children's Privacy */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Children's Privacy</h2>
        <p className="text-slate-700">
          GenoGuard is not intended for use by individuals under the age of 18. We do not knowingly collect 
          personal information from children. If you believe we have collected data from a child, please contact 
          us immediately at <strong>genoguard@outlook.com</strong>.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-amber-200">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Educational & Research Use Disclaimer</h2>
        <div className="space-y-3 text-slate-700">
          <p>
            GenoGuard is designed for <strong>educational and research purposes only</strong>. Our platform:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Does NOT provide medical diagnoses or treatment recommendations</li>
            <li>Should NOT be used for clinical decision-making</li>
            <li>Is NOT a substitute for professional medical advice</li>
            <li>Has NOT been approved by the FDA or other regulatory agencies</li>
          </ul>
          <p className="font-semibold mt-4">
            Always consult with qualified healthcare professionals regarding genetic testing and medical decisions.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Mail className="h-6 w-6 text-indigo-600" />
          Contact Us
        </h2>
        <div className="space-y-2 text-slate-700">
          <p>
            If you have questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="mt-4 space-y-1">
            <p><strong>Email:</strong> genoguard@outlook.com</p>
            <p><strong>Data Protection Officer:</strong> genoguard@outlook.com</p>
            <p><strong>Security Issues:</strong> genoguard@outlook.com</p>
          </div>
        </div>
      </div>

      {/* Changes to Policy */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to This Policy</h2>
        <p className="text-slate-700">
          We may update this Privacy Policy from time to time. We will notify you of any changes by updating 
          the "Last updated" date at the top of this policy. Continued use of GenoGuard after changes constitutes 
          acceptance of the updated policy. We encourage you to review this policy periodically.
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