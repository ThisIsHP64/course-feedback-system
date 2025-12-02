import { Routes, Route, Navigate } from 'react-router-dom';
import CourseList from './pages/CourseList';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import LessonList from './pages/LessonList';
import LogFeedback from './pages/LogFeedback';
import ViewFeedback from './pages/ViewFeedback';
import ProfessorCourseList from './pages/ProfessorCourseList';
import ProfessorLessonList from './pages/ProfessorLessonList';
import DownloadFeedback from './pages/DownloadFeedback';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Routes>
      {/* Start at the login page when visiting the root */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/professor/courses" element={<ProfessorCourseList />} />
      <Route path="/course/:courseId" element={<LessonList />} />
      <Route
        path="/professor/course/:courseId"
        element={<ProfessorLessonList />}
      />
      <Route
        path="/professor/course/:courseId/download"
        element={<DownloadFeedback />}
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/lesson/:lessonId/feedback" element={<LogFeedback />} />
      <Route path="/lesson/:lessonId/view" element={<ViewFeedback />} />
      {/* Fallback: unknown routes -> login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
