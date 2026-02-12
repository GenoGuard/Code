// src/app/services/PDFReportGenerator.tsx
import { jsPDF } from 'jspdf';
import { AnalysisResult } from './SupabaseService';

/**
 * PDF Report Generator for GenoGuard Analysis Results
 * Generates professional clinical-grade PDF reports
 */

class PDFReportGenerator {
  /**
   * Generate a complete PDF report from analysis results
   */
  generateReport(result: AnalysisResult): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // ============================================
    // HEADER
    // ============================================
    this.addHeader(doc, yPosition);
    yPosition += 40;

    // ============================================
    // PATIENT INFORMATION
    // ============================================
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient ID: ${result.patientId}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Analysis Name: ${result.name}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Analysis Date: ${result.analysisDate ? new Date(result.analysisDate).toLocaleDateString() : new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Status: ${result.status}`, margin, yPosition);
    yPosition += 15;

    // ============================================
    // SUMMARY BOX
    // ============================================
    doc.setFillColor(240, 240, 255);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
    
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin + 5, yPosition);
    
    yPosition += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Genes Analyzed: ${result.genesAnalyzed.length}`, margin + 5, yPosition);
    doc.text(`Mutations Detected: ${result.mutationsFound}`, pageWidth / 2, yPosition);
    
    yPosition += 6;
    doc.text(`Mutated Genes: ${result.mutatedGenes.join(', ')}`, margin + 5, yPosition);
    
    yPosition += 6;
    doc.setTextColor(200, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Risk Level: ${result.pathogenicity}`, margin + 5, yPosition);
    doc.setTextColor(0, 0, 0);
    
    yPosition += 20;

    // ============================================
    // CANCER TYPE
    // ============================================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Cancer Type Identified', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 0, 128);
    doc.text(result.cancerType, margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    // ============================================
    // DETECTED MUTATIONS
    // ============================================
    if (result.mutations && result.mutations.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Detected Mutations', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      result.mutations.forEach((mutation, idx) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(`${mutation.gene} - Codon ${mutation.position}`, margin + 5, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;

        doc.setFont('helvetica', 'normal');
        doc.text(`Type: ${mutation.type}`, margin + 10, yPosition);
        yPosition += 4;
        doc.text(`Change: ${mutation.reference} → ${mutation.variant}`, margin + 10, yPosition);
        yPosition += 4;
        
        doc.setTextColor(200, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Pathogenicity: ${mutation.pathogenicity}`, margin + 10, yPosition);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        yPosition += 8;
      });

      yPosition += 5;
    }

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // ============================================
    // CLINICAL INTERPRETATION
    // ============================================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Interpretation', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const interpretationLines = doc.splitTextToSize(
      result.clinicalInterpretation,
      pageWidth - 2 * margin
    );
    doc.text(interpretationLines, margin, yPosition);
    yPosition += interpretationLines.length * 5 + 10;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // ============================================
    // PROGNOSIS
    // ============================================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Prognosis', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 100, 0);
    const prognosisLines = doc.splitTextToSize(result.prognosis, pageWidth - 2 * margin);
    doc.text(prognosisLines, margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += prognosisLines.length * 5 + 10;

    // ============================================
    // TREATMENT RECOMMENDATIONS
    // ============================================
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Treatment Recommendations', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const treatmentLines = doc.splitTextToSize(result.treatment, pageWidth - 2 * margin);
    doc.text(treatmentLines, margin, yPosition);
    yPosition += treatmentLines.length * 5 + 10;

    // ============================================
    // TUMOR MICROENVIRONMENT
    // ============================================
    if (result.immuneMarkers && result.immuneMarkers.length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Tumor Microenvironment Analysis', margin, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      result.immuneMarkers.forEach(marker => {
        doc.text(`• ${marker}`, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 10;
    }

    // ============================================
    // GENES ANALYZED
    // ============================================
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Comprehensive Gene Panel (${result.genesAnalyzed.length} genes)`, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const genesPerLine = 8;
    for (let i = 0; i < result.genesAnalyzed.length; i += genesPerLine) {
      const genesChunk = result.genesAnalyzed.slice(i, i + genesPerLine).join(', ');
      doc.text(genesChunk, margin, yPosition);
      yPosition += 4;
    }
    yPosition += 10;

    // ============================================
    // DISCLAIMER
    // ============================================
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(255, 240, 240);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
    
    yPosition += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLAIMER', margin + 5, yPosition);
    
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const disclaimerText = doc.splitTextToSize(
      'This analysis is for research purposes only and should not be used as the sole basis for clinical decision-making. All results should be confirmed by a certified clinical laboratory (CLIA-certified) and reviewed by a qualified healthcare professional. Treatment decisions should be made in consultation with an oncologist and multidisciplinary tumor board.',
      pageWidth - 2 * margin - 10
    );
    doc.text(disclaimerText, margin + 5, yPosition);

    // ============================================
    // FOOTER ON ALL PAGES
    // ============================================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      this.addFooter(doc, i, totalPages);
    }

    return doc.output('blob');
  }

  /**
   * Add header to the PDF
   */
  private addHeader(doc: jsPDF, yPosition: number): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Logo area (if you have a logo)
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 30, 'F');

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('GenoGuard', margin, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Pancreatic Cancer Mutation Analysis Report', margin, 23);

    // Reset text color
    doc.setTextColor(0, 0, 0);
  }

  /**
   * Add footer to the PDF
   */
  private addFooter(doc: jsPDF, pageNumber: number, totalPages: number): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    
    // Page number
    doc.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Generated date
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      pageHeight - 10
    );

    // GenoGuard watermark
    doc.text(
      'GenoGuard Analysis Platform',
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  /**
   * Download the PDF
   */
  downloadReport(result: AnalysisResult): void {
    try {
      const blob = this.generateReport(result);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GenoGuard_${result.patientId}_${result.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  /**
   * Get PDF blob for upload
   */
  getPDFBlob(result: AnalysisResult): Blob {
    return this.generateReport(result);
  }
}

export const pdfReportGenerator = new PDFReportGenerator();