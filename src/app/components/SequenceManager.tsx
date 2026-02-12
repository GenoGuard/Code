import { useState, useEffect } from 'react';
import { Upload, Users, FileText, Trash2, AlertCircle, Database } from 'lucide-react';
import { supabaseService, PatientSequence } from '../services/SupabaseService';
import { googleDriveService } from '../services/GoogleDriveService';

// Storage helper - UPDATED to use Supabase first, localStorage as fallback
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

export function SequenceManager() {
  const [sequences, setSequences] = useState<PatientSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState<any>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      // Try to load from Supabase first
      const supabaseSequences = await supabaseService.getSequences();
      
      if (supabaseSequences && supabaseSequences.length > 0) {
        setSequences(supabaseSequences);
        // Sync to localStorage as backup
        await storage.set('patient-sequences', JSON.stringify(supabaseSequences));
      } else {
        // Fallback to localStorage
        const stored = await storage.get('patient-sequences');
        if (stored && stored.value) {
          setSequences(JSON.parse(stored.value));
        }
      }
    } catch (error) {
      console.error('Error loading sequences:', error);
      // Try localStorage as final fallback
      try {
        const stored = await storage.get('patient-sequences');
        if (stored && stored.value) {
          setSequences(JSON.parse(stored.value));
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;

        if (file.name.endsWith('.fasta') || file.name.endsWith('.fa')) {
          const sequences = text.split('>').filter(s => s.trim());
          const sequenceData = sequences.map(s => s.split('\n').slice(1).join('')).join('');
          setFileData({
            content: text,
            sequenceLength: sequenceData.length,
            size: formatFileSize(file.size)
          });
        } else if (file.name.endsWith('.txt')) {
          const cleanSequence = text.replace(/\s/g, '').toUpperCase();
          setFileData({
            content: text,
            sequenceLength: cleanSequence.length,
            size: formatFileSize(file.size)
          });
        } else {
          setUploadError('Please upload a .fasta, .fa, or .txt file containing DNA sequence');
          return;
        }
      } catch (error) {
        setUploadError('Error reading file. Please try again.');
      }
    };
    reader.readAsText(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!fileData || !fileName) {
      setUploadError('Please upload a DNA sequence file');
      return;
    }

    if (!patientId.trim()) {
      setUploadError('Please enter a patient/sample ID');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setIsLoading(true);

    try {
      const newSequence: PatientSequence = {
        id: Date.now().toString(),
        patientId: patientId.trim(),
        name: fileName,
        uploadDate: new Date().toLocaleDateString(),
        size: fileData.size,
        sequenceLength: fileData.sequenceLength,
        sequenceData: fileData.content
      };

      // Save to Supabase
      const savedSequence = await supabaseService.saveSequence(newSequence, fileData.content);
      
      if (savedSequence) {
        setUploadSuccess('✅ Sequence saved to cloud successfully!');
        
        // Optional: Upload to Google Drive
        try {
          const gdriveFile = await googleDriveService.uploadSequenceFile(
            fileName,
            fileData.content,
            patientId.trim()
          );
          
          if (gdriveFile) {
            await supabaseService.updateSequenceGDriveId(savedSequence.id, gdriveFile.id);
            setUploadSuccess('✅ Sequence saved to cloud and Google Drive!');
          }
        } catch (gdriveError) {
          console.log('Google Drive upload skipped:', gdriveError);
          // Don't show error - Drive sync is optional
        }

        // Reload sequences
        await loadSequences();
        
        // Reset form
        setPatientId('');
        setFileName('');
        setFileData(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(''), 3000);
      } else {
        // Fallback to localStorage
        const localSequences = [...sequences, newSequence];
        await storage.set('patient-sequences', JSON.stringify(localSequences));
        setSequences(localSequences);
        setUploadSuccess('✅ Sequence saved locally (cloud sync failed)');
        
        // Reset form
        setPatientId('');
        setFileName('');
        setFileData(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to save sequence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Try to delete from Supabase
      const deleted = await supabaseService.deleteSequence(id);
      
      if (deleted) {
        // Successfully deleted from cloud
        await loadSequences();
      } else {
        // Fallback to localStorage delete
        const newSequences = sequences.filter(seq => seq.id !== id);
        await storage.set('patient-sequences', JSON.stringify(newSequences));
        setSequences(newSequences);
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Fallback to localStorage
      const newSequences = sequences.filter(seq => seq.id !== id);
      await storage.set('patient-sequences', JSON.stringify(newSequences));
      setSequences(newSequences);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && sequences.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-600">Loading sequences...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Sequence Upload</h1>
        <p className="text-slate-600">
          Upload patient DNA sequences for pancreatic cancer mutation analysis
        </p>
      </div>

      {/* Reference Database Info Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Database className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Built-in Reference Database
            </h3>
            <p className="text-sm text-slate-700 mb-3">
              GenoGuard includes a comprehensive pancreatic cancer mutation database with 25,000+ known mutations across all major genes:
            </p>
            <div className="flex flex-wrap gap-2">
              {['KRAS', 'TP53', 'SMAD4', 'CDKN2A', 'BRCA1', 'BRCA2', 'ATM', 'STK11'].map((gene) => (
                <span key={gene} className="px-3 py-1 bg-white text-indigo-700 rounded-lg text-sm font-medium shadow-sm">
                  {gene}
                </span>
              ))}
              <span className="px-3 py-1 bg-white text-indigo-700 rounded-lg text-sm font-medium shadow-sm">
                +12 more genes
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3">
              Simply upload patient DNA sequences - analysis automatically checks against the entire database
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Upload Patient DNA Sequence</h2>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700">{uploadSuccess}</span>
          </div>
        )}

        {/* Patient ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Patient/Sample ID
          </label>
          <input
            type="text"
            placeholder="e.g., P001, Sample-2024-001, Patient-John-Doe"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Enter a unique identifier for this patient or sample
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            DNA Sequence File
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept=".fasta,.fa,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <div className="text-sm text-slate-600">
                {fileName ? (
                  <div className="space-y-2">
                    <div className="text-indigo-600 font-medium">{fileName}</div>
                    {fileData && (
                      <div className="text-xs text-slate-500">
                        {fileData.sequenceLength?.toLocaleString()} base pairs • {fileData.size}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="font-medium">Click to upload DNA sequence</div>
                    <div className="text-xs mt-1">FASTA (.fasta, .fa) or TXT files</div>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-700">{uploadError}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!fileData || !patientId.trim() || isLoading}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Uploading...' : 'Upload Patient Sequence'}
        </button>
      </div>

      {/* Uploaded Sequences Table */}
      {sequences.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Uploaded Patient Sequences</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-slate-700 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-slate-700 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-slate-700 uppercase tracking-wider">
                    Sequence Length
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-slate-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-slate-700 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sequences.map((seq) => (
                  <tr key={seq.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-slate-900">{seq.patientId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-900">{seq.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {seq.sequenceLength?.toLocaleString() || 'N/A'} bp
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {seq.size}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {seq.uploadDate}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(seq.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete sequence"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How to Upload DNA Sequences</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <div>
            <p className="font-medium text-slate-900">FASTA Format (.fasta, .fa):</p>
            <pre className="mt-2 p-3 bg-slate-800 text-green-400 rounded text-xs overflow-x-auto">
{`>Patient_001_KRAS
ATGACTGAATATAAACTTGTGGTAGTTGGAGCTGGTGGCGTAGGCAAGAG
TGCCTTGACGATACAGCTAATTCAGAATCATTTTGTGGACGAATATGATC`}
            </pre>
          </div>
          <div>
            <p className="font-medium text-slate-900 mt-3">Plain Text Format (.txt):</p>
            <pre className="mt-2 p-3 bg-slate-800 text-green-400 rounded text-xs overflow-x-auto">
{`ATGACTGAATATAAACTTGTGGTAGTTGGAGCTGGTGGCGTAGGCAAGAG
TGCCTTGACGATACAGCTAATTCAGAATCATTTTGTGGACGAATATGATC`}
            </pre>
          </div>
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-slate-600">
              <strong>Note:</strong> GenoGuard will automatically scan your patient's DNA sequence against the built-in database containing 25,000+ known pancreatic cancer mutations across KRAS, TP53, SMAD4, BRCA1/2, and other critical genes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}