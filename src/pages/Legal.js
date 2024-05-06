import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Legal() {
  return (
    <Container component="main" maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Use for Loop Game Engine
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Loop Game Engine, an innovative online platform designed to enable users to create, edit, and enjoy 2D games directly from their browser. By using Loop Game Engine, you agree to comply with the following terms of use. These terms govern your access to and use of Loop Game Engine, including all content, functionality, and services offered on our application.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>1. Access and Account</strong><br />
          Access to Loop Game Engine requires a Google account. By using your Google account to access our service, you authorize Loop Game Engine to access and use your Google account information to facilitate the registration and login process. You are responsible for maintaining the security of your Google account and for any activity that occurs through it on Loop Game Engine. Ensure you use a secure password and periodically review your account permissions to maintain your security and privacy.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>2. Use of Loop Game Engine</strong><br />
          Loop Game Engine allows users to create 2D games, which are stored in their personal Google Drive, edit these games, and play them. You retain all copyright and any other rights you already hold in the games you create using Loop Game Engine. Using Loop Game Engine for any illegal purpose, to create infringing content, defamatory, obscene, or otherwise violative of any law, is strictly prohibited.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>3. Intellectual Property</strong><br />
          By using Loop Game Engine, you grant a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, store, display, reproduce, modify, create derivative works from, perform, and distribute any game you create on or through Loop Game Engine, solely for the purposes of operating, developing, providing, promoting, and improving Loop Game Engine and for researching and developing new services.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>4. Modifications and Termination</strong><br />
          We reserve the right to modify, suspend, or discontinue Loop Game Engine at any time and for any reason, with or without notice. We also reserve the right to terminate your access to Loop Game Engine without notice, in the case of any breach of these terms.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>5. Changes to the Terms of Use</strong><br />
          These Terms of Use may be modified from time to time. It is your responsibility to periodically review these terms to stay informed of any changes.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>6. Access Tokens and Session</strong><br />
          To maintain the security of your account and data, the access tokens that enable communication with Google Drive have a limited duration. When these tokens expire, it is necessary to log in again to continue using Loop Game Engine. This process ensures your information remains protected and minimizes the risk of unauthorized access.
        </Typography>
        <Typography variant="body1">
          <strong>Contact</strong><br />
          If you have any questions about these Terms of Use, please do not hesitate to contact us at contact@loop2d.com.
        </Typography>
      </Box>
    </Container>
  );
}

export default Legal;
