import React, { useState } from "react";
import { X, Paperclip, Send, Bug, CheckCircle, AlertCircle } from "lucide-react";
import { feedbackService } from "@/services/feedback.service";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_CHARACTERS = 2000;

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setIsSubmitting(false);
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(onClose, 200);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await feedbackService.createBugReport({
        message: message.trim(),
      });
      setSubmitStatus("success");
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to submit bug report:", error);
      setSubmitStatus("error");
      setErrorMessage("Failed to send report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setMessage(value);
      if (submitStatus === "error") {
        setSubmitStatus("idle");
        setErrorMessage("");
      }
    }
  };

  const characterCount = message.length;
  const isNearLimit = characterCount >= MAX_CHARACTERS * 0.9;
  const isAtLimit = characterCount >= MAX_CHARACTERS;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[160] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B04CF] to-[#1208E8] flex items-center justify-center text-white">
              <Bug size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Report a Bug</h3>
              <p className="text-xs text-gray-500">Help us improve Direction AI</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {submitStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Thank You!</h4>
              <p className="text-sm text-gray-500 text-center">
                Your report has been submitted successfully.
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={message}
                onChange={handleChange}
                placeholder="Describe the bug or share your improvement ideas..."
                disabled={isSubmitting}
                className="w-full min-h-[140px] resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#0B04CF]/30 focus:bg-white focus:ring-2 focus:ring-[#0B04CF]/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                rows={5}
              />

              {/* Error message */}
              {submitStatus === "error" && errorMessage && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Disabled attachment button with tooltip */}
                  <div className="relative group">
                    <button
                      disabled
                      className="w-10 h-10 rounded-lg border border-gray-200 bg-white cursor-not-allowed flex items-center justify-center text-gray-300 transition-colors"
                      type="button"
                    >
                      <Paperclip size={16} />
                    </button>
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute z-[999] bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                      Feature coming soon
                      <span className="absolute z-[999] top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>

                  {/* Character counter */}
                  <span
                    className={`text-[11px] font-medium transition-colors duration-200 ${
                      isAtLimit
                        ? "text-red-500"
                        : isNearLimit
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}
                  >
                    {characterCount}/{MAX_CHARACTERS}
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !message.trim()}
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#0B04CF] to-[#1208E8] text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Report</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
