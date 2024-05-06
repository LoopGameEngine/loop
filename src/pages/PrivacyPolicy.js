import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function PrivacyPolicy() {
  return (
    <Container component="main" maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loop Game Engine Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Last updated: [May 1, 2024]
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Loop Game Engine. We deeply value the privacy of our users and are committed to protecting your personal information. This Privacy Policy describes how we access and use your information through your Google Account when you use Loop Game Engine.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>1. Information we access</strong><br />
          We use your Google Account to access only your profile picture and username. This information is used to personalize your experience by letting you know that you are successfully logged in.
        </Typography>
        <Typography variant="body1" paragraph>
          In addition, we use the Google Drive API to create and manage a directory called “Loop” in the root of your Google Drive. This directory is where the games you create and edit in Loop Game Engine are stored. We do not access, view, or store any other data from your Google Drive.
        </Typography>
        <Typography variant="body1">
          <strong>2. How we use your information</strong>
        </Typography>
        <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
          <li><Typography variant="body1">To verify your identity when you log in.</Typography></li>
          <li><Typography variant="body1">To facilitate the creation and management of the “Loop” directory in your Google Drive.</Typography></li>
          <li><Typography variant="body1">In addition, it incorporates the functionality to share games to copy and play. This requires you to grant permission to access in read mode the games you specifically share.</Typography></li>
        </ul>
        <Typography variant="body1" paragraph>
          <strong>3. Security of your information</strong><br />
          The security of your information is a priority for us. We do not share your information with third parties, and we do not use local storage or cookies to maintain access tokens or other sensitive information. Access tokens are managed in memory and transmitted securely within our application.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>4. Your Rights</strong><br />
          Since we do not store personal data on our servers, any management related to your data is done directly through your Google account.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>5. Changes to this Privacy Policy</strong><br />
          We may update our Privacy Policy from time to time. Significant changes will be posted directly on our website. We encourage you to periodically review this Privacy Policy to stay informed about how we protect your information.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>6. Contact</strong><br />
          If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at contact@loop2d.com.
        </Typography>
      </Box>
    </Container>
  );
}

export default PrivacyPolicy;
