import * as React from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import './casino.css'

import { useEffect, useState } from "react";
import { getListCasinos } from "../../services/casino.service";
import { REACT_APP_API_URL } from "../../app-constants";
import { Button, styled } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const StyledLogOutBtn = styled(Button)({
  fontWeight: "bold",
  borderRadius: "8px",
  fontSize: "16px",
  lineHeight: 1,
  padding: "10px",
  position: "absolute",
  right: 0,
});

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

interface CasinoList {
  id: number;
  name: string;
  games: Games[];
  code: string;
  endPoint: string;
}

interface Games {
  id: number;
  endPoint: string;
  image: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Casino() {
  const [listCasino, setListCasino] = useState<CasinoList[]>([]);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchCasino = async () => {
    try {
      const data = await getListCasinos();
      setListCasino(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCasino();
  }, []);

  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleImageClick = (game: Games, casino: CasinoList) => {
    const username = localStorage.getItem("username");
    if (username) {
      const apiRoute = `${REACT_APP_API_URL}quantico/GameLaucher?userId=${username}&gameId=${game.id}&casinoCode=quantico`;

      // console.log(apiRoute);

      // clearCache();

      window.location.href = apiRoute;
    }

  };

  const clearCache = () => {
    localStorage.removeItem("username");

  }

  const handleLogOut = () => {
    clearCache();
    navigate("/auth");
  };

  const casino = listCasino[0];

  return (
    <>
      <div className="casino-main">
        <Box
          sx={{
            maxWidth: "65rem",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          <AppBar
            position="static"
            sx={{
              bgcolor: "#00003E",
              paddingTop: "2.5rem",
              boxShadow: "none",
              position: "relative"
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="label tabs"
              sx={{
                "& .MuiTabs-flexContainer": {
                  flexWrap: "wrap",
                  justifyContent: "start",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <div className="casino-logo">
                <img src={`img/skin/quanticogame-logo.webp`} />
              </div>
            </Tabs>
            <StyledLogOutBtn variant="contained" onClick={handleLogOut}>
              <Logout sx={{ marginRight: '4px' }} />
              <span className="logout-text">{t('Log out')}</span>
            </StyledLogOutBtn>
          </AppBar>
          <TabPanel
            value={value}
            index={0}
            dir={theme.direction}
            key={Math.random()}
          >
            <span className="casino-main" >
              <span className="casino-image-grid">
                {casino?.games.map((game) => {
                  return (
                    <span className="casino-image" key={game.id}>
                      <img
                        src={`img/` + game.image}
                        alt=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageClick(game, casino)
                        }}
                      />
                    </span>
                  );
                })}
              </span>
            </span>
          </TabPanel>
        </Box>
      </div>
    </>
  );
}
export default Casino;
