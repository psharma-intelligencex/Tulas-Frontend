import "./App.css";

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Eager: rendered on every route, so splitting them out would only add
// round-trips and let the chrome (nav + footer) flash on first paint.
import Navbar from "./components/Navbar/Navbar";
import Contact from "./components/Contact/Contact";

// Route-level pages are code-split: each becomes its own chunk that is only
// fetched when its route is visited, keeping the initial bundle small.
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const CsrPage = lazy(() => import("./pages/CsrPage/CsrPage"));
const CommitteePageIndividual = lazy(() =>
  import("./pages/CommitteePageIndividual/CommitteePageIndividual")
);
const EventsPage = lazy(() => import("./pages/EventsPage/EventsPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage/BlogsPage"));
const Evortal = lazy(() => import("./pages/EvortalPage/EvortalPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));

// Admin CMS - self-contained section mounted at /admin/* (its own auth,
// layout and styling; no public Navbar/Contact chrome).
const AdminApp = lazy(() => import("./admin/AdminApp"));

const ManagementPage = lazy(() => import("./pages/TeamPage/TeamPage"));
const CommitteePage = lazy(() => import("./pages/CommitteePage/CommitteePage"));
// import HackerSummitRegistrationPage from "./pages/EventRegistrationPage/HackerSummitRegistrationPage";
const FrenzyPitchRegistrationPage = lazy(() =>
  import("./pages/EventRegistrationPage/FrenzyPitchRegistrationPage")
);
const UltimateShowdownRegistrationPage = lazy(() =>
  import("./pages/EventRegistrationPage/UltimateShowDownRegistrationPage")
);
const VirtualEscapeRoomRegistrationPage = lazy(() =>
  import("./pages/EventRegistrationPage/VirtualEscapeRoomRegistrationPage")
);

const HackathonHomePage = lazy(() =>
  import("./pages/Hackathon/HackathonHomePage/HackathonHomePage")
);
// import RegistrationPage from "./pages/Hackathon/RegistrationPage/RegistrationPage";

const RegistrationSuccess = lazy(() =>
  import("./pages/RegistrationSuccess/RegistrationSuccess")
);
const ProblemStatementPage = lazy(() =>
  import("./pages/Hackathon/ProblemStatementPage/ProblemStatementPage")
);
const ProblemStatementDashboard = lazy(() =>
  import("./pages/Hackathon/ProblemStatementDashboard/ProblemStatementDashboard")
);

const EventRegistrationForm = lazy(() =>
  import("./pages/EventRegistrationPage/EventRegistrationForm")
);
const AlumniPage = lazy(() => import("./pages/AlumniPage/AlumniPage"));
const BecomeMemberPage = lazy(() =>
  import("./pages/BecomeMemberPage/BecomeMemberPage")
);
const FuntopiaRegistrationsPage = lazy(() =>
  import(
    "./pages/EventRegistrationPage/FuntopiaRegistrationPage/FuntopiaRegistrationsPage"
  )
);

const EventRegistration = lazy(() =>
  import("./pages/EventRegistrationPage/EventRegistrationPage/EventRegistration")
);
const RegistrationPage = lazy(() =>
  import(
    "./pages/EventRegistrationPage/EventRegistrationPage/RegistrationPage/RegistrationPage"
  )
);
const PageHeading = lazy(() => import("./components/PageHeading/PageHeading"));
const ComingSoonPage = lazy(() =>
  import("./pages/ComingSoonPage/ComingSoonPage")
);
const ACDPage = lazy(() => import("./pages/ACDPage/ACDPage"));
const ACDTimelinePage = lazy(() => import("./pages/ACDPage/ACDTimelinePage"));
const ContactSection = lazy(() =>
  import("./sections/ContactSection/ContactSection")
);

function App() {
  return (
    <div className="mainDiv">
      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomePage />
                <Contact />
              </>
            }
          />
          <Route
            path="/csr"
            element={
              <>
                <Navbar />
                <CsrPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/team"
            element={
              <>
                <Navbar />
                <ManagementPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <Navbar />
                <EventsPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/blogs"
            element={
              <>
                <Navbar />
                <BlogsPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/alumni"
            element={
              <>
                <Navbar />
                {/* <ComingSoonPage /> */}
                <AlumniPage />
                <Contact />
              </>
            }
          />
          {/* <Route
            path="/evortal"
            element={
              <>
                <Navbar />
                <Evortal />
                <Contact />
              </>
            }
          /> */}
          <Route
            path="/registrationSuccess"
            element={
              <>
                <RegistrationSuccess />
              </>
            }
          />
          <Route
            path="/become-a-member"
            element={
              <>
                <Navbar />
                <BecomeMemberPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/committees"
            element={
              <>
                <Navbar />
                <CommitteePage />
                <Contact />
              </>
            }
          />
          <Route
  path="/committees/:committee"
  element={
    <>
      <Navbar />
      <CommitteePageIndividual />
      <Contact />
    </>
  }
/>
          {/* ADMIN CMS (no public chrome) */}
          <Route path="/admin/*" element={<AdminApp />} />

          <Route
            path="*"
            element={
              <>
                <Navbar />
                <PageNotFound />
                <Contact />
              </>
            }
          />

          {/* EVENT ROUTES */}

          {/* // * Past Events */}
          {/* <Route
            path="/acd"
            element={
              <>
                <ACDPage />
                <ContactSection />
              </>
            }
          /> */}
          {/* {
            <Route
              path="/AlumVerse"
              element={
                <>
                  <Navbar />
                  <EventRegistrationForm />
                  <Contact />
                </>
              }
            />
          } */}
          {/* <Route
            path="/WebGenesis"
            element={
              <>
                <Navbar />
                <EventRegistrationForm />
                <Contact />
              </>
            }
          /> */}
          {/* <Route
            path="/Entropedia"
            element={
              <>
                <Navbar />
                <EventRegistration />
              </>
            }
          />

          <Route path="/Entropedia/register" element={<RegistrationPage />} /> */}

          {/* <Route
            path="/AzureCloudScape"
            element={
              <>
                <Navbar />
                <EventRegistrationForm />
                <Contact />
              </>
            }
          /> */}

          {/* <Route
            path="/Funtopia"
            element={
              <>
                <Navbar />
                 <ComingSoonPage />
                <FuntopiaRegistrationsPage />
                <Contact />
              </>
            }
          /> */}
          {/* <Route
            path="/memoir3.0"
            element={
              <>
                <Navbar />
                <EventRegistrationForm />
                <Contact />
              </>
            }
          /> */}
          {/* <Route
            path="/evortal/hackersummit"
            element={<>      <Navbar /><HackerSummitRegistrationPage /></>}
          /> */}
          {/* <Route
            path="/evortal/frenzypitch"
            element={
              <>
                <Navbar />
                <FrenzyPitchRegistrationPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/evortal/virtualescaperoom"
            element={
              <>
                <Navbar />
                <VirtualEscapeRoomRegistrationPage />
                <Contact />
              </>
            }
          />
          <Route
            path="/evortal/ultimateshowdown"
            element={
              <>
                <Navbar />
                <UltimateShowdownRegistrationPage />
                <Contact />
              </>
            }
          /> */}

          {/* <Route path="/hackathon4.0/" element={<HackathonHomePage />} /> */}
          {/* <Route path="/hackathon4.0/register" element={<RegistrationPage />} /> */}
          {/* <Route
            path="/hackathon4.0/problemStatements"
            element={<ProblemStatementPage />}
          />
          <Route
            path="/hackathon4.0/jdfsdjgf73428"
            element={<ProblemStatementDashboard />}
          /> */}
        </Routes>
      </Suspense>
    </div>
  );
}
export default App;
// GG
