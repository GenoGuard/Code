// src/app/services/SupabaseService.tsx
import { supabase } from '../supabaseClient';

export interface PatientSequence {
  id: string;
  patientId: string;
  name: string;
  uploadDate: string;
  size: string;
  sequenceLength?: number;
  sequenceData?: string;
  gdriveFileId?: string;
}

export interface Mutation {
  gene: string;
  position: number;
  type: string;
  reference: string;
  variant: string;
  impact: string;
  pathogenicity: string;
}

export interface AnalysisResult {
  id: string;
  name: string;
  patientId: string;
  genesAnalyzed: string[];
  mutationsFound: number;
  mutatedGenes: string[];
  mutations: Mutation[];
  similarity: number;
  status: 'Completed' | 'Error';
  cancerType: string;
  pathogenicity: string;
  clinicalInterpretation: string;
  prognosis: string;
  treatment: string;
  immuneMarkers?: string[];
  gdrivePdfId?: string;
  analysisDate?: string;
}

class SupabaseService {
  // ============================================
  // PATIENT SEQUENCES
  // ============================================

  /**
   * Save a patient sequence to Supabase
   */
  async saveSequence(sequence: PatientSequence, sequenceData: string): Promise<PatientSequence | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('patient_sequences')
        .insert({
          user_id: user.id,
          patient_id: sequence.patientId,
          file_name: sequence.name,
          sequence_data: sequenceData,
          sequence_length: sequence.sequenceLength,
          file_size: sequence.size,
          upload_date: new Date().toISOString(),
          gdrive_file_id: sequence.gdriveFileId || null
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapSequenceFromDB(data);
    } catch (error) {
      console.error('Error saving sequence to Supabase:', error);
      return null;
    }
  }

  /**
   * Get all sequences for the current user
   */
  async getSequences(): Promise<PatientSequence[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('patient_sequences')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      return data.map(this.mapSequenceFromDB);
    } catch (error) {
      console.error('Error fetching sequences from Supabase:', error);
      return [];
    }
  }

  /**
   * Delete a sequence
   */
  async deleteSequence(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('patient_sequences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting sequence:', error);
      return false;
    }
  }

  /**
   * Update Google Drive file ID for a sequence
   */
  async updateSequenceGDriveId(id: string, gdriveFileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('patient_sequences')
        .update({ gdrive_file_id: gdriveFileId })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating GDrive ID:', error);
      return false;
    }
  }

  // ============================================
  // ANALYSIS RESULTS
  // ============================================

  /**
   * Save an analysis result to Supabase
   */
  async saveAnalysisResult(result: AnalysisResult, sequenceId?: string): Promise<AnalysisResult | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('analysis_results')
        .insert({
          user_id: user.id,
          sequence_id: sequenceId || null,
          analysis_name: result.name,
          patient_id: result.patientId,
          genes_analyzed: result.genesAnalyzed,
          mutations_found: result.mutationsFound,
          mutated_genes: result.mutatedGenes,
          mutations: result.mutations,
          similarity: result.similarity,
          status: result.status,
          cancer_type: result.cancerType,
          pathogenicity: result.pathogenicity,
          clinical_interpretation: result.clinicalInterpretation,
          prognosis: result.prognosis,
          treatment: result.treatment,
          immune_markers: result.immuneMarkers || [],
          gdrive_pdf_id: result.gdrivePdfId || null,
          analysis_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapResultFromDB(data);
    } catch (error) {
      console.error('Error saving analysis result:', error);
      return null;
    }
  }

  /**
   * Get all analysis results for the current user
   */
  async getAnalysisResults(): Promise<AnalysisResult[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', user.id)
        .order('analysis_date', { ascending: false });

      if (error) throw error;

      return data.map(this.mapResultFromDB);
    } catch (error) {
      console.error('Error fetching analysis results:', error);
      return [];
    }
  }

  /**
   * Delete an analysis result
   */
  async deleteAnalysisResult(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting analysis result:', error);
      return false;
    }
  }

  /**
   * Update Google Drive PDF ID for an analysis result
   */
  async updateResultGDrivePdfId(id: string, gdrivePdfId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .update({ gdrive_pdf_id: gdrivePdfId })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating GDrive PDF ID:', error);
      return false;
    }
  }

  // ============================================
  // DATA MIGRATION (localStorage → Supabase)
  // ============================================

  /**
   * Migrate localStorage sequences to Supabase
   */
  async migrateSequencesToSupabase(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    try {
      const localData = localStorage.getItem('patient-sequences');
      if (!localData) return { success, failed };

      const sequences: PatientSequence[] = JSON.parse(localData);

      for (const seq of sequences) {
        const result = await this.saveSequence(seq, seq.sequenceData || '');
        if (result) success++;
        else failed++;
      }

      console.log(`Migration complete: ${success} sequences migrated, ${failed} failed`);
    } catch (error) {
      console.error('Error migrating sequences:', error);
    }

    return { success, failed };
  }

  /**
   * Migrate localStorage results to Supabase
   */
  async migrateResultsToSupabase(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    try {
      const localData = localStorage.getItem('analysis-results');
      if (!localData) return { success, failed };

      const results: AnalysisResult[] = JSON.parse(localData);

      for (const result of results) {
        const saved = await this.saveAnalysisResult(result);
        if (saved) success++;
        else failed++;
      }

      console.log(`Migration complete: ${success} results migrated, ${failed} failed`);
    } catch (error) {
      console.error('Error migrating results:', error);
    }

    return { success, failed };
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Map database sequence to app format
   */
  private mapSequenceFromDB(data: any): PatientSequence {
    return {
      id: data.id,
      patientId: data.patient_id,
      name: data.file_name,
      uploadDate: new Date(data.upload_date).toLocaleDateString(),
      size: data.file_size,
      sequenceLength: data.sequence_length,
      sequenceData: data.sequence_data,
      gdriveFileId: data.gdrive_file_id
    };
  }

  /**
   * Map database result to app format
   */
  private mapResultFromDB(data: any): AnalysisResult {
    return {
      id: data.id,
      name: data.analysis_name,
      patientId: data.patient_id,
      genesAnalyzed: data.genes_analyzed || [],
      mutationsFound: data.mutations_found || 0,
      mutatedGenes: data.mutated_genes || [],
      mutations: data.mutations || [],
      similarity: parseFloat(data.similarity) || 0,
      status: data.status || 'Completed',
      cancerType: data.cancer_type || '',
      pathogenicity: data.pathogenicity || '',
      clinicalInterpretation: data.clinical_interpretation || '',
      prognosis: data.prognosis || '',
      treatment: data.treatment || '',
      immuneMarkers: data.immune_markers || [],
      gdrivePdfId: data.gdrive_pdf_id,
      analysisDate: data.analysis_date
    };
  }

  /**
   * Sync with localStorage as fallback
   */
  async syncWithLocalStorage(type: 'sequences' | 'results'): Promise<void> {
    try {
      if (type === 'sequences') {
        const sequences = await this.getSequences();
        localStorage.setItem('patient-sequences', JSON.stringify(sequences));
      } else {
        const results = await this.getAnalysisResults();
        localStorage.setItem('analysis-results', JSON.stringify(results));
      }
    } catch (error) {
      console.error('Error syncing with localStorage:', error);
    }
  }
}

export const supabaseService = new SupabaseService();
