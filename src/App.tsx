import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import RequireAuth from "./components/RequireAuth";
import Index from "./pages/Index";
import { meta } from "@/utils/metaTracking";

// Valentine promo ended - components hidden
// import { ValentineAnnouncement } from "@/components/ValentineAnnouncement";
// import { FloatingHearts } from "@/components/FloatingHearts";


// Non-initial routes stay lazy
const ThankYou = React.lazy(() => import("./pages/ThankYou"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Affiliate Portal Pages - lazy loaded
const Login = React.lazy(() => import("./pages/Login"));
const MagicLinkLanding = React.lazy(() => import("./pages/MagicLinkLanding"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Earnings = React.lazy(() => import("./pages/Earnings"));
const Payouts = React.lazy(() => import("./pages/Payouts"));
const Links = React.lazy(() => import("./pages/Links"));
const ReviewsAdmin = React.lazy(() => import("./pages/ReviewsAdmin"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    meta.firePageView().catch((err) => console.error('[App] firePageView failed:', err));
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <>
          <BrowserRouter basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* Valentine promo ended - components removed */}
            <Routes>
              <Route
                path="/"
                element={<Index />}
              />
              <Route
                path="/thank-you"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <ThankYou />
                  </Suspense>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              {/* Affiliate Portal Public Routes */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/media-buyer"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <MagicLinkLanding />
                  </Suspense>
                }
              />

              {/* Affiliate Portal Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <RequireAuth><Dashboard /></RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/orders"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <RequireAuth><Orders /></RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/earnings"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <RequireAuth><Earnings /></RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/payouts"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <RequireAuth><Payouts /></RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/links"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <RequireAuth><Links /></RequireAuth>
                  </Suspense>
                }
              />
              <Route
                path="/reviews-admin"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <ReviewsAdmin />
                  </Suspense>
                }
              />

              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading…" />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
