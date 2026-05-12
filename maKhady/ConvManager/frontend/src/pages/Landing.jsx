import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Globe, Handshake, Users, ArrowUpRight } from 'lucide-react';


const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    fetchStats();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [stats, setStats] = useState({
    active_partnerships: 124,
    countries: 18,
    mobilities: 450
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/public-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="landing-container">
      {/* Header Premium */}
      <nav className={`premium-nav ${isScrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <div className="brand-text">
              <span className="brand-title">CoopManager</span>
            </div>
          </Link>

          <div className="nav-menu">
            <a href="#features">Fonctionnalités</a>
            <a href="#impact">Impact</a>
            <a href="#support">Support</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="link-login">Connexion</Link>
            <Link to="/register" className="btn-get-started">S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section Refined */}
      <header className="hero-v2">
        <div className="hero-background">
          <img 
            src="/img_uidt.jpg" 
            alt="UIDT Campus" 
            className="bg-image" 
            fetchPriority="high" 
          />
          <div className="bg-gradient"></div>
        </div>
        
        <div className="hero-main-content hero-split-layout">
          {/* Left Side: Content */}
          <div className="hero-left-content">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-badge"
            >
              UIDT GLOBAL COOPERATION
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-h1"
            >
              Pilotez vos<br />
              Coopérations<br />
              Universitaires<br />
              avec Clarté
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-p"
            >
              Une plateforme intégrée pour la gestion, le suivi et la performance de vos partenariats institutionnels. Digitalisez l'excellence académique.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hero-features-row"
            >
              <div className="hero-feature">
                <div className="hf-icon">📊</div>
                <h4>Centralisation</h4>
                <p>Tous vos dossiers en un point unique.</p>
              </div>
              <div className="hero-feature">
                <div className="hf-icon">⚡</div>
                <h4>Workflow</h4>
                <p>Validation automatisée sans frictions.</p>
              </div>
              <div className="hero-feature">
                <div className="hf-icon">📈</div>
                <h4>Indicateurs</h4>
                <p>Performance en temps réel.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Action Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hero-right-cards"
          >
            {/* Card 1: Login */}
            <div className="hero-action-card">
              <div className="card-header">
                <div className="card-icon">🔑</div>
                <div className="card-tag">ESPACE MEMBRE</div>
              </div>
              <h3>Se Connecter</h3>
              <p>Accédez à votre tableau de bord et gérez vos partenariats actifs.</p>
              <Link to="/login" className="card-btn btn-dark">
                Connexion ➔
              </Link>
            </div>

            {/* Card 2: Register */}
            <div className="hero-action-card">
              <div className="card-header">
                <div className="card-icon">🤝</div>
                <div className="card-tag">PORTEUR DE PROJET</div>
              </div>
              <h3>Créer un Compte</h3>
              <p>Rejoignez le réseau de coopération et initiez de nouvelles collaborations.</p>
              <Link to="/register" className="card-btn btn-light">
                Inscription ✦
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Bento Grid Features */}
      <section className="bento-features" id="features">
        <div className="container">
          <div className="section-intro">
            <span className="intro-tag">Services Numériques</span>
            <h2>Une plateforme, des possibilités infinies</h2>
          </div>

          <div className="features-presentation-image">
            <img src="/img_uidt.jpg" alt="Présentation de l'UIDT" loading="lazy" />
          </div>

          <div className="bento-grid">
            <div className="bento-item large">
              <div className="bento-content">
                <div className="bento-icon"><Handshake size={32} /></div>
                <h3>Gestion Intégrale</h3>
                <p>Suivez le cycle de vie complet de vos conventions, de l'ébauche initiale à la signature officielle du Recteur.</p>
                <div className="bento-visual">
                  {/* Mock UI visual */}
                  <div className="ui-mockup">
                    <div className="ui-line"></div>
                    <div className="ui-line short"></div>
                    <div className="ui-check"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-item tall">
              <div className="bento-content">
                <div className="bento-icon"><Globe size={32} /></div>
                <h3>Rayonnement Mondial</h3>
                <p>Cartographie dynamique de vos partenariats internationaux en temps réel.</p>
              </div>
            </div>

            <div className="bento-item medium">
              <div className="bento-content">
                <div className="bento-icon"><ArrowUpRight size={32} /></div>
                <h3>KPIs & Analytics</h3>
                <p>Tableaux de bord automatisés pour une prise de décision basée sur les données.</p>
              </div>
            </div>

            <div className="bento-item small">
              <div className="bento-content">
                <h3>Sécurité</h3>
                <p>Archivage certifié et accès sécurisés.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Stats */}
      <section className="modern-stats" id="impact">
        <div className="container">
          <div className="stats-header-centered">
            <h2>L'UIDT en Chiffres</h2>
          </div>
          <div className="stats-flex">
            <div className="stat-card-v2">
              <div className="s-icon-wrap">
                <span className="material-symbols-outlined">handshake</span>
              </div>
              <span className="s-num">{loadingStats ? '...' : stats.active_partnerships}</span>
              <span className="s-label">Conventions Actives</span>
            </div>
            <div className="stat-card-v2">
              <div className="s-icon-wrap">
                <span className="material-symbols-outlined">public</span>
              </div>
              <span className="s-num">{loadingStats ? '...' : stats.countries}</span>
              <span className="s-label">Pays Partenaires</span>
            </div>
            <div className="stat-card-v2">
              <div className="s-icon-wrap">
                <span className="material-symbols-outlined">flight_takeoff</span>
              </div>
              <span className="s-num">{loadingStats ? '...' : stats.mobilities}</span>
              <span className="s-label">Mobilités Facilitées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="premium-footer" id="support">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <h3>UIDT</h3>
              <p>L'excellence par l'innovation digitale.</p>
            </div>
            <div className="footer-nav">
              <div className="f-col">
                <h4>Navigation</h4>
                <a href="#features">Plateforme</a>
                <a href="#impact">Impact</a>
              </div>
              <div className="f-col">
                <h4>Support</h4>
                <Link to="/contact">Contact</Link>
                <a href="#">FAQ</a>
              </div>
            </div>
          </div>
          <div className="footer-legal">
            <p>© 2026 Université Iba Der Thiam de Thiès. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
