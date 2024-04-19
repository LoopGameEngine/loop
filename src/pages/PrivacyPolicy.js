import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function PrivacyPolicy() {
  return (
    <Container component="main" maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy for Loop Game Engine
        </Typography>
        <Typography variant="body1" paragraph>
          Last updated: [Date]
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Loop Game Engine. We deeply value the privacy of our users and are committed to protecting your personal information. This Privacy Policy outlines how we access and use your information through your Google account when using Loop Game Engine.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>1. Information We Access</strong><br />
          We use your Google account to access only your profile picture and username. This information is used to personalize your experience, letting you know you have successfully logged in.
        </Typography>
        <Typography variant="body1" paragraph>
          Additionally, we use the Google Drive API to create and manage a directory named "Loop Games" in the root of your Google Drive. This directory is where the games you create and edit within Loop Game Engine are stored. We do not access, view, or store any other data from your Google Drive.
        </Typography>
        <Typography variant="body1">
          <strong>2. How We Use Your Information</strong>
        </Typography>
        <ul>
          <li>Verify your identity upon login.</li>
          <li>Facilitate the creation and management of the "Loop Games" directory in your Google Drive.</li>
        </ul>
        <Typography variant="body1" paragraph>
          <strong>3. Security of Your Information</strong><br />
          Your information's security is a priority for us. We do not share your information with third parties, and we do not use local storage or cookies to maintain access tokens or other sensitive information. Access tokens are handled in memory and securely passed within our application.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>4. Your Rights</strong><br />
          Since we do not store personal data on our servers, any management related to your data is carried out directly through your Google account.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>5. Changes to This Privacy Policy</strong><br />
          We may update our Privacy Policy from time to time. Significant changes will be posted directly on our webpage. We encourage you to periodically review this Privacy Policy to stay informed on how we are protecting your information.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>6. Contact</strong><br />
          For questions or concerns about this Privacy Policy or our privacy practices, we invite you to use the usual external channels such as YouTube and Discord.
        </Typography>
      </Box>
    </Container>
  );
}

export default PrivacyPolicy;

