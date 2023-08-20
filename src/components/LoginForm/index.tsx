import { Button, Grid } from "@mui/material";
import Link from "next/link";
import FormForUserPass from "../FormForUserPass";
import { useRouter } from "next/router";


export default function LoginForm(
{
  onCreateClick
} : {
  onCreateClick: (event: any) => void,
}
) {

  const router = useRouter();
  
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload = {
      email: data.get("email"),
      password: data.get("password"),
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (json?.dashboard) {
        router.push(json.dashboard);
        return true;
      }
      else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  return (
    <FormForUserPass
      title="Sign In"
      onSubmit={handleSubmit}
    >
      <Grid container>
        <Grid item xs>
          <Button
            variant="text"
            onClick={onCreateClick}
          >
            {"Create Account"}
          </Button>
        </Grid>
        {/* <Grid item>
          <Button
            variant="text"
          >
            Forgot password?
          </Button>
        </Grid> */}
      </Grid>
    </FormForUserPass>
  )
}