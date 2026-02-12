-- GenoGuard Database Schema
-- Run this in your Supabase SQL Editor to create the necessary tables

-- ============================================
-- 1. PATIENT SEQUENCES TABLE
-- ============================================
CREATE TABLE patient_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    sequence_data TEXT NOT NULL, -- Store the actual DNA sequence
    sequence_length INTEGER,
    file_size TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gdrive_file_id TEXT, -- Google Drive file ID for sync
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_patient_sequences_user_id ON patient_sequences(user_id);
CREATE INDEX idx_patient_sequences_patient_id ON patient_sequences(patient_id);

-- ============================================
-- 2. ANALYSIS RESULTS TABLE
-- ============================================
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sequence_id UUID REFERENCES patient_sequences(id) ON DELETE CASCADE,
    analysis_name TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    
    -- Analysis metadata
    genes_analyzed TEXT[], -- Array of gene names
    mutations_found INTEGER DEFAULT 0,
    mutated_genes TEXT[], -- Array of mutated gene names
    similarity DECIMAL(5,2),
    status TEXT DEFAULT 'Completed',
    
    -- Clinical data
    cancer_type TEXT,
    pathogenicity TEXT,
    clinical_interpretation TEXT,
    prognosis TEXT,
    treatment TEXT,
    immune_markers TEXT[], -- Array of immune markers
    
    -- Mutations (stored as JSONB for flexibility)
    mutations JSONB, -- Array of mutation objects
    
    -- Google Drive integration
    gdrive_pdf_id TEXT, -- Google Drive PDF report ID
    
    -- Timestamps
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_analysis_results_sequence_id ON analysis_results(sequence_id);
CREATE INDEX idx_analysis_results_patient_id ON analysis_results(patient_id);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on both tables
ALTER TABLE patient_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Patient Sequences Policies
CREATE POLICY "Users can view their own sequences"
    ON patient_sequences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sequences"
    ON patient_sequences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sequences"
    ON patient_sequences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sequences"
    ON patient_sequences FOR DELETE
    USING (auth.uid() = user_id);

-- Analysis Results Policies
CREATE POLICY "Users can view their own results"
    ON analysis_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
    ON analysis_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results"
    ON analysis_results FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results"
    ON analysis_results FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_patient_sequences_updated_at
    BEFORE UPDATE ON patient_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_results_updated_at
    BEFORE UPDATE ON analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. SAMPLE QUERIES (for reference)
-- ============================================

-- Get all sequences for a user
-- SELECT * FROM patient_sequences WHERE user_id = auth.uid() ORDER BY upload_date DESC;

-- Get all analysis results for a user
-- SELECT * FROM analysis_results WHERE user_id = auth.uid() ORDER BY analysis_date DESC;

-- Get analysis results with sequence details
-- SELECT 
--     ar.*,
--     ps.patient_id,
--     ps.file_name,
--     ps.sequence_length
-- FROM analysis_results ar
-- JOIN patient_sequences ps ON ar.sequence_id = ps.id
-- WHERE ar.user_id = auth.uid()
-- ORDER BY ar.analysis_date DESC;

-- Count total sequences and analyses per user
-- SELECT 
--     COUNT(DISTINCT ps.id) as total_sequences,
--     COUNT(DISTINCT ar.id) as total_analyses
-- FROM patient_sequences ps
-- LEFT JOIN analysis_results ar ON ps.id = ar.sequence_id
-- WHERE ps.user_id = auth.uid();
