import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import {
  User,
  GraduationCap,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Award,
} from 'lucide-react';
import { getStudentProfileApi } from '../../services/student';
import { submitApplicationApi } from '../../services/applications';
import toast from 'react-hot-toast';

export const ApplicationWizardModal = ({ isOpen, onClose, scholarship, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmittedApp(null);
      setDeclarationAccepted(false);
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getStudentProfileApi();
      if (res && res.profile) {
        setProfile(res.profile);
      }
    } catch (err) {
      toast.error('Could not load student profile for application.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmitApplication = async () => {
    if (!declarationAccepted) {
      toast.error('Please accept the declaration before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        scholarship_id: scholarship._id,
        scholarship_slug: scholarship.slug,
        scholarship_title: scholarship.title,
        scholarship_provider: scholarship.provider,
        status: 'submitted',
        declaration_accepted: true,
      };

      const res = await submitApplicationApi(payload);
      if (res && res.data && res.data.application) {
        setSubmittedApp(res.data.application);
        setStep(6); // Confirmation screen
        toast.success(`Application ${res.data.application.application_number} submitted successfully!`);
        if (onSuccess) onSuccess(res.data.application);
      }
    } catch (err) {
      toast.error(err.message || 'Application submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!scholarship) return null;

  const totalSteps = 6;
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Scholarship Application Wizard`}>
      <div className="space-y-6 pt-1 select-none">
        
        {/* Step Indicator & Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-heading font-extrabold uppercase">
            <span className="text-[#CD0000]">Step {step} of 6</span>
            <span className="text-[#666666]">
              {step === 1 && 'Confirm Personal Profile'}
              {step === 2 && 'Confirm Academic Details'}
              {step === 3 && 'Attached Documents Check'}
              {step === 4 && 'Legal Declaration'}
              {step === 5 && 'Final Audit Review'}
              {step === 6 && 'Submission Confirmation'}
            </span>
          </div>
          <ProgressBar value={progressPercent} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#CD0000]" />
            <span className="text-xs font-heading font-bold text-[#666666]">Verifying Student Data...</span>
          </div>
        ) : (
          <div>
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD] space-y-2 text-xs">
                  <h4 className="font-heading font-extrabold text-[#111111] uppercase flex items-center gap-2">
                    <User className="w-4 h-4 text-[#CD0000]" />
                    Student Personal Information
                  </h4>
                  <p>Full Name: <strong>{profile?.personal?.full_name || 'Student User'}</strong></p>
                  <p>Email: <strong>{profile?.personal?.email || 'student@scholarai.com'}</strong></p>
                  <p>Phone: <strong>{profile?.personal?.phone || '+91 9876543210'}</strong></p>
                  <p>State Domicile: <strong>{profile?.personal?.address?.state || 'Karnataka'}</strong></p>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Ensure your personal credentials match your government ID before proceeding.
                </p>
              </div>
            )}

            {/* Step 2: Academic Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD] space-y-2 text-xs">
                  <h4 className="font-heading font-extrabold text-[#111111] uppercase flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#CD0000]" />
                    Current Academic Enrollment
                  </h4>
                  <p>College: <strong>{profile?.academic?.college_name || 'BMS College of Engineering'}</strong></p>
                  <p>Course: <strong>{profile?.academic?.course || 'B.E. Computer Science'}</strong></p>
                  <p>Semester: <strong>{profile?.academic?.semester || '6th Semester'}</strong></p>
                  <p>Cumulative CGPA: <strong>{profile?.academic?.cgpa || '9.2 CGPA'}</strong></p>
                </div>
              </div>
            )}

            {/* Step 3: Attached Documents */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-extrabold uppercase text-[#111111] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#CD0000]" />
                  Verification Documents Audit
                </h4>

                <div className="space-y-2">
                  {(profile?.documents || []).length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>No verification documents uploaded. You can still submit, but approval requires doc upload.</span>
                    </div>
                  ) : (
                    (profile?.documents || []).map((doc, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#F9F9F7] border border-[#EEEEEE] flex items-center justify-between text-xs">
                        <span className="font-bold text-[#111111]">{doc.title || doc.file_name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-green-100 text-green-800">
                          {doc.status || 'Uploaded'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Legal Declaration */}
            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-extrabold uppercase text-[#111111] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#CD0000]" />
                  Student Declaration & Legal Code
                </h4>

                <div className="p-4 rounded-xl bg-[#F4F4F0] border border-[#DDDDDD] text-xs text-[#444444] space-y-2 leading-relaxed">
                  <p>
                    I hereby declare that all information furnished in this application is true, complete, and accurate to the best of my knowledge. I understand that submitting false documents or fraudulent income details will result in immediate disqualification and legal action under Karnataka State Scholarship guidelines.
                  </p>
                </div>

                <label className="flex items-start gap-3 text-xs text-[#111111] cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-[#CD0000]"
                  />
                  <span className="font-bold">
                    I agree to the honor code and authorize ScholarAI to verify my academic records.
                  </span>
                </label>
              </div>
            )}

            {/* Step 5: Review & Confirm */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#FFE5E5] border border-[#FFC9C9] space-y-2 text-xs text-[#111111]">
                  <h4 className="font-heading font-extrabold text-[#CD0000] uppercase">
                    Review Application Snapshot
                  </h4>
                  <p>Scholarship: <strong>{scholarship.title}</strong></p>
                  <p>Provider: <strong>{scholarship.provider}</strong></p>
                  <p>Applicant: <strong>{profile?.personal?.full_name}</strong></p>
                  <p>Target Grant: <strong>{scholarship.amount_info?.amount || '₹50,000 / year'}</strong></p>
                </div>
              </div>
            )}

            {/* Step 6: Confirmation Receipt */}
            {step === 6 && submittedApp && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 border border-green-300 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-heading font-extrabold text-[#111111] uppercase">Application Submitted Successfully</h3>
                <p className="text-xs text-[#666666]">
                  Your application file has been registered on the portal.
                </p>
                <div className="p-4 rounded-2xl bg-[#F4F4F0] border border-[#DDDDDD] inline-block font-mono text-sm font-bold text-[#CD0000]">
                  Application ID: {submittedApp.application_number}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Action Buttons */}
        {step < 6 && (
          <div className="flex justify-between items-center pt-4 border-t border-[#EEEEEE]">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={step === 1 || submitting}
              className="gap-1.5 text-xs font-heading uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>

            {step < 5 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={loading}
                className="gap-1.5 text-xs font-heading uppercase"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmitApplication}
                isLoading={submitting}
                className="gap-1.5 text-xs font-heading uppercase !bg-green-700 hover:!bg-green-800"
              >
                Submit Application <CheckCircle2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="flex justify-center pt-4 border-t border-[#EEEEEE]">
            <Button onClick={onClose} variant="primary" className="text-xs font-heading uppercase">
              Done & Track Application
            </Button>
          </div>
        )}

      </div>
    </Modal>
  );
};
