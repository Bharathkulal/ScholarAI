import React, { useState } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { FolderOpen, FileCheck, FileWarning, Eye, Trash2, Plus, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_DOCUMENTS = [
  { id: 1, name: 'Class 12 Marksheet.pdf', type: 'Academic transcript', size: '1.4 MB', status: 'verified' },
  { id: 2, name: 'Income Certificate 2026.pdf', type: 'Financial statement', size: '890 KB', status: 'verified' },
  { id: 3, name: 'Category Certificate.pdf', type: 'Demographic identity', size: '2.1 MB', status: 'pending' },
];

const Documents = () => {
  const [docs, setDocs] = useState(MOCK_DOCUMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newDocName || !newDocType) {
      toast.error('Please specify a filename and document classification.');
      return;
    }
    const uploaded = {
      id: Date.now(),
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      type: newDocType,
      size: '420 KB',
      status: 'pending',
    };
    setDocs([...docs, uploaded]);
    setIsModalOpen(false);
    setNewDocName('');
    setNewDocType('');
    toast.success('Document uploaded to vault successfully!');
  };

  const handleDelete = (id) => {
    setDocs(docs.filter((d) => d.id !== id));
    toast.success('Document deleted successfully.');
  };

  return (
    <div className="space-y-6 select-none">
      <PageTitle
        title="Document Vault"
        description="Organize and store your transcripts, certificates, and income records securely in our encrypted cloud vault."
        action={
          <Button onClick={() => setIsModalOpen(true)} variant="primary" className="!py-2 !text-xs">
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {docs.map((doc) => (
          <Card key={doc.id} className="p-4 hover:shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-105 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                  <FolderOpen className="w-5.5 h-5.5 text-primary-600" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                    {doc.name}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-805">
                <Badge variant={doc.status === 'verified' ? 'success' : 'warning'}>
                  {doc.status === 'verified' ? (
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FileWarning className="w-3 h-3" /> Verification Pending
                    </span>
                  )}
                </Badge>

                <div className="flex gap-2">
                  <Button variant="ghost" className="!p-1.5 min-h-0" title="View Document">
                    <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!p-1.5 min-h-0"
                    title="Delete Document"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </Button>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Name"
            placeholder="e.g. Income Certificate 2026"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            required
          />

          <Select
            label="Document Classification"
            value={newDocType}
            onChange={(e) => setNewDocType(e.target.value)}
            options={[
              { label: 'Academic Transcript', value: 'Academic transcript' },
              { label: 'Financial Statement', value: 'Financial statement' },
              { label: 'Demographic Identity', value: 'Demographic identity' },
              { label: 'Other/Supporting Certificate', value: 'Supporting certificate' },
            ]}
            required
          />

          <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag or select PDF/Image</span>
            <span className="text-[10px] text-slate-400 mt-1">Maximum size limit 5MB</span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload to Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Documents;
