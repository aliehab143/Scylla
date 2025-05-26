import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppTheme from "./shared-theme/AppTheme";
import SignInpage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider } from "./context/Auth/AuthProvider";
import { SearchProvider } from "./context/Search/SearchContext";
import AuthUserMainPage from "./pages/AuthUserMainPage";
import DataSourcesPage from "./pages/DataSourcesPage";
import DashboardSelectPage from "./pages/DashboardSelectPage";
import GetStartedPage from "./pages/GetStartedPage";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import UserDataSources from "./pages/UserDatasources";
import DataSourceFormPage from "./pages/DataSourcesFormPage";
import AddDashboardPage from "./pages/AddDashboardPage";
import PrometheusDataSourceFormPage from "./pages/PrometheusDataSourceFormPage";
import CsvDashboardPage from "./pages/CsvDashboardPage";
import PrometheusDashboardPage from "./pages/PrometheusDashboardPage";
import CsvAnalyzePage from "./pages/CsvAnalyzePage";
import LokiDataSourceFormPage from "./pages/LokiDataSourceFormPage";
import ProfilePage from "./pages/ProfilePage";
import CorrelateDataSourcesPage from "./pages/CorrelateDataSourcesPage";
import ViewCorrelationsPage from "./pages/ViewCorrelationsPage";
import LokiDashboardPage from "./pages/LokiDashboardPage";


function App() {
  return (
    <AppTheme>
      <AuthProvider>
        <SearchProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<GetStartedPage />} />
              <Route path="/signIn" element={<SignInpage />} />
              <Route path="/signUp" element={<SignUpPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/main" element={<AuthUserMainPage />} />
                <Route path="/datasources/add" element={<DataSourcesPage />} />
                <Route path="/dashboards" element={<DashboardSelectPage />} />
                <Route path="/datasources/view" element={<UserDataSources />} />
                <Route path="/data-source/csv" element={<DataSourceFormPage />} />
                <Route path="/dashboards/add" element={<AddDashboardPage />} />
                <Route
                  path="/data-source/:type"
                  element={<PrometheusDataSourceFormPage />}
                />
                <Route
                  path="/data-source/loki"
                  element={<LokiDataSourceFormPage />}
                />
                <Route path="/dashboard/csv/:id" element={<CsvDashboardPage />} />
                <Route
                  path="/dashboard/prometheus/:id"
                  element={<PrometheusDashboardPage />}
                />
                <Route path="/analyze/:id" element={<CsvAnalyzePage/>} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/datasources/correlate" element={<CorrelateDataSourcesPage />} />
                <Route path="/datasources/correlations" element={<ViewCorrelationsPage />} />
                <Route path="/dashboard/loki/:id" element={<LokiDashboardPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </AuthProvider>
    </AppTheme>
  );
}

export default App;
