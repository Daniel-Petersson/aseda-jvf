import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';

const pages = [
  { name: 'Hem', path: '/' },
  { name: 'Skjutbanor', subMenu: true },
  { name: 'Jägarexamen', path: '/jagarExamen' },
  { name: 'Kalender', path: '/calendar' },
  { name: 'Nyheter', path: '/news' },
  { name: 'Bli medlem', path: '/register' }
];
const settings = [
  { name: 'Skytte Resultat', path: '/memberArea' },
  { name: 'Konto', path: '/accountDetails' },
  { name: 'Admin', path: '/admin' },
  { name: 'Logout', path: '/' }
];
const skjutbanorOptions = [
  { name: 'Älgbana', path: '/algbana' },
  { name: 'Viltmålsbana', path: '/viltmalsbana' },
  { name: 'Inskjutningsbana', path: '/inskjutning' },
  { name: 'Trapp och skeetbana', path: '/trappSkeet' }
];

function Navbar() {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElSkjutbanor, setAnchorElSkjutbanor] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenSkjutbanorMenu = (event) => {
    setAnchorElSkjutbanor(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseSkjutbanorMenu = () => {
    setAnchorElSkjutbanor(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleCloseUserMenu();
  };

  const linkStyle = {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.h1.fontWeight,
              letterSpacing: '.3rem',
              color: theme.palette.text.primary,
              textDecoration: 'none',
            }}
          >
            Åseda Jaktvårdsförening
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.flatMap((page) =>
                page.subMenu
                  ? [
                      <MenuItem key={`${page.name}-header`}>
                        <Typography sx={{ fontWeight: 'bold' }}>{page.name}</Typography>
                      </MenuItem>,
                      ...skjutbanorOptions.map((option) => (
                        <MenuItem key={option.name} onClick={handleCloseNavMenu}>
                          <Link component={RouterLink} to={option.path} sx={linkStyle}>
                            <Typography sx={{ pl: 2 }}>{option.name}</Typography>
                          </Link>
                        </MenuItem>
                      )),
                    ]
                  : [
                      <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                        <Link component={RouterLink} to={page.path} sx={linkStyle}>
                          <Typography>{page.name}</Typography>
                        </Link>
                      </MenuItem>,
                    ]
              )}
              {!isLoggedIn && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link component={RouterLink} to="/login" sx={linkStyle}>
                    <Typography>Logga in</Typography>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.h1.fontWeight,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Åseda Jaktvårdsförening
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              page.subMenu ? (
                <Box key={page.name}>
                  <Link
                    component="button"
                    onClick={handleOpenSkjutbanorMenu}
                    sx={{ ...linkStyle, my: 2, color: 'white', display: 'block', mx: 2 }}
                  >
                    {page.name}
                  </Link>
                  <Menu
                    sx={{ mt: '45px' }}
                    anchorEl={anchorElSkjutbanor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElSkjutbanor)}
                    onClose={handleCloseSkjutbanorMenu}
                  >
                    {skjutbanorOptions.map((option) => (
                      <MenuItem key={option.name} onClick={handleCloseSkjutbanorMenu}>
                        <Link component={RouterLink} to={option.path} className="nav-link" sx={linkStyle}>
                          <Typography sx={{ textAlign: 'center' }}>{option.name}</Typography>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Link
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{ ...linkStyle, my: 2, color: 'white', display: 'block', mx: 2 }}
                >
                  {page.name}
                </Link>
              )
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {isLoggedIn ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={handleCloseUserMenu} component={RouterLink} to={setting.path}>
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Link
                component={RouterLink}
                to="/login"
                onClick={handleCloseNavMenu}
                sx={{ ...linkStyle, my: 2, color: 'white', display: 'block' }}
              >
                Logga in
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;