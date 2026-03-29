import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const TvShows = lazy(() => import('./pages/TvShows'));
const Upcoming = lazy(() => import('./pages/Upcoming'));
const Search = lazy(() => import('./pages/Search'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const TvShowDetails = lazy(() => import('./pages/TvShowDetails'));
const Player = lazy(() => import('./pages/Player'));
const CastPage = lazy(() => import('./pages/Cast'));
const CastSearch = lazy(() => import('./pages/CastSearch'));
const PersonDetails = lazy(() => import('./pages/PersonDetails'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const DMCA = lazy(() => import('./pages/DMCA'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Docs = lazy(() => import('./pages/Docs'));
const Landing = lazy(() => import('./pages/Landing'));

export default function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/welcome" element={<Landing />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TvShows />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cast-search" element={<CastSearch />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TvShowDetails />} />
            <Route path="/cast/:type/:id" element={<CastPage />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/player" element={<Player />} />
            <Route path="/collections/:type" element={<CollectionPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
