import React from 'react';
import { Box, Typography, Link } from '@mui/material';

// Define the props interface for the Footer component
interface FooterProps {
  companyName: string;
  currentYear: number;
}

// Footer component that renders copyright information and links
const Footer: React.FC<FooterProps> = ({ companyName, currentYear }) => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {`© ${currentYear} ${companyName}. All rights reserved.`}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link color="inherit" href="/privacy-policy">
          Privacy Policy
        </Link>
        {' | '}
        <Link color="inherit" href="/terms-of-service">
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;

// Human tasks:
// TODO: Implement actual Privacy Policy and Terms of Service pages and update the links accordingly
// TODO: Consider adding social media links or icons if required
// TODO: Ensure the footer is responsive and looks good on all screen sizes
// TODO: Add unit tests for the Footer component