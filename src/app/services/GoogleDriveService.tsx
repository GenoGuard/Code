// src/app/services/GoogleDriveService.tsx

/**
 * Google Drive Integration Service
 * Handles auto-syncing DNA sequences and PDF reports to user's Google Drive
 */

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
}

class GoogleDriveService {
  private accessToken: string | null = null;
  private readonly FOLDER_NAME = 'GenoGuard';
  private readonly SEQUENCES_FOLDER = 'Sequences';
  private readonly RESULTS_FOLDER = 'Results';

  /**
   * Initialize Google Drive API with OAuth token
   */
  async initialize(accessToken: string): Promise<void> {
    this.accessToken = accessToken;
  }

  /**
   * Check if user is authenticated with Google
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Get or create the GenoGuard folder structure
   * Returns: { rootFolderId, sequencesFolderId, resultsFolderId }
   */
  async ensureFolderStructure(): Promise<{
    rootFolderId: string;
    sequencesFolderId: string;
    resultsFolderId: string;
  }> {
    if (!this.accessToken) throw new Error('Not authenticated with Google Drive');

    try {
      // Check if GenoGuard root folder exists
      let rootFolderId = await this.findFolder(this.FOLDER_NAME);
      
      if (!rootFolderId) {
        rootFolderId = await this.createFolder(this.FOLDER_NAME, 'root');
      }

      // Check if Sequences subfolder exists
      let sequencesFolderId = await this.findFolder(this.SEQUENCES_FOLDER, rootFolderId);
      
      if (!sequencesFolderId) {
        sequencesFolderId = await this.createFolder(this.SEQUENCES_FOLDER, rootFolderId);
      }

      // Check if Results subfolder exists
      let resultsFolderId = await this.findFolder(this.RESULTS_FOLDER, rootFolderId);
      
      if (!resultsFolderId) {
        resultsFolderId = await this.createFolder(this.RESULTS_FOLDER, rootFolderId);
      }

      return { rootFolderId, sequencesFolderId, resultsFolderId };
    } catch (error) {
      console.error('Error ensuring folder structure:', error);
      throw error;
    }
  }

  /**
   * Upload a DNA sequence file to Google Drive
   */
  async uploadSequenceFile(
    fileName: string,
    sequenceData: string,
    patientId: string
  ): Promise<GoogleDriveFile | null> {
    try {
      const { sequencesFolderId } = await this.ensureFolderStructure();

      // Create FASTA file content
      const fastaContent = `>${patientId}_${fileName}\n${sequenceData}`;
      const blob = new Blob([fastaContent], { type: 'text/plain' });

      // Prepare file metadata
      const metadata = {
        name: fileName.endsWith('.fasta') ? fileName : `${fileName}.fasta`,
        mimeType: 'text/plain',
        parents: [sequencesFolderId]
      };

      // Upload file using multipart upload
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', blob);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const file = await response.json();
      
      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
      };
    } catch (error) {
      console.error('Error uploading sequence to Google Drive:', error);
      return null;
    }
  }

  /**
   * Upload a PDF report to Google Drive
   */
  async uploadPDFReport(
    fileName: string,
    pdfBlob: Blob,
    patientId: string
  ): Promise<GoogleDriveFile | null> {
    try {
      const { resultsFolderId } = await this.ensureFolderStructure();

      // Prepare file metadata
      const metadata = {
        name: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
        mimeType: 'application/pdf',
        parents: [resultsFolderId]
      };

      // Upload file using multipart upload
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', pdfBlob);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const file = await response.json();
      
      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
      };
    } catch (error) {
      console.error('Error uploading PDF to Google Drive:', error);
      return null;
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      return false;
    }
  }

  /**
   * List files in a folder
   */
  async listFilesInFolder(folderId: string): Promise<GoogleDriveFile[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,webViewLink)`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Open GenoGuard folder in browser
   */
  async openGenoGuardFolder(): Promise<void> {
    try {
      const { rootFolderId } = await this.ensureFolderStructure();
      const url = `https://drive.google.com/drive/folders/${rootFolderId}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Find a folder by name
   */
  private async findFolder(folderName: string, parentId?: string): Promise<string | null> {
    try {
      const query = parentId
        ? `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
        : `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.files && data.files.length > 0 ? data.files[0].id : null;
    } catch (error) {
      console.error('Error finding folder:', error);
      return null;
    }
  }

  /**
   * Create a new folder
   */
  private async createFolder(folderName: string, parentId: string): Promise<string> {
    try {
      const metadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId]
      };

      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });

      if (!response.ok) {
        throw new Error(`Folder creation failed: ${response.statusText}`);
      }

      const folder = await response.json();
      return folder.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileId: string): Promise<GoogleDriveFile | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,webViewLink`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get file metadata: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
