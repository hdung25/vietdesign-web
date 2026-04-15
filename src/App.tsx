/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProjectDataProvider } from './contexts/ProjectDataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Journal from './pages/Journal';
import Admin from './pages/Admin';

export default function App() {
  return (
    <LanguageProvider>
      <ProjectDataProvider>
        <Router>
          <Routes>
            {/* Admin panel – outside the public Layout */}
            <Route path="/admin" element={<Admin />} />
            {/* Public site */}
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/journal" element={<Journal />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ProjectDataProvider>
    </LanguageProvider>
  );
}
