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
  { id: 1, name: 'Official Transcript 2026.pdf', type: 'Academic transcript', size: '1.4 MB', status: 'verified' },
  { id: 2, name: 'Income Tax Return 2026.pdf', type: 'Financial statement', size: '890 KB', status: 'verified' },
  { id: 3, name: 'Citizenship Identity Card.pdf', type: 'Demographic identity', size: '2.1 MB', status: 'pending' },
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
    toast.success('Document uploaded to encrypted vault successfully!');
  };

  const handleDelete = (id) => {
    setDocs(docs.filter((d) => d.id !== id));
    toast.success('Document deleted successfully.');
  };

  return (
    <div className="space-y-6 select-none">
      <PageTitle
        title="Encrypted Document Vault"
        description="Organize and store transcripts, recommendation letters, and financial certificates in your secure cloud vault."
        action={
          <Button onClick={() => setIsModalOpen(true)} variant="primary" className="!py-2.5 !px-5 text-xs font-heading uppercase tracking-wider">
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {docs.map((doc) => (
          <Card key={doc.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#CD0000] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(205,0,0,0.25)]">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-base font-extrabold font-heading text-[#111111] leading-snug">
                    {doc.name}
                  </h5>
                  <p className="text-xs text-[#666666] font-medium mt-0.5">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EEEEEE]">
                <Badge variant={doc.status === 'verified' ? 'success' : 'warning'}>
                  {doc.status === 'verified' ? (
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FileWarning className="w-3.5 h-3.5" /> Verification Pending
                    </span>
                  )}
                </Badge>

                <div className="flex gap-2">
                  <Button variant="secondary" className="!p-2 min-h-0" title="View Document">
                    <Eye className="w-4 h-4 text-[#111111]" />
                  </Button>
                  <Button
                    variant="danger"
                    className="!p-2 min-h-0"
                    title="Delete Document"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document to Vault">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Name"
            placeholder="e.g. Official Transcript 2026"
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
              { label: 'Supporting Certificate', value: 'Supporting certificate' },
            ]}
            required
          />

          <div className="p-8 border-2 border-dashed border-[#DDDDDD] rounded-[16px] flex flex-col items-center justify-center text-center bg-[#EFEDE6] hover:bg-[#E4E0D5] transition-colors duration-200 cursor-pointer">
            <Upload className="w-8 h-8 text-[#CD0000] mb-2" />
            <span className="text-xs font-bold font-heading text-[#111111] uppercase tracking-wider">Drag or select PDF/Image</span>
            <span className="text-[10px] text-[#666666] mt-1">Encrypted upload limit: 5MB</span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EEEEEE]">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload File
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Documents;
