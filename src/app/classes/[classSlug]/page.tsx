'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  Flame,
  Download,
  Eye,
  Bookmark,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import PdfViewerModal from '@/components/PdfViewerModal';

const classConfig: Record<
  string,
  {
    grade: string;
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    subjects: string[];
  }
> = {
  'class-9': {
    grade: '9',
    title: 'Class 9',
    subtitle: 'Secondary School Certificate (SSC Part 1)',
    badge: 'Matric Part 1',
    description:
      'Curated resources for Federal Board SSC Part-I students. Access official SLO-based past papers, model papers, chapter quizzes, and AI paper checking.',
    subjects: [
      'Physics',
      'Chemistry',
      'Biology',
      'Mathematics',
      'Computer Science',
      'English',
      'Urdu',
      'Islamiat',
      'Pakistan Studies',
    ],
  },
  'class-10': {
    grade: '10',
    title: 'Class 10',
    subtitle: 'Secondary School Certificate (SSC Part 2)',
    badge: 'Matric Part 2',
    description:
      'Federal Board SSC Part-II matriculation hub. Prepare for final board theory and practical examinations with authentic past papers and chapter MCQs.',
    subjects: [
      'Physics',
      'Chemistry',
      'Biology',
      'Mathematics',
      'Computer Science',
      'English',
      'Urdu',
      'Pakistan Studies',
    ],
  },
  'class-11': {
    grade: '11',
    title: '1st Year — Class 11',
    subtitle: 'Higher Secondary School Certificate (HSSC Part 1)',
    badge: 'Intermediate Part 1',
    description:
      'Pre-Medical, Pre-Engineering, and ICS comprehensive preparation hub for Federal Board HSSC-I scholars.',
    subjects: [
      'Physics',
      'Chemistry',
      'Biology',
      'Mathematics',
      'Computer Science',
      'English',
      'Urdu',
    ],
  },
  'class-12': {
    grade: '12',
    title: '2nd Year — Class 12',
    subtitle: 'Higher Secondary School Certificate (HSSC Part 2)',
    badge: 'Intermediate Part 2',
    description:
      'Final board examination preparation for Federal Board HSSC Part-II students. Master high-yield numericals, derivations, and SLO marking rubrics.',
    subjects: [
      'Physics',
      'Chemistry',
      'Biology',
      'Mathematics',
      'Computer Science',
      'English',
      'Urdu',
      'Pakistan Studies',
    ],
  },
};

export default function ClassSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const classSlug = (params?.classSlug as string) || 'class-9';
  const config = classConfig[classSlug] || classConfig['class-9'];

  const [selectedSubject, setSelectedSubject] = useState<string>(config.subjects[0]);
  const [papers, setPapers] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // PDF Viewer Modal
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{
    title: string;
    fileUrl: string;
    paperId?: string;
    subject?: string;
    classGrade?: string;
  } | null>(null);

  // Sync selected subject if config changes
  useEffect(() => {
    setSelectedSubject(config.subjects[0]);
  }, [classSlug]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [papersRes, quizzesRes] = await Promise.all([
          fetch(`/api/papers?classGrade=${config.grade}&subject=${encodeURIComponent(selectedSubject)}`),
          fetch(`/api/quizzes?classGrade=${config.grade}&subject=${encodeURIComponent(selectedSubject)}`),
        ]);

        if (papersRes.ok) {
          const pData = await papersRes.json();
          setPapers(pData.papers || []);
        }
        if (quizzesRes.ok) {
          const qData = await quizzesRes.json();
          setQuizzes(qData.quizzes || []);
        }
      } catch (err) {
        console.error('Failed to load class section data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config.grade, selectedSubject]);

  const handleOpenPdf = (paper: any) => {
    if (!user) {
      router.push(`/login?redirect=/classes/${classSlug}`);
      return;
    }
    setSelectedPdf({
      title: paper.title,
      fileUrl: paper.fileUrl,
      paperId: paper.id,
      subject: paper.subject,
      classGrade: paper.classGrade,
    });
    setPdfModalOpen(true);
  };

  const handleToggleBookmark = async (paperId: string) => {
    if (!user) {
      router.push(`/login?redirect=/classes/${classSlug}`);
      return;
    }
    try {
      const res = await fetch(`/api/papers/${paperId}/bookmark`, { method: 'POST' });
      if (res.ok) {
        setPapers((prev) =>
          prev.map((p) => (p.id === paperId ? { ...p, isBookmarked: !p.isBookmarked } : p))
        );
      }
    } catch (err) {}
  };

  const pastPapersList = papers.filter((p) => p.paperType === 'PAST_PAPER');
  const modelPapersList = papers.filter((p) => p.paperType === 'MODEL_PAPER');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Class Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                {config.badge}
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                FBISE Federal Board Curriculum
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {config.title}
            </h1>
            <p className="text-sm sm:text-base font-medium text-amber-300">
              {config.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-1">
              {config.description}
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Subjects Filter Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Subject ({config.subjects.length} FBISE Subjects)
            </h3>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              Currently viewing: <strong className="text-slate-900 dark:text-white">{selectedSubject}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {config.subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  selectedSubject === subj
                    ? 'bg-emerald-800 text-white shadow-emerald-900/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-600'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Action Link: Run AI Checker for this Subject & Class */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/20 dark:to-emerald-950/20 border border-amber-200/60 dark:border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Solved a {selectedSubject} paper for {config.title}?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get it checked against the FBISE model marking scheme in under 10 seconds.
              </p>
            </div>
          </div>
          <Link
            href={`/ai-paper-check?subject=${encodeURIComponent(selectedSubject)}&classGrade=${config.grade}`}
            className="px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-emerald-900 transition-colors flex items-center space-x-1.5 flex-shrink-0"
          >
            <span>Run AI Paper Check</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Section 1: Past Papers for this Subject */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>{selectedSubject} Past Papers</span>
              </h2>
              <p className="text-xs text-slate-500">
                Annual and Supplementary board examinations with original answer structure
              </p>
            </div>
            <Link
              href={`/past-papers?classGrade=${config.grade}&subject=${encodeURIComponent(selectedSubject)}`}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>See Full Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading {selectedSubject} papers...</div>
          ) : pastPapersList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastPapersList.map((paper) => (
                <div
                  key={paper.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {paper.session} {paper.year}
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(paper.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          paper.isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-slate-400 hover:text-amber-500'
                        }`}
                        title={paper.isBookmarked ? 'Bookmarked' : 'Save paper'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                      {paper.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                      <span>Size: {paper.fileSize}</span>
                      <span>•</span>
                      <span>{paper.downloadCount} downloads</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenPdf(paper)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                    <a
                      href={paper.fileUrl}
                      download
                      className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center space-x-1"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No past papers uploaded yet for {selectedSubject} {config.title}. Admin can upload new papers from the Admin Panel.
            </div>
          )}
        </div>

        {/* Section 2: Model Papers for this Subject */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>{selectedSubject} Model Papers (SLO Based)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official Federal Board specimen papers demonstrating latest Student Learning Outcome formats
              </p>
            </div>
            <Link
              href="/model-papers"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>All Model Papers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {modelPapersList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelPapersList.map((paper) => (
                <div
                  key={paper.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/40 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                        SLO Model • {paper.year}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{paper.fileSize}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Includes official FBISE marking scheme guidance.</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenPdf(paper)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Model PDF</span>
                    </button>
                    <a
                      href={paper.fileUrl}
                      download
                      className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Model papers for {selectedSubject} are available in the main Model Papers library.
            </div>
          )}
        </div>

        {/* Section 3: Daily Quizzes for this Subject */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{selectedSubject} Daily Chapter Quizzes</span>
              </h2>
              <p className="text-xs text-slate-500">
                Chapter-wise MCQs based on the FBISE syllabus with instant results & explanations
              </p>
            </div>
            <Link
              href="/quizzes"
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center space-x-1"
            >
              <span>All Quizzes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      {quiz.chapter}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {quiz.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span>{quiz.questionCount} Questions</span>
                      <span>•</span>
                      <span>{Math.round(quiz.timeLimit / 60)} Minutes</span>
                      {quiz.userLatestAttempt && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">
                            Latest: {quiz.userLatestAttempt.percentage}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs whitespace-nowrap shadow-sm flex items-center space-x-1"
                  >
                    <span>{quiz.userLatestAttempt ? 'Retake' : 'Start'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No active quizzes for {selectedSubject} today. Check back tomorrow morning!
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PdfViewerModal
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          title={selectedPdf.title}
          fileUrl={selectedPdf.fileUrl}
          paperId={selectedPdf.paperId}
          subject={selectedPdf.subject}
          classGrade={selectedPdf.classGrade}
        />
      )}
    </div>
  );
}
