import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import IntegrationInstructionsRoundedIcon from '@mui/icons-material/IntegrationInstructionsRounded';

import SpotlightCard from '../blocks/Components/SpotlightCard/SpotlightCard';
import ClickSpark from '../blocks/Animations/ClickSpark/ClickSpark';
import GradientText from '../blocks/TextAnimations/GradientText/GradientText';

const highlights = [
  {
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'AI-Driven Insights',
    description: 'Scylla leverages advanced AI algorithms to provide actionable insights into user behavior, empowering you to make data-driven decisions.',
    color: '#4ade80',
    metric: '95%',
    metricLabel: 'Accuracy Rate'
  },
  {
    icon: <SecurityRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Robust Security',
    description: 'With Scylla, your data is safeguarded by state-of-the-art security measures, ensuring privacy and compliance.',
    color: '#f59e0b',
    metric: '100%',
    metricLabel: 'Compliance'
  },
  {
    icon: <InsightsRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Real-Time Detection',
    description: 'Identify unusual patterns and behaviors instantly with Scylla\'s cutting-edge anomaly detection capabilities.',
    color: '#ef4444',
    metric: '<1s',
    metricLabel: 'Response Time'
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Infinite Scalability',
    description: 'Whether you\'re managing small datasets or large-scale operations, Scylla is designed to scale effortlessly with your needs.',
    color: '#8b5cf6',
    metric: '100M+',
    metricLabel: 'Records/Hour'
  },
  {
    icon: <BarChartRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Advanced Analytics',
    description: 'Unlock the power of advanced analytics to understand complex user behavior patterns and optimize your strategies.',
    color: '#06b6d4',
    metric: '50+',
    metricLabel: 'Metrics Tracked'
  },
  {
    icon: <CloudRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Cloud Native',
    description: 'Built for the cloud with microservices architecture, ensuring high availability and seamless deployment.',
    color: '#10b981',
    metric: '99.9%',
    metricLabel: 'Uptime SLA'
  },
  {
    icon: <IntegrationInstructionsRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Easy Integration',
    description: 'Simple APIs and SDKs make it easy to integrate Scylla with your existing systems and workflows.',
    color: '#f97316',
    metric: '5min',
    metricLabel: 'Setup Time'
  },
  {
    icon: <SupportAgentRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'Expert Support',
    description: 'Our dedicated team provides 24/7 support, helping you make the most out of Scylla with expert guidance.',
    color: '#ec4899',
    metric: '24/7',
    metricLabel: 'Support'
  },
];

const achievements = [
  { value: '500K+', label: 'Anomalies Detected' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '10K+', label: 'Active Users' },
  { value: '50+', label: 'Enterprise Clients' },
];

export default function Highlights() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="highlights"
      sx={(theme) => ({
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
        overflow: 'hidden'
      })}
    >
      {/* Background pattern */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 25% 25%, #667eea33 0%, transparent 50%), radial-gradient(circle at 75% 75%, #764ba233 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, #667eea15 0%, transparent 50%), radial-gradient(circle at 75% 75%, #764ba215 0%, transparent 50%)',
          opacity: 0.6,
        })}
      />

      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 6, sm: 8 },
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            width: { sm: '100%', md: '70%' },
            textAlign: 'center',
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(30px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <Typography 
            component="h2" 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              color: 'text.primary'
            }}
          >
            Why{' '}
            <GradientText
              colors={['#4ade80', '#06b6d4', '#8b5cf6', '#ec4899']}
              animationSpeed={5}
              showBorder={false}
            >
              Scylla
            </GradientText>
            {' '}Stands Out
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Discover the highlights of Scylla: from AI-driven insights to
            real-time anomaly detection, robust security, and infinite scalability.
          </Typography>
        </Box>

        {/* Achievements Counter */}
        <Box sx={{ 
          mb: 4,
          animation: 'fadeInUp 0.8s ease-out 0.2s both',
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Grid container spacing={4}>
            {achievements.map((achievement, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #4ade80, #06b6d4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    {achievement.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Highlights Grid */}
        <Grid container spacing={3}>
          {highlights.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  animation: `fadeInUp 0.8s ease-out ${0.4 + index * 0.1}s both`,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <ClickSpark
                  sparkColor={item.color}
                  sparkCount={5}
                  sparkSize={6}
                  sparkRadius={18}
                  duration={500}
                >
                  <SpotlightCard
                    spotlightColor={isDark ? `${item.color}35` : `${item.color}70`}
                    className="highlight-card"
                  >
                    <Box
                      sx={{
                        height: '100%',
                        backgroundColor: isDark
                          ? 'rgba(15, 23, 42, 0.8)'
                          : 'rgba(255, 255, 255, 0.95)',
                        border: isDark 
                          ? `1px solid ${item.color}40` 
                          : `2px solid ${item.color}25`,
                        borderRadius: '16px',
                        padding: '24px',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: isDark 
                          ? `0 4px 20px rgba(0, 0, 0, 0.2)`
                          : `0 8px 32px ${item.color}20`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: isDark 
                            ? `0 8px 40px rgba(0, 0, 0, 0.3)`
                            : `0 12px 48px ${item.color}30`,
                          borderColor: isDark 
                            ? `${item.color}70` 
                            : `${item.color}50`,
                        }
                }}
              >
                      <Stack spacing={3} sx={{ height: '100%' }}>
                        {/* Icon and Metric */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              color: item.color,
                              p: 1.5,
                              borderRadius: '12px',
                              backgroundColor: isDark 
                                ? `${item.color}20` 
                                : `${item.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: isDark ? 'none' : `1px solid ${item.color}30`
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: item.color,
                                fontWeight: 'bold',
                                lineHeight: 1
                              }}
                            >
                              {item.metric}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.7rem'
                              }}
                            >
                              {item.metricLabel}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Content */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'text.primary',
                              mb: 2,
                              fontSize: '1.1rem'
                            }}
                          >
                    {item.title}
                  </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              lineHeight: 1.6
                            }}
                          >
                    {item.description}
                  </Typography>
                        </Box>

                        {/* Glow effect on hover */}
                        <Box
                          sx={{
                            height: '3px',
                            background: `linear-gradient(90deg, ${item.color}, transparent)`,
                            borderRadius: '2px',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.3s ease',
                            '.highlight-card:hover &': {
                              transform: 'scaleX(1)'
                            }
                          }}
                        />
              </Stack>
                    </Box>
                  </SpotlightCard>
                </ClickSpark>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 6,
          animation: 'fadeInUp 0.8s ease-out 1.2s both',
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Experience the Future of Analytics
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Join thousands of organizations already transforming their data insights with Scylla's cutting-edge platform.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
