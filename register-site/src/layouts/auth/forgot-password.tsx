import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login, loginByGoogle, LoginType } from '../../services/auth.service';
import { toast } from 'react-toastify';
import {  useNavigate } from 'react-router-dom';
import { useUser } from '../../components/contexts/UserContext';
import {Visibility, VisibilityOff } from '@mui/icons-material';
import { CircularProgress, IconButton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';
import GoogleIcon from '@mui/icons-material/Google';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Quantico © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {setCurrentUser, setLoggedIn} = useUser();
  const [disableButton, setDisableButton] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  React.useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) navigate('/', { replace: true });
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = data.get('user');
    const password = data.get('password');
    setDisableButton(true)
    try {
      if (user && password) {
        const data = {
          username: user.toString(),
          password: password.toString(),
          loginType: LoginType.Normal
        }
        const userData = await login(data);
        if (userData) {
          setCurrentUser(userData)
          toast.success(t('Login success.'), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          
          localStorage.setItem("username", userData.username);
          setLoggedIn(true)
          setTimeout(() => {
            navigate('/')
          }, 800)
        }
      } else {
        toast.error(t('User name or password is missing.'), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        setDisableButton(false)
      }
    } catch (error) {
    
      setDisableButton(false)
      toast.error(t('User name or password is incorrect.'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      console.error(t('User name or password is incorrect.'), );
    }
  };

  const loginWithGoogle = async () => { 
    setGoogleLoading(true)
    try {
      const res = await signInWithPopup(auth, googleProvider)

      // disable eslint for this line
      // eslint-disable-next-line
      // @ts-ignore
      const idToken = await res?._tokenResponse?.oauthIdToken
      const dataResponse = {
        idToken,
        loginType: LoginType.Google
      }
      const userData = await loginByGoogle(dataResponse)
      localStorage.setItem("username", userData.username);
      setGoogleLoading(false)
      setLoggedIn(true)
      setTimeout(() => {
        navigate('/')
      }, 800)
    }
    catch (error) {
      console.error(error)
      setGoogleLoading(false)
    }
  }

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {t('Sign in')}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="user"
                label={t("User name")}
                name="user"
                autoComplete="user"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <Stack direction="row" justifyContent={'space-between'} spacing={2}>
                
                <p className='link-text' onClick={() => navigate('/forgot-password')}>
                  {t('Forgot password?')}
                </p>
              
              </Stack>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={disableButton}
              >
                {disableButton ? <CircularProgress size={25} sx={{marginLeft:"5px"}} /> : 'login'}
              </Button>

              <Button
                onClick={loginWithGoogle}
                fullWidth
                variant="contained"
                color="error"
                sx={{  mb: 2 }}
                disabled={disableButton}
                startIcon={
                  <>
                    <GoogleIcon />
                  </>
                }
              >
                {googleLoading ? <CircularProgress size={25} sx={{ marginLeft: "5px" }} /> : 'Login by Google' }
              </Button>
              <Grid container>
              </Grid>
              <Stack direction="row" justifyContent={'center'} spacing={0}>
                <p style={{
                  fontSize: '14px',
                }}>
                  {t('Don\'t have an account?')}
                </p>
                <span className='link-text text-center' onClick={() => navigate('/auth/register')}>
                  {t('Register')}
                </span>
              </Stack>
             
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
