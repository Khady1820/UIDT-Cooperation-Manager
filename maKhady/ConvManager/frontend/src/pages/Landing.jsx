import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import api from '../services/api';


const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    fetchStats();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [stats, setStats] = useState({
    active_partnerships: 0,
    countries: 0,
    mobilities: 0
  });

  const fetchStats = async () => {
    try {
      const response = await api.get('/public-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };


  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          GESTION DE LA COOPERATION - UIDT
        </Link>


        
        <div className="nav-links">
          <a href="#platform" className="nav-link">Fonctionnalités</a>
          <a href="#stats" className="nav-link">Impact</a>
          <a href="#support" className="nav-link">Support</a>
        </div>


        <div className="nav-auth">
          <Link to="/login" className="btn-login">Connexion</Link>
          <Link to="/register" className="btn-register">S'inscrire</Link>


        </div>

      </nav>

      {/* Hero Section */}
      <header 
        className="hero-section" 
        style={{ backgroundImage: 'url(/img_uidt.jpg)' }}
      >
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <div className="hero-tag">UIDT Global Cooperation</div>
          <h1 className="hero-title">
            Pilotez vos <br />
            <span>Coopérations</span> <br />
            Universitaires <br />
            avec Clarté
          </h1>
          
          <p className="hero-description">
            Une plateforme intégrée pour la gestion, le suivi et la performance de 
            vos partenariats institutionnels. Digitalisez l'excellence académique.
          </p>

          <div className="hero-features-small">
            <div className="small-feature">
              <i>📊</i>
              <span>Centralisation</span>
              <p>Tous vos dossiers en un point unique.</p>
            </div>
            <div className="small-feature">
              <i>⚡</i>
              <span>Workflow</span>
              <p>Validation automatisée sans frictions.</p>
            </div>
            <div className="small-feature">
              <i>📈</i>
              <span>Indicateurs</span>
              <p>Performance en temps réel.</p>
            </div>
          </div>
        </div>

        <div className="hero-cards">
          {/* Login Card */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon">🔑</div>
              <span className="card-tag">Espace Membre</span>
            </div>
            <h3 className="card-title">Se Connecter</h3>
            <p className="card-desc">
              Accédez à votre tableau de bord et gérez vos partenariats actifs.
            </p>
            <Link to="/login" className="card-btn btn-primary-card">
              Connexion ➔
            </Link>
          </div>

          {/* Register Card */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon">🤝</div>
              <span className="card-tag">Porteur de Projet</span>
            </div>
            <h3 className="card-title">Créer un Compte</h3>
            <p className="card-desc">
              Rejoignez le réseau de coopération et initiez de nouvelles collaborations.
            </p>
            <Link to="/register" className="card-btn btn-secondary-card">
              Inscription ✦
            </Link>
          </div>
        </div>

      </header>

      {/* Features Section */}
      <section className="features-section" id="platform">
        <div className="section-header">
          <h2 className="section-title">L'excellence au service de la gestion</h2>
          <p className="section-subtitle">
            Optimisez chaque étape du cycle de vie de vos coopérations internationales et locales avec des outils conçus pour l'administration universitaire moderne.
          </p>
        </div>


        <div className="features-container">
          <div className="feature-main">
            <div className="feature-image">
              <img src="/img_uidt.jpg" alt="Unified Folders" />
            </div>
            <div className="feature-text">
              <span className="feature-tag">Centralisation Intelligente</span>
              <h3>Dossiers de Coopération Unifiés</h3>
              <p>Archivez, indexez et retrouvez instantanément tous les documents légaux, conventions et avenants liés à vos partenariats.</p>
            </div>
          </div>

          <div className="features-side">
            <div className="feature-card accent">
              <div className="feature-card-icon">⚡</div>
              <h4>Automatisations</h4>
              <p>Gagnez 40% de temps sur le circuit de signature électronique et de validation administrative.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📊</div>
              <h4>Analyses Prédictives</h4>
              <p>Visualisez l'impact de vos coopérations à travers des tableaux de bord dynamiques et des KPIs personnalisables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">

        <div className="stats-header">
          <h2>Chiffres Clés du Réseau</h2>
          <p>L'UIDT s'engage pour une coopération structurée, durable et génératrice de valeur académique.</p>
        </div>
        <div className="stats-grid">

          <div className="stat-item">
            <div className="stat-number">{stats.active_partnerships}+</div>
            <div className="stat-label">Partenariats Actifs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.countries}</div>
            <div className="stat-label">Pays Représentés</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.mobilities > 100 ? stats.mobilities : '500'}+</div>
            <div className="stat-label">Impact Mobilité</div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="support">

        <div className="footer-top">
          <div className="footer-logo-area">
            <Link to="/" className="nav-logo" style={{ marginBottom: '1rem' }}>
              GESTION DE LA COOPERATION - UIDT
            </Link>



            <p>
              Le futur de la coopération académique digitale par University Cooperation Management System.
            </p>
          </div>
          
          <div className="footer-links-area">
            <div className="footer-col">
              <h4>Légal</h4>
              <ul>
                <li><a href="#">Politique de Confidentialité</a></li>
                <li><a href="#">Conditions d'Utilisation</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Accessibilité</a></li>
                <li><a href="#">Contacter le Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Système de Gestion de la Coopération Universitaire. Tous droits réservés.</p>
        </div>


      </footer>
    </div>
  );
};

export default Landing;
