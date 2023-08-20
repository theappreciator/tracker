import { LoadingButton } from "@mui/lab";
import { Container, Box, Typography, TextField, Grid } from "@mui/material";
import Link from "next/link";
import { useState } from "react";


export default function FormForUserPass(
  {
    children,
    title,
    onSubmit,
  }: {
    children?: React.ReactNode,
    title: "Sign In" | "Create Account",
    onSubmit: (event: any) => Promise<boolean>,
  }
  ) {

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    setLoading(true);
    const success = await onSubmit(event);
    if (!success) {
      setLoading(false);
    }
  }

  const showSecretField = title === "Create Account";
  const allowAutocomplete = title === "Sign In";

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            placeholder="somewhere@example.com"
            value={title === 'Sign In' ? process.env.NEXT_PUBLIC_LOCAL_DEV_PREFILL_USERNAME : undefined}
            name="email"
            autoComplete={allowAutocomplete ? "email" : undefined}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            placeholder="12345678"
            value={title === 'Sign In' ? process.env.NEXT_PUBLIC_LOCAL_DEV_PREFILL_PASSWORD : undefined}
            type="password"
            id="password"
            autoComplete={allowAutocomplete ? "current-password" : undefined}
          />
          {showSecretField && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="secret"
              label="Invite Code"
              placeholder="secret code here"
              type="text"
              id="secret"
            />
          )}
          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            
          >
            {title}
          </LoadingButton>
          {children}
        </Box>
      </Box>
    </Container>
  )
}