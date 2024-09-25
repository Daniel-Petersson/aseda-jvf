import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5D6651', // Green for header and footer background
    },
    secondary: {
      main: '#D4A15E', // Gold color for accent and important links
    },
    background: {
      default: '#F8F8F8', // Light gray for the main content area
      paper: '#F0F0F0', // Slightly darker gray for cards and other paper elements
    },
    text: {
      primary: '#F8F8F8', // White text on green surfaces
      secondary: '#D4A15E', // Gold for certain accents
    },
  },
  typography: {
    fontFamily: 'Georgia, serif',
    h1: {
      fontWeight: 700,
      color: '#D4A15E',
    },
    h2: {
      fontWeight: 600,
      color: '#D4A15E',
    },
    h3: {
      fontWeight: 600,
      color: '#D4A15E',
    },
    h4: {
      fontWeight: 600,
      color: '#D4A15E',
    },
    body1: {
      fontWeight: 400,
      color: '#5D6651', // Green text for body content
    },
    body2: {
      fontWeight: 400,
      color: '#5D6651', // Green text for body content
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#5D6651', // Green background for header
          color: '#F8F8F8', // White text
        },
      },
    },
    MuiFooter: {
      styleOverrides: {
        root: {
          backgroundColor: '#5D6651', // Green background for footer
          color: '#F8F8F8', // White text in footer
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#D4A15E', // Gold text for buttons
          '&:hover': {
            backgroundColor: '#D4A15E', // White background on hover for buttons
            color: '#5D6651', // Green text on hover
          },
        },
      },
      variants: [
        {
          props: { variant: 'cardButton' },
          style: {
            color: '#5D6651', // Same color as body2
            '&:hover': {
              backgroundColor: 'transparent', // No background color on hover
              color: '#D4A15E', // Gold text on hover
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0F0F0', // Background for cards
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          color: '#5D6651', // Gold color for card title
          fontWeight: 600, // Thicker text for better readability
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: '#D4A15E', // Gold text for pagination buttons
          '&.Mui-selected': {
            backgroundColor: '#D4A15E', // Gold background for selected page
            color: '#5D6651', // Green text for selected page
            '&:hover': {
              backgroundColor: '#D4A15E', // Keep gold background on hover for selected page
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(212, 161, 94, 0.2)', // Light gold background on hover
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#5D6651', // Green text for table content
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#5D6651',
          color: '#F8F8F8', // White text for table headers
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: '#5D6651', // Green text for pagination
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: '#F8F8F8', // White text for sortable column headers
          '&:hover': {
            color: '#D4A15E', // Gold color on hover
          },
          '&.Mui-active': {
            color: '#D4A15E', // Gold color for active sort
          },
        },
        icon: {
          color: '#F8F8F8 !important', // White color for sort icon
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#5D6651', // Green text for input
          },
          '& .MuiInputLabel-root': {
            color: '#5D6651', // Green text for label
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#5D6651', // Green border
            },
            '&:hover fieldset': {
              borderColor: '#D4A15E', // Gold border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D4A15E', // Gold border when focused
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#5D6651', // Green background for drawer
          color: '#F8F8F8', // White text in drawer
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(212, 161, 94, 0.2)', // Light gold background on hover
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#F8F8F8', // White color for list item icons
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#F8F8F8', // White color for list item text
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#F8F8F8', // White color for icon buttons
          '&:hover': {
            backgroundColor: 'rgba(212, 161, 94, 0.2)', // Light gold background on hover
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#5D6651', // Green color for select icon
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#5D6651', // Green text for menu items
          '&:hover': {
            backgroundColor: 'rgba(212, 161, 94, 0.2)', // Light gold background on hover
          },
          '&.Mui-selected': {
            backgroundColor: '#D4A15E', // Gold background for selected item
            color: '#5D6651', // Green text for selected item
            '&:hover': {
              backgroundColor: '#D4A15E', // Keep gold background on hover for selected item
            },
          },
        },
      },
    },
  },
});

export default theme;
