import { CheckCircle, ArrowRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewResults: () => void;
  analysisType?: string;
}

export function ResultsModal({ 
  isOpen, 
  onClose, 
  onViewResults,
  analysisType = "Mutation Analysis"
}: ResultsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Trigger animation after modal is visible
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before hiding
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{
          animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'none',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="mb-6 relative">
            <div
              className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
              style={{
                animation: isAnimating ? 'scaleIn 0.5s ease-out' : 'none',
              }}
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            {/* Animated Rings */}
            <div
              className="absolute inset-0 mx-auto w-20 h-20 rounded-full border-4 border-green-400"
              style={{
                animation: isAnimating ? 'ping 1s ease-out' : 'none',
                opacity: 0,
              }}
            />
            <div
              className="absolute inset-0 mx-auto w-20 h-20 rounded-full border-4 border-green-400"
              style={{
                animation: isAnimating ? 'ping 1s ease-out 0.3s' : 'none',
                opacity: 0,
              }}
            />
          </div>

          {/* Text */}
          <h2
            className="text-2xl font-bold text-slate-900 mb-3"
            style={{
              animation: isAnimating ? 'fadeInUp 0.4s ease-out 0.2s both' : 'none',
            }}
          >
            Analysis Complete!
          </h2>
          <p
            className="text-slate-600 mb-6"
            style={{
              animation: isAnimating ? 'fadeInUp 0.4s ease-out 0.3s both' : 'none',
            }}
          >
            Your {analysisType} has been successfully completed. 
            View your detailed results now.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3"
            style={{
              animation: isAnimating ? 'fadeInUp 0.4s ease-out 0.4s both' : 'none',
            }}
          >
            <button
              onClick={onViewResults}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
            >
              View Results
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 blur-2xl" />
        <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 blur-2xl" />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}