import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import MemoryGame from './pages/MemoryGame';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import VideoBackground from './components/VideoBackground';

function App() {
  return (
    <>
      <VideoBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/game" element={<MemoryGame />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* write 404 also */}
        </Routes>
      </div>
    </>
  );
}

export default App;
