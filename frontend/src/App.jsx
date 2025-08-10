// src/App.jsx (ADICIONAR estas rotas)
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Lazy loading components para melhor performance
const Navbar = lazy(() => import('./components/layout/Navbar'));
const Footer = lazy(() => import('./components/layout/Footer'));
const BackToTopButton = lazy(() => import('./components/ui/BackToTopButton'));
const AdminTrigger = lazy(() => import('./components/ui/AdminTrigger'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Página principal do portfólio
const Portfolio = lazy(() => import('./pages/Portfolio'));

// NOVAS PÁGINAS LEGAIS
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

// Componente de Loading
const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">A carregar...</span>
            </div>
            <p className="mt-2 text-muted">A carregar...</p>
        </div>
    </div>
);

// Componente para proteger rotas administrativas
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const navigate = useNavigate(); // Hook para navegação programática
    
    if (!token) {
        navigate('/admin-login'); // Redireciona usando useNavigate
        return <LoadingSpinner />;
    }
    
    return children;
};

// Layout para páginas administrativas (ISOLADO)
const AdminLayout = ({ children }) => (
    <div className="admin-app">
        <Suspense fallback={<LoadingSpinner />}>
            {children}
        </Suspense>
    </div>
);

// Layout para páginas do portfolio
const PortfolioLayout = ({ children }) => (
    <div className="portfolio-layout">
        <Suspense fallback={<LoadingSpinner />}>
            <Navbar />
            {children}
            <Footer />
            <BackToTopButton />
            <AdminTrigger />
        </Suspense>
    </div>
);

// Layout para páginas legais (sem AdminTrigger)
const LegalLayout = ({ children }) => (
    <div className="legal-layout">
        <Suspense fallback={<LoadingSpinner />}>
            <Navbar />
            {children}
            <Footer />
            <BackToTopButton />
        </Suspense>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Rota Principal do Portfolio */}
                <Route 
                    path="/" 
                    element={
                        <PortfolioLayout>
                            <Portfolio />
                        </PortfolioLayout>
                    } 
                />
                
                {/* NOVAS ROTAS LEGAIS */}
                <Route 
                    path="/privacidade" 
                    element={
                        <LegalLayout>
                            <PrivacyPolicy />
                        </LegalLayout>
                    } 
                />
                
                <Route 
                    path="/termos" 
                    element={
                        <LegalLayout>
                            <TermsConditions />
                        </LegalLayout>
                    } 
                />
                
                <Route 
                    path="/cookies" 
                    element={
                        <LegalLayout>
                            <CookiePolicy />
                        </LegalLayout>
                    } 
                />
                
                {/* Rota de Login Administrativo */}
                <Route 
                    path="/admin-login" 
                    element={
                        <AdminLayout>
                            <AdminLogin />
                        </AdminLayout>
                    } 
                />
                
                {/* Rota do Dashboard Administrativo (Protegida) */}
                <Route 
                    path="/admin-dashboard" 
                    element={
                        <AdminLayout>
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        </AdminLayout>
                    } 
                />
                
                {/* Rota 404 - Página não encontrada */}
                <Route 
                    path="*" 
                    element={
                        <LegalLayout>
                            <div style={{ 
                                minHeight: '60vh', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '2rem'
                            }}>
                                <div>
                                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
                                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                        Página não encontrada
                                    </p>
                                    <a 
                                        href="/" 
                                        style={{ 
                                            background: 'var(--accent)', 
                                            color: 'white', 
                                            padding: '0.8rem 2rem',
                                            textDecoration: 'none',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        Voltar ao Início
                                    </a>
                                </div>
                            </div>
                        </LegalLayout>
                    } 
                />
            </Routes>
        </Router>
    );
    //
}

export default App;

