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
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/contexts/UserContext';
import { Apple, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';
import GoogleIcon from '@mui/icons-material/Google';

import AppleLogin from 'react-apple-login'

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
  const { setCurrentUser, setLoggedIn } = useUser();
  const [disableButton, setDisableButton] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) navigate('/', { replace: true });
  });

  const handleSubmitNormal = async () => {
    
    
    setDisableButton(true)
    try {
      if (username && password) {
        const data = {
          username: username.toString().trim(),
          password: password.toString().trim(),
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

    }
  };

  const loginWithGoogle = async () => {
   
    setDisableButton(true)
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
      setDisableButton(false)
      setLoggedIn(true)
      setTimeout(() => {
        navigate('/')
      }, 800)
    }
    catch (error) {
      console.log('error', error)
      setDisableButton(false)
    }
  }

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
 
  const handleLoginByApple = async (response: any) => {
    setDisableButton(true)
    try { 
      const idToken = response?.authorization?.id_token
      const dataResponse = {
        idToken,
        loginType: LoginType.Apple
      }
      const userData = await loginByGoogle(dataResponse)
      localStorage.setItem("username", userData.username);
      setDisableButton(false)
      setLoggedIn(true)
      setTimeout(() => {
        navigate('/')
      }, 800)
    }
    catch (error) {
      console.log('error', error)
      setDisableButton(false)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }} >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className='background-image'
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
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="user"
                label={t("User name")}
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                autoComplete="user"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitNormal();
                  }
                }}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                
                label={t("Password")}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitNormal();
                  }
                }}
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
                
                {/* <p className='link-text'>
                  {t('Forgot password?')}
                </p> */}

              </Stack>
              <Button
                fullWidth
                variant="contained"
                className='login-button'
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmitNormal}
               
              >
                {t('Sign in')}
              </Button>

              <Button
                onClick={loginWithGoogle}
                fullWidth
                variant="contained"
                color="error"
                className='login-button google-button'
                sx={{ mb: 2 }}
                startIcon={
                  <>
                    {<GoogleIcon />}
                  </>
                }
              >
                {t('Sign in with Google')}
              </Button>
              <AppleLogin usePopup={true} scope='email name' clientId="com.italiancardclub.sign" redirectURI="https://italiancardclub.com/auth" callback={handleLoginByApple} render={(props) => {
                return (
                  <Button
                    
                    onClick={props.onClick}
                    fullWidth
                    variant="contained"
                    sx={{ mb: 2, backgroundColor: '#000' }}
                    className='login-button apple-button'
                    startIcon={
                      <>
                       {<Apple /> }
                      </>
                    }
                  >
                    {t('Sign in with Apple')}
                  </Button>
                )
              }}  />
      
              <Grid container>
              </Grid>
              <Stack direction="row" justifyContent={'center'} spacing={0}>
                <p style={{
                  fontSize: '14px',
                }}>
                  {t("Don't have an account?")}
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
