import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Trash2, AlertTriangle, Activity, Pill, TrendingDown, Download, FileText } from 'lucide-react';
import React from 'react';
import { supabaseService, AnalysisResult } from '../services/SupabaseService';
import { pdfReportGenerator } from '../services/PDFReportGenerator';

interface Mutation {
  gene: string;
  position: number;
  type: string;
  reference: string;
  variant: string;
  impact: string;
  pathogenicity: string;
}

// Storage helper
const storage = {
  async get(key: string) {
    if (typeof window !== 'undefined' && window.storage) {
      try {
        return await window.storage.get(key);
      } catch (e) {
        return null;
      }
    }
    const item = localStorage.getItem(key);
    return item ? { key, value: item, shared: false } : null;
  },

  async set(key: string, value: string) {
    if (typeof window !== 'undefined' && window.storage) {
      try {
        return await window.storage.set(key, value);
      } catch (e) {
        console.error('Storage API failed:', e);
      }
    }
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  }
};

export function Results() {
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      // Try to load from Supabase first
      const supabaseResults = await supabaseService.getAnalysisResults();
      
      if (supabaseResults && supabaseResults.length > 0) {
        setResults(supabaseResults);
        // Sync to localStorage as backup
        await storage.set('analysis-results', JSON.stringify(supabaseResults));
      } else {
        // Fallback to localStorage
        const stored = await storage.get('analysis-results');
        if (stored && stored.value) {
          const parsedResults = JSON.parse(stored.value);
          
          // Check if results have the new structure (has cancerType field)
          if (parsedResults.length > 0 && !parsedResults[0].cancerType) {
            // Old format detected - clear it
            console.log('Old result format detected, clearing...');
            await storage.set('analysis-results', JSON.stringify([]));
            setResults([]);
          } else {
            setResults(parsedResults);
          }
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
      // If there's an error, try localStorage
      try {
        const stored = await storage.get('analysis-results');
        if (stored && stored.value) {
          const parsedResults = JSON.parse(stored.value);
          setResults(parsedResults);
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResults = async (newResults: AnalysisResult[]) => {
    try {
      await storage.set('analysis-results', JSON.stringify(newResults));
      setResults(newResults);
    } catch (error) {
      console.error('Failed to save results:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Try to delete from Supabase
      const deleted = await supabaseService.deleteAnalysisResult(id);
      
      if (deleted) {
        // Successfully deleted from cloud
        await loadResults();
      } else {
        // Fallback to localStorage delete
        const newResults = results.filter((result) => result.id !== id);
        await saveResults(newResults);
      }
      
      if (expandedResult === id) {
        setExpandedResult(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Fallback to localStorage
      const newResults = results.filter((result) => result.id !== id);
      await saveResults(newResults);
    } finally {
      setDeleteConfirm(null);
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (result: AnalysisResult) => {
    try {
      setDownloadingPdf(result.id);
      
      // Generate and download PDF
      pdfReportGenerator.downloadReport(result);
      
      // Optional: Upload to Google Drive would go here
      // const pdfBlob = pdfReportGenerator.getPDFBlob(result);
      // await googleDriveService.uploadPDFReport(...)
      
      // Clear downloading state after a brief delay
      setTimeout(() => setDownloadingPdf(null), 1000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
      setDownloadingPdf(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg text-slate-900 font-semibold">Delete Analysis Result?</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this result? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis Results</h1>
          <p className="text-slate-600">
            Comprehensive pancreatic cancer mutation analysis with clinical interpretation
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center space-y-4">
          <FileText className="h-16 w-16 text-slate-300 mx-auto" />
          <p className="text-slate-600">
            No results yet. Run an analysis to see results here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Result Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{result.name}</h3>
                      {result.status === 'Completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium">Patient: {result.patientId}</span>
                      <span>•</span>
                      <span>{result.genesAnalyzed?.length || 0} genes analyzed</span>
                      <span>•</span>
                      <span className={result.mutationsFound > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                        {result.mutationsFound} mutation{result.mutationsFound !== 1 ? 's' : ''} found
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* PDF Download Button */}
                    <button
                      onClick={() => handleDownloadPDF(result)}
                      disabled={downloadingPdf === result.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-green-400"
                      title="Download PDF Report"
                    >
                      {downloadingPdf === result.id ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          PDF
                        </>
                      )}
                    </button>
                    
                    {/* View Details Button */}
                    <button
                      onClick={() => toggleExpand(result.id)}
                      className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {expandedResult === result.id ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          View Details
                        </>
                      )}
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteConfirm(result.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete result"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Summary Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                    {result.cancerType}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    result.pathogenicity?.includes('High')
                      ? 'bg-red-100 text-red-800'
                      : result.pathogenicity?.includes('Moderate')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {result.pathogenicity}
                  </span>
                  {result.mutatedGenes?.map((gene) => (
                    <span key={gene} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                      {gene}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedResult === result.id && (
                <div className="p-6 bg-slate-50 space-y-6">
                  {/* Cancer Type & Pathogenicity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-lg border-l-4 border-purple-500 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-slate-900">Cancer Type Identified</h4>
                      </div>
                      <p className="text-lg font-bold text-purple-700">{result.cancerType}</p>
                      <p className="text-sm text-slate-600 mt-2">
                        The detected mutation pattern is characteristic of this specific cancer type
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-l-4 border-red-500 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-slate-900">Pathogenicity Assessment</h4>
                      </div>
                      <p className="text-lg font-bold text-red-700">{result.pathogenicity}</p>
                      <p className="text-sm text-slate-600 mt-2">
                        Based on clinical databases (COSMIC, ClinVar, TCGA)
                      </p>
                    </div>
                  </div>

                  {/* Detected Mutations */}
                  {result.mutations && result.mutations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                          {result.mutations.length}
                        </span>
                        Pathogenic Mutations Detected
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.mutations.map((mutation, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-sm"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-lg font-bold text-indigo-700">{mutation.gene}</span>
                                <span className="text-sm text-slate-600 ml-2">Codon {mutation.position}</span>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                {mutation.pathogenicity}
                              </span>
                            </div>
                            <p className="text-sm text-slate-900 font-medium mb-1">
                              {mutation.type}
                            </p>
                            <p className="text-xs text-slate-600 font-mono mb-2">
                              {mutation.reference} → {mutation.variant}
                            </p>
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-700">
                                <strong>Clinical Significance:</strong> This mutation is known to cause pancreatic cancer by disrupting normal cell function and promoting uncontrolled growth.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clinical Interpretation */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Clinical Interpretation
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                        {result.clinicalInterpretation}
                      </p>
                    </div>
                  </div>

                  {/* Prognosis */}
                  <div className="bg-white p-5 rounded-lg border-l-4 border-amber-500 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="h-5 w-5 text-amber-600" />
                      <h4 className="font-semibold text-slate-900">Prognosis</h4>
                    </div>
                    <p className="text-slate-800 font-medium mb-2">{result.prognosis}</p>
                    <p className="text-sm text-slate-600">
                      Prognosis is based on the specific mutations detected, tumor burden, and known clinical outcomes for similar mutation profiles.
                    </p>
                  </div>

                  {/* Treatment Recommendations */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Pill className="h-5 w-5 text-green-700" />
                      <h4 className="font-semibold text-green-900">Treatment Recommendations</h4>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {result.treatment}
                    </p>
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-xs text-green-700">
                        <strong>Note:</strong> These recommendations are based on current clinical guidelines and mutation profiles. Treatment decisions should be made in consultation with an oncologist and multidisciplinary tumor board.
                      </p>
                    </div>
                  </div>

                  {/* Tumor Microenvironment */}
                  {result.immuneMarkers && result.immuneMarkers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Tumor Microenvironment Analysis
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.immuneMarkers.map((marker, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                          >
                            {marker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Genes Analyzed */}
                  {result.genesAnalyzed && result.genesAnalyzed.length > 0 && (
                    <div className="bg-slate-100 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">
                        Comprehensive Gene Panel Analyzed ({result.genesAnalyzed.length} genes)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.genesAnalyzed.map((gene) => (
                          <span
                            key={gene}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              result.mutatedGenes?.includes(gene)
                                ? 'bg-red-200 text-red-900'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {gene} {result.mutatedGenes?.includes(gene) && '✗'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Understanding Your Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="space-y-2">
            <p>
              <strong>Pathogenic:</strong> Mutation is known to cause cancer and has been validated in clinical studies
            </p>
            <p>
              <strong>Likely Pathogenic:</strong> Strong evidence suggesting the mutation contributes to cancer development
            </p>
            <p>
              <strong>High Risk:</strong> Multiple pathogenic mutations detected, indicating aggressive disease
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Cancer Type:</strong> Specific type of cancer (PDAC = Pancreatic Ductal Adenocarcinoma)
            </p>
            <p>
              <strong>Prognosis:</strong> Expected disease course based on mutation profile
            </p>
            <p>
              <strong>Treatment:</strong> Recommended therapies based on detected mutations
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-slate-600">
            <strong>Disclaimer:</strong> This analysis is for research purposes only and should not be used as the sole basis for clinical decision-making. All results should be confirmed by a certified clinical laboratory and reviewed by a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}