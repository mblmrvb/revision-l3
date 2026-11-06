import { useEffect } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { useProgress } from "./lib/store";
import { Home } from "./pages/Home";
import { MatierePage } from "./pages/MatierePage";
import { ChapitrePage } from "./pages/ChapitrePage";
import { QcmPage } from "./pages/QcmPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { ExercicePage } from "./pages/ExercicePage";
import { AnnalesPage } from "./pages/AnnalesPage";
import { AnnalePage } from "./pages/AnnalePage";
import { ProgressionPage } from "./pages/ProgressionPage";
import { ReglagesPage } from "./pages/ReglagesPage";

export function App() {
  const p = useProgress();
  const loc = useLocation();
  useEffect(() => {
    const t = p.reglages.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t === "sombre" ? "dark" : "light");
  }, [p.reglages.theme]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand">
          📚 Révisions L3
        </NavLink>
        <div className="topstats">
          <span title="Série de jours consécutifs">🔥 {p.streak.count}</span>
          <span title="Points d'expérience">⭐ {p.xp}</span>
        </div>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/m/:m" element={<MatierePage />} />
          <Route path="/m/:m/c/:c" element={<ChapitrePage />} />
          <Route path="/qcm/:m" element={<QcmPage />} />
          <Route path="/flashcards/:m" element={<FlashcardsPage />} />
          <Route path="/exo/:id" element={<ExercicePage />} />
          <Route path="/annales" element={<AnnalesPage />} />
          <Route path="/annale/:id" element={<AnnalePage />} />
          <Route path="/progression" element={<ProgressionPage />} />
          <Route path="/reglages" element={<ReglagesPage />} />
          <Route path="*" element={<p>Page introuvable.</p>} />
        </Routes>
      </main>
      <nav className="bottomnav">
        <NavLink to="/" end>
          <span>🏠</span>Accueil
        </NavLink>
        <NavLink to="/annales">
          <span>📝</span>Annales
        </NavLink>
        <NavLink to="/progression">
          <span>📊</span>Progrès
        </NavLink>
        <NavLink to="/reglages">
          <span>⚙️</span>Réglages
        </NavLink>
      </nav>
    </div>
  );
}
