import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Box } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import GroupIcon from '@mui/icons-material/Group';
import ArticleIcon from '@mui/icons-material/Article';
import SportsIcon from '@mui/icons-material/Sports';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MemberManagement from '../components/admin/MemberManagement';
import NewsManagement from '../components/admin/NewsManagement';

const drawerWidth = 240;

const AdminPanel = () => {
  const [open, setOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('members');

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'members':
        return <MemberManagement />;
      case 'news':
        return <NewsManagement />;
      default:
        return <MemberManagement />;
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'absolute',
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem button key="Members" onClick={() => setActiveComponent('members')}>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="Hantera Medlemmar" />
          </ListItem>
          <ListItem button key="News" onClick={() => setActiveComponent('news')}>
            <ListItemIcon><ArticleIcon /></ListItemIcon>
            <ListItemText primary="Hantera Nyhetsinlägg" />
          </ListItem>
          <ListItem button key="Sessions" component="a" href="/admin/sessions">
            <ListItemIcon><SportsIcon /></ListItemIcon>
            <ListItemText primary="Hantera Skytte-sessioner" />
          </ListItem>
          <Divider />
          <ListItem button key="Inbox">
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button key="Mail">
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary="Mail" />
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ padding: 3, height: '100%', overflowY: 'auto' }}>
        {/* Add your main content here */}
        {renderActiveComponent()}
      </Box>
    </Box>
  );
};

export default AdminPanel;