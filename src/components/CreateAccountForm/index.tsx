import { Button, Grid } from "@mui/material";
import Link from "next/link";
import FormForUserPass from "../FormForUserPass";
import { useRouter } from "next/router";


export default function CreateAccountForm(
  {
    onSignInClick
  } : {
    onSignInClick: () => void,
  }
  ) {

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // setLoading(true);
    const data = new FormData(event.currentTarget);

    const payload = {
      email: data.get("email"),
      password: data.get("password"),
      secret: data.get("secret"),
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      console.log("Got a response!", response.status);
      if (response.status === 200) {
        console.log("about to redirect?");
        onSignInClick();
        return true;
      }
      else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const handleSignInClick = () => {
    onSignInClick();
  }

  return (
    <FormForUserPass
      title="Create Account"
      onSubmit={handleSubmit}
    >
      <Grid container>
        <Grid item xs>
          <Button
            variant="text"
            onClick={handleSignInClick}
          >
            {"Sign In"}
          </Button>
        </Grid>
      </Grid>
    </FormForUserPass>
  )
}