import {
  Dna,
  Microscope,
  Brain,
  Shield,
  BookOpen,
  FileText,
} from 'lucide-react';
import logoImage from '../../assets/logo.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Dna,
      title: 'Pancreatic Cancer Gene Panel',
      description:
        'Focused analysis of critical genes: KRAS (oncogene), TP53 (tumor suppressor), SMAD4, BRCA1/2, CDKN2A, and other PDAC-associated mutations',
    },
    {
      icon: Microscope,
      title: 'KRAS & TP53 Detection',
      description:
        'Specialized algorithms for detecting the most common pancreatic cancer mutations including KRAS G12D/V/R and TP53 hotspot mutations',
    },
    {
      icon: Brain,
      title: 'Clinical Actionability',
      description:
        'AI-powered interpretation linking mutations to treatment options, including PARP inhibitor eligibility for BRCA mutations and targeted therapies',
    },
    {
      icon: Shield,
      title: 'Tumor Microenvironment',
      description:
        'Analyze immune evasion mechanisms and tumor-stroma interactions specific to pancreatic ductal adenocarcinoma (PDAC)',
    },
    {
      icon: BookOpen,
      title: 'PDAC Mutation Database',
      description:
        'Comprehensive database with 25,000+ known pancreatic cancer mutations from NIH/NCI including somatic and germline variants',
    },
    {
      icon: FileText,
      title: 'Clinical Reports',
      description:
        'Generate detailed reports with mutation profiles, prognostic indicators, and treatment recommendations in standard clinical formats',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-12 text-center space-y-6">
        <div className="inline-flex items-center justify-center mb-4">
          <img
            src={logoImage}
            alt="GenoGuard Logo"
            className="h-24 w-24 rounded-2xl object-cover shadow-xl"
          />
        </div>
        <h1 className="text-4xl md:text-5xl text-white font-bold">
          Pancreatic Cancer Mutation Analysis
        </h1>
        <p className="text-lg text-indigo-100 max-w-3xl mx-auto leading-relaxed">
          Advanced AI-powered genetic analysis platform specifically designed for pancreatic cancer research. 
          Detect critical mutations in TP53, KRAS, BRCA2, SMAD4, and other pancreatic cancer-associated genes 
          with clinical-grade precision.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-slate-900">90%+</div>
            <div className="text-sm text-slate-700">KRAS mutations detected</div>
          </div>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-slate-900">50-75%</div>
            <div className="text-sm text-slate-700">TP53 mutations in PDAC</div>
          </div>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-slate-900">5-10%</div>
            <div className="text-sm text-slate-700">Hereditary cases (BRCA)</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('analysis')}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-md font-medium"
          >
            Start Analysis
          </button>
          <button
            onClick={() => onNavigate('sequence-manager')}
            className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium"
          >
            Upload Sequences
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl text-slate-900 mb-6 text-center">
          Pancreatic Cancer-Specific Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pancreatic Cancer Info Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
        <h2 className="text-2xl text-slate-900 mb-4">About Pancreatic Cancer Genetics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Key Genetic Drivers</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>KRAS:</strong> Mutated in 90-95% of pancreatic cancers, primarily at codons 12, 13, and 61</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>TP53:</strong> Tumor suppressor gene mutated in 50-75% of cases, associated with aggressive disease</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>SMAD4:</strong> Inactivated in ~50% of cases, involved in TGF-β signaling pathway</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>CDKN2A:</strong> Loss occurs in 90% of tumors, regulates cell cycle progression</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Clinical Significance</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>BRCA1/2 mutations:</strong> Found in 5-10% of cases, may respond to PARP inhibitors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>DNA Repair Defects:</strong> Guide precision medicine approaches and immunotherapy eligibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Hereditary Risk:</strong> Germline testing identifies familial cancer syndromes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Prognostic Value:</strong> Mutation profiles inform treatment planning and survival estimates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}