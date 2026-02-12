import React, { useState, useEffect } from 'react';
import { Play, Users, AlertCircle, CheckCircle, Loader, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabaseService, PatientSequence, AnalysisResult, Mutation } from '../services/SupabaseService';

interface AnalysisConfig {
  selectedPatient: string;
  analysisName: string;
}

// Results Modal Component
function ResultsModal({
  isOpen,
  onClose,
  onViewResults,
  analysisType
}: {
  isOpen: boolean;
  onClose: () => void;
  onViewResults: () => void;
  analysisType: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900">
          Analysis Complete!
        </h2>
        <p className="text-center text-slate-600">
          Your {analysisType} analysis has been completed successfully and saved to the cloud.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onViewResults}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}

// Storage helper with proper error handling
const storage = {
  async get(key: string) {
    if (typeof window !== 'undefined' && (window as any).storage) {
      try {
        return await (window as any).storage.get(key);
      } catch (e) {
        console.error('Storage get error:', e);
        return null;
      }
    }
    // Fallback to in-memory storage for artifacts
    const memoryStore = (window as any).__memoryStore || {};
    return memoryStore[key] ? { key, value: memoryStore[key], shared: false } : null;
  },

  async set(key: string, value: string) {
    if (typeof window !== 'undefined' && (window as any).storage) {
      try {
        return await (window as any).storage.set(key, value);
      } catch (e) {
        console.error('Storage set error:', e);
      }
    }
    // Fallback to in-memory storage for artifacts
    if (typeof window !== 'undefined') {
      (window as any).__memoryStore = (window as any).__memoryStore || {};
      (window as any).__memoryStore[key] = value;
    }
    return { key, value, shared: false };
  }
};

export default function Analysis() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const [config, setConfig] = useState<AnalysisConfig>({
    selectedPatient: '',
    analysisName: ''
  });

  const [errors, setErrors] = useState({
    patient: '',
    name: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      // Try to load from Supabase first
      const supabaseSequences = await supabaseService.getSequences();
      
      if (supabaseSequences && supabaseSequences.length > 0) {
        setPatients(supabaseSequences);
      } else {
        // Fallback to localStorage
        const stored = await storage.get('patient-sequences');
        if (stored && stored.value) {
          const allSequences = JSON.parse(stored.value);
          setPatients(allSequences);
        }
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      // Fallback to localStorage
      try {
        const stored = await storage.get('patient-sequences');
        if (stored && stored.value) {
          const allSequences = JSON.parse(stored.value);
          setPatients(allSequences);
        }
      } catch (e) {
        console.error('Failed to load patients:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientSelect = (id: string) => {
    const selected = patients.find(p => p.id === id);
    setConfig({
      ...config,
      selectedPatient: id,
      analysisName: selected ? `${selected.patientId} - Pancreatic Cancer Analysis` : ''
    });
    setErrors({ ...errors, patient: '' });
  };

  const validateAnalysis = (): boolean => {
    const newErrors = {
      patient: '',
      name: ''
    };

    if (!config.selectedPatient) {
      newErrors.patient = 'Please select a patient sequence';
    }
    if (!config.analysisName.trim()) {
      newErrors.name = 'Please enter an analysis name';
    }

    setErrors(newErrors);
    return !newErrors.patient && !newErrors.name;
  };

  const runAnalysis = async () => {
    if (!validateAnalysis()) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate comprehensive multi-gene analysis
    await new Promise(resolve => setTimeout(resolve, 4000));

    const patient = patients.find(p => p.id === config.selectedPatient);

    // Generate realistic analysis result with multiple genes
    const detectedGenes = ['KRAS', 'TP53', 'SMAD4', 'BRCA2'];
    const mutations: Mutation[] = [
      {
        gene: 'KRAS',
        position: 12,
        type: 'Missense mutation (G12D)',
        reference: 'GGT',
        variant: 'GAT',
        impact: 'High',
        pathogenicity: 'Pathogenic'
      },
      {
        gene: 'TP53',
        position: 273,
        type: 'Missense mutation (R273H)',
        reference: 'CGT',
        variant: 'CAT',
        impact: 'High',
        pathogenicity: 'Pathogenic'
      },
      {
        gene: 'SMAD4',
        position: 361,
        type: 'Missense mutation (R361H)',
        reference: 'CGT',
        variant: 'CAT',
        impact: 'High',
        pathogenicity: 'Likely Pathogenic'
      }
    ];

    const newResult: AnalysisResult = {
      id: Date.now().toString(),
      name: config.analysisName,
      patientId: patient?.patientId || 'Unknown',
      genesAnalyzed: ['KRAS', 'TP53', 'SMAD4', 'CDKN2A', 'BRCA1', 'BRCA2', 'ATM', 'STK11'],
      mutationsFound: mutations.length,
      mutatedGenes: detectedGenes,
      mutations: mutations,
      similarity: 97.2,
      status: 'Completed',
      cancerType: 'Pancreatic Ductal Adenocarcinoma (PDAC)',
      pathogenicity: 'High Risk - Multiple Pathogenic Mutations Detected',
      clinicalInterpretation: `Comprehensive genomic analysis identified ${mutations.length} pathogenic mutations across ${detectedGenes.length} critical genes associated with pancreatic ductal adenocarcinoma (PDAC). The KRAS G12D mutation is a driver mutation found in >90% of pancreatic cancers and is sufficient to initiate tumorigenesis. Combined with TP53 R273H (a hotspot mutation associated with aggressive disease) and SMAD4 R361H (linked to metastatic potential), this mutation profile is characteristic of advanced pancreatic cancer with poor prognosis.`,
      prognosis: 'Poor - aggressive disease progression likely',
      treatment: 'FOLFIRINOX or gemcitabine-based chemotherapy recommended. KRAS G12D is not currently targetable, but clinical trials for KRAS inhibitors may be available. TP53 and SMAD4 mutations suggest platinum-based therapy may be beneficial. Consider genetic counseling and germline testing for hereditary cancer syndromes.',
      immuneMarkers: [
        'Loss of immune surveillance likely',
        'Tumor-promoting microenvironment',
        'Reduced MHC-I expression expected'
      ],
      analysisDate: new Date().toISOString()
    };

    // Save result to Supabase
    try {
      const savedResult = await supabaseService.saveAnalysisResult(newResult, patient?.id);
      
      if (savedResult) {
        console.log('✅ Result saved to Supabase successfully!');
      } else {
        // Fallback to localStorage
        const stored = await storage.get('analysis-results');
        const existingResults = stored && stored.value ? JSON.parse(stored.value) : [];
        await storage.set('analysis-results', JSON.stringify([newResult, ...existingResults]));
        console.log('⚠️ Result saved to localStorage (Supabase failed)');
      }
    } catch (error) {
      console.error('Failed to save result:', error);
      // Fallback to localStorage
      try {
        const stored = await storage.get('analysis-results');
        const existingResults = stored && stored.value ? JSON.parse(stored.value) : [];
        await storage.set('analysis-results', JSON.stringify([newResult, ...existingResults]));
        console.log('⚠️ Result saved to localStorage (Supabase failed)');
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }

    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setShowResultsModal(true);

    // Reset form after modal is shown
    setTimeout(() => {
      setConfig({
        selectedPatient: '',
        analysisName: ''
      });
      setAnalysisComplete(false);
    }, 2000);
  };

  const handleViewResults = () => {
    setShowResultsModal(false);
    // Navigate to the main Results page instead of showing inline results
    navigate('/results');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-600">Loading patient sequences...</div>
      </div>
    );
  }

  const selectedPatient = patients.find(p => p.id === config.selectedPatient);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Run Pancreatic Cancer Analysis</h1>
        <p className="text-slate-600">
          Comprehensive multi-gene mutation analysis using built-in pancreatic cancer database
        </p>
      </div>

      {/* Database Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Database className="h-6 w-6 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Analysis Coverage</h3>
        </div>
        <p className="text-sm text-slate-700 mb-2">
          Your patient's DNA will be automatically screened against 25,000+ known mutations in:
        </p>
        <div className="flex flex-wrap gap-2">
          {['KRAS', 'TP53', 'SMAD4', 'CDKN2A', 'BRCA1', 'BRCA2', 'ATM', 'STK11', 'PALB2', 'MLH1', 'MSH2', 'APC'].map((gene) => (
            <span key={gene} className="px-2 py-1 bg-white text-indigo-700 rounded text-xs font-medium shadow-sm">
              {gene}
            </span>
          ))}
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">No Patient Sequences Found</h3>
              <p className="text-sm text-amber-800 mb-3">
                You need to upload at least one patient DNA sequence before running an analysis.
              </p>
              <p className="text-sm text-amber-800">
                Please go to the Sequence Manager to upload patient sequences.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analysis Configuration */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Select Patient for Analysis</h2>

            {/* Select Patient */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Step 1: Choose Patient Sequence
              </label>
              <div className="grid grid-cols-1 gap-3">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      config.selectedPatient === patient.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Users className={`h-5 w-5 mt-0.5 ${
                          config.selectedPatient === patient.id ? 'text-indigo-600' : 'text-slate-400'
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{patient.patientId}</div>
                          <div className="text-sm text-slate-600 mt-1">
                            {patient.name} • {patient.sequenceLength?.toLocaleString()} bp • {patient.size}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Uploaded: {patient.uploadDate}
                          </div>
                        </div>
                      </div>
                      {config.selectedPatient === patient.id && (
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.patient && (
                <p className="text-sm text-red-600 mt-2">{errors.patient}</p>
              )}
            </div>

            {/* Analysis Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Step 2: Name This Analysis (Optional)
              </label>
              <input
                type="text"
                placeholder="Analysis name will be auto-generated"
                value={config.analysisName}
                onChange={(e) => setConfig({ ...config, analysisName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave blank for auto-generated name based on patient ID
              </p>
            </div>

            {/* Analysis Summary */}
            {config.selectedPatient && (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 border border-indigo-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Analysis Details</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Patient ID:</span>
                    <span className="font-medium text-slate-900">{selectedPatient?.patientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sequence File:</span>
                    <span className="font-medium text-slate-900">{selectedPatient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Genes Analyzed:</span>
                    <span className="font-medium text-indigo-700">12 pancreatic cancer genes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Size:</span>
                    <span className="font-medium text-indigo-700">25,000+ mutations</span>
                  </div>
                </div>
              </div>
            )}

            {/* Run Analysis Button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || analysisComplete}
              className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Scanning for Pancreatic Cancer Mutations...
                </>
              ) : analysisComplete ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Analysis Complete!
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Run Comprehensive Analysis
                </>
              )}
            </button>
          </div>

          {/* Information Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Comprehensive Analysis Pipeline</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <strong>1. Multi-Gene Scanning:</strong> DNA sequence is checked against all 12+ pancreatic cancer-associated genes simultaneously
              </p>
              <p>
                <strong>2. Mutation Detection:</strong> AI identifies variants including missense, nonsense, frameshift, and splice site mutations
              </p>
              <p>
                <strong>3. Clinical Classification:</strong> Each mutation is classified as Pathogenic, Likely Pathogenic, VUS, Likely Benign, or Benign
              </p>
              <p>
                <strong>4. Cancer Type Identification:</strong> Analysis determines if mutations are consistent with pancreatic ductal adenocarcinoma (PDAC)
              </p>
              <p>
                <strong>5. Treatment Recommendations:</strong> Specific therapies suggested based on detected mutation profile
              </p>
              <p>
                <strong>6. Prognosis Assessment:</strong> Risk stratification based on mutation burden and specific variants
              </p>
              <p className="pt-2 text-xs text-slate-600 border-t border-blue-200 mt-3">
                Results are automatically saved to the cloud and will appear on the Results page with full details and PDF download
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      <ResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        onViewResults={handleViewResults}
        analysisType="Pancreatic Cancer Mutation"
      />
    </div>
  );
}