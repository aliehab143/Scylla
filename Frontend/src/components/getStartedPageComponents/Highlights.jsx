import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';

const items = [
  {
    icon: <AutoAwesomeRoundedIcon />,
    title: 'AI-Driven Insights',
    description:
      'Scylla leverages advanced AI algorithms to provide actionable insights into user behavior, empowering you to make data-driven decisions.',
  },
  {
    icon: <SecurityRoundedIcon />,
    title: 'Robust Security',
    description:
      'With Scylla, your data is safeguarded by state-of-the-art security measures, ensuring privacy and compliance.',
  },
  {
    icon: <InsightsRoundedIcon />,
    title: 'Real-Time Anomaly Detection',
    description:
      'Identify unusual patterns and behaviors instantly with Scylla’s cutting-edge anomaly detection capabilities.',
  },
  {
    icon: <TrendingUpRoundedIcon />,
    title: 'Scalability',
    description:
      'Whether you’re managing small datasets or large-scale operations, Scylla is designed to scale effortlessly with your needs.',
  },
  {
    icon: <BarChartRoundedIcon />,
    title: 'Advanced Analytics',
    description:
      'Unlock the power of advanced analytics to understand complex user behavior patterns and optimize your strategies.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Expert Support',
    description:
      'Our dedicated team is here to provide reliable support, helping you make the most out of Scylla.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Why Scylla Stands Out
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Discover the highlights of Scylla: from AI-driven insights to
            real-time anomaly detection, robust security, and scalability. Scylla
            provides everything you need for advanced user behavior analysis.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
