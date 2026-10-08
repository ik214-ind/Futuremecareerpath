import { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ToastContext';
import Navigation from '@/components/Navigation';
import ProfilePage from '@/pages/ProfilePage';
import DashboardPage from '@/pages/DashboardPage';
import AlumniPage from '@/pages/AlumniPage';
import ChatPage from '@/pages/ChatPage';
import { StudentProfile, PageId } from '@/types';

const initialProfile: StudentProfile = {
  email: '',
  yearOfStudy: '',
  skills: [],
  interests: '',
  targetCompanies: [],
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('profile');
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [transitioning, setTransitioning] = useState(false);

  const profileComplete =
    profile.email.trim() !== '' &&
    profile.yearOfStudy !== '' &&
    profile.skills.length > 0 &&
    profile.interests.trim() !== '' &&
    profile.targetCompanies.length > 0;

  const handleNavigate = (page: PageId) => {
    if (page === currentPage) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleGenerate = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage('dashboard');
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#050508] text-slate-200">
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          profileComplete={profileComplete}
        />

        <main
          className={`transition-opacity duration-200 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {currentPage === 'profile' && (
            <ProfilePage
              profile={profile}
              onProfileChange={setProfile}
              onGenerate={handleGenerate}
            />
          )}
          {currentPage === 'dashboard' && <DashboardPage profile={profile} />}
          {currentPage === 'counselor' && <ChatPage profile={profile} />}
          {currentPage === 'alumni' && <AlumniPage />}
        </main>

        {/* Global footer — visible on all tabs */}
        <footer className="border-t border-white/[0.04] py-4 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs text-slate-500">
              made for students by vaibhavi and ishan
            </p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;
