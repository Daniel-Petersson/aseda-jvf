import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box, Container, Avatar, Tooltip, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import { useTheme } from '@mui/material/styles';

function Navbar() {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElSkjutbanor, setAnchorElSkjutbanor] = React.useState(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isLoggedIn = !!user;
  const userRole = user?.role || '';

  const pages = [
    { name: 'Hem', path: '/' },
    { name: 'Skjutbanor', subMenu: true },
    { name: 'Jägarexamen', path: '/jagarExamen' },
    { name: 'Kalender', path: '/calendar' },
    { name: 'Nyheter', path: '/news' },
  ];

  if (!isLoggedIn) {
    pages.push({ name: 'Bli medlem', path: '/register' });
  }

  const settings = [
    { name: 'Skytte Resultat', path: '/member' },
    { name: 'Medlemsuppgifter', path: '/accountDetails' },
    { name: 'Logga ut', path: '/' }
  ];

  if (userRole === 'ADMIN' || userRole === 'INSTRUCTOR') {
    settings.splice(2, 0, { name: 'Admin', path: '/admin' });
  }

  const skjutbanorOptions = [
    { name: 'Älgbana', path: '/algbana' },
    { name: 'Viltmålsbana', path: '/viltmalsbana' },
    { name: 'Inskjutningsbana', path: '/inskjutning' },
    { name: 'Trapp och skeetbana', path: '/trappSkeet' }
  ];

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

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
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
              color: theme.palette.primary.contrastText,
              textDecoration: 'none',
              fontSize: { xs: '1.25rem', md: '1.5rem' }, // Responsive font size
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
              <MenuIcon sx={{ color: theme.palette.primary.contrastText }} />
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
              {isLoggedIn && settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  onClick={setting.name === 'Logga ut' ? handleLogout : handleCloseNavMenu} 
                  component={setting.name === 'Logga ut' ? 'button' : RouterLink} 
                  to={setting.name !== 'Logga ut' ? setting.path : undefined}
                >
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
              {!isLoggedIn && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link component={RouterLink} to="/login" sx={linkStyle}>
                    <Typography>Logga in</Typography>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
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
              color: theme.palette.primary.contrastText,
              textDecoration: 'none',
              fontSize: { xs: '1.25rem', md: '1.5rem' }, // Responsive font size
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
                    <MenuItem 
                      key={setting.name} 
                      onClick={setting.name === 'Logga ut' ? handleLogout : handleCloseUserMenu} 
                      component={setting.name === 'Logga ut' ? 'button' : RouterLink} 
                      to={setting.name !== 'Logga ut' ? setting.path : undefined}
                    >
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