import React, { useState } from 'react';
import { FileText, Upload, Trash2, CheckCircle2, AlertCircle, Clock, ExternalLink, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const DocumentUploadCard = ({
  typeKey,
  label,
  description,
  required = false,
  documentData,
  onUpload,
  onDelete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10 MB.');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file, typeKey, label);
      toast.success(`${label} uploaded successfully!`);
    } catch (err) {
      toast.error(err.message || `Failed to upload ${label}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!documentData) return;
    setDeleting(true);
    try {
      await onDelete(documentData.id);
      toast.success(`${label} removed.`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete document.');
    } finally {
      setDeleting(false);
    }
  };

  const renderStatusBadge = () => {
    if (!documentData) return null;
    switch (documentData.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span
            title={documentData.rejection_reason || 'Document rejected by admin'}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-red-100 text-red-800 border border-red-200"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Verification
          </span>
        );
    }
  };

  const apiBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000';

  return (
    <div className="p-5 rounded-[20px] bg-white border border-[#DDDDDD] shadow-soft hover:shadow-lift transition-all duration-200 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F4F4F0] text-[#111111]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold font-heading text-[#111111] flex items-center gap-1.5">
                {label}
                {required && <span className="text-[#CD0000] text-xs">*</span>}
              </h4>
              <p className="text-[11px] text-[#666666] font-sans">{description}</p>
            </div>
          </div>
          {renderStatusBadge()}
        </div>

        {documentData?.status === 'rejected' && documentData?.rejection_reason && (
          <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            <strong>Reason for rejection:</strong> {documentData.rejection_reason}
          </div>
        )}
      </div>

      {documentData ? (
        <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
          <div className="text-xs text-[#666666] truncate max-w-[200px]">
            <span className="font-semibold text-[#111111] block truncate">{documentData.file_name}</span>
            <span>{roundKb(documentData.file_size)} • Uploaded {documentData.upload_date}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`${apiBaseUrl}${documentData.file_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#F4F4F0] hover:bg-[#EEEEEE] text-[#111111] transition-colors"
              title="Preview / Download Document"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
              title="Delete Document"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <label className="w-full h-11 px-4 rounded-[14px] bg-[#F4F4F0] hover:bg-[#EFEDE6] border border-dashed border-[#CCCCCC] hover:border-[#111111] text-[#111111] font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#CD0000]" />
                Select File (PDF, PNG, JPG max 10MB)
              </>
            )}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

const roundKb = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};
