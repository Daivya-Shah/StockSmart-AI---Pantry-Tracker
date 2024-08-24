"use client"

import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard'); // Navigates to the StockSmart Dashboard
  };

  const handleContactMe = () => {
    window.open('https://daivyashah.com/', '_blank'); // Opens your webpage in a new tab
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: 'black',
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent overlay
          zIndex: 1,
        }}
      />

      {/* Top Right Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 2,
          zIndex: 3,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleContactMe}
          sx={{ borderColor: 'white', color: 'white' }}
        >
          Contact Me
        </Button>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Welcome to StockSmart AI
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
          Your AI-Powered Pantry and Recipe Assistant
        </Typography>

        {/* Key Features Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid white',
                height: '100%', // Ensure all boxes have the same height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="h3">
                Smart Recipe Suggestions
              </Typography>
              <Typography variant="body2">
                Generate personalized recipe ideas using your current inventory, with AI that considers item quantities and expiration dates to minimize waste and optimize usage.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid white',
                height: '100%', // Ensure all boxes have the same height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="h3">
                Expiration Tracking
              </Typography>
              <Typography variant="body2">
                Monitor items that are nearing expiration. The AI prioritizes these ingredients in recipes to help you reduce food waste.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid white',
                height: '100%', // Ensure all boxes have the same height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="h3">
                Low Quantity Alerts
              </Typography>
              <Typography variant="body2">
                Receive alerts for items that are running low. The AI factors in these quantities to ensure recipes are practical and achievable with what you have on hand.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Get Started Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{ mt: 4, px: 4, py: 2, backgroundColor: 'light-blue' }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}
