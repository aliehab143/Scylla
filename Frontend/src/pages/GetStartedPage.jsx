
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/getStartedPageComponents/Hero';
import Highlights from '../components/getStartedPageComponents/Highlights';
import Features from '../components/getStartedPageComponents/Features';
import FAQ from '../components/getStartedPageComponents/FAQ';
import Footer from '../components/getStartedPageComponents/Footer';

export default function GetStartedPage() {
  return (
<div>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <Features />
        <Divider />
        <Divider />
        <Highlights />
        <Divider />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
      </div>
  );
}