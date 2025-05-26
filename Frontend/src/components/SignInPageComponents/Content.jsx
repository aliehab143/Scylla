import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const items = [
  {
    icon: <InsightsRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'AI-Driven Insights',
    description:
      'Scylla leverages advanced AI algorithms to provide actionable insights into user behavior and trends.',
  },
  {
    icon: <SecurityRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Robust Security',
    description:
      'Protect your data with Scylla’s enterprise-grade security features, ensuring privacy and compliance.',
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Scalability',
    description:
      'Scylla is built to handle large-scale datasets and high-traffic environments without compromising performance.',
  },
  {
    icon: <AutoAwesomeRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Innovative Functionality',
    description:
      'Stay ahead with cutting-edge features designed to address evolving needs in user behavior analytics.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
        {/* Scylla Logo */}
        <img
          src="/siteLogo.png"
          alt="Scylla Logo"
          style={{ width: '80px', height: 'auto' }}
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Scylla
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
