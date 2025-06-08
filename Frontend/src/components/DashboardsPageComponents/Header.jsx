import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Search from './Search';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        maxWidth: { sm: '100%', md: '1200px' },
        mb: 2,
        px: 1,
      }}
      spacing={2}
    >
      <Search />
      <Box
        sx={{
          p: 0.5,
          borderRadius: 2,
          background: (theme) => theme.palette.mode === 'dark'
            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
          backdropFilter: "blur(10px)",
          border: (theme) => theme.palette.mode === 'dark'
            ? "1px solid rgba(102, 126, 234, 0.2)"
            : "1px solid rgba(226, 232, 240, 0.8)",
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: (theme) => theme.palette.mode === 'dark'
              ? "1px solid rgba(102, 126, 234, 0.4)"
              : "1px solid rgba(102, 126, 234, 0.3)",
            transform: 'translateY(-1px)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? "0 4px 16px rgba(0, 0, 0, 0.3)"
              : "0 4px 16px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <ColorModeIconDropdown />
      </Box>
    </Stack>
  );
}
