import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import type { Theme } from '@mui/material'
import type { Role } from '../../models/role'
import { roleBase, roleNav } from '../../utils/navigation'
import RoleSwitcher from '../role/RoleSwitcher'

const DRAWER_WIDTH = 240
const APP_NAME = 'Gimnasio Power Trainer'

interface MainLayoutProps {
  role: Role
}

function MainLayout({ role }: MainLayoutProps) {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const base = roleBase[role]
  const navItems = roleNav[role]

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  const drawerContent = (
    <Box sx={{ height: '100%', color: 'rgba(255, 255, 255, 0.8)' }}>
      <Toolbar />
      <List sx={{ pt: 1 }}>
        {navItems.map((item) => {
          const to = item.path === '/' ? base : `${base}/${item.path}`
          const isActive =
            item.path === '/'
              ? location.pathname === base
              : location.pathname.startsWith(to)

          return (
            <ListItem key={to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={to}
                end={item.path === '/'}
                selected={isActive}
                sx={{
                  position: 'relative',
                  pl: 2.5,
                  color: 'rgba(255, 255, 255, 0.75)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 193, 7, 0.14)',
                    color: '#FFC107',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#FFC107',
                    },
                  },
                  '&.Mui-selected::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: '#FFC107',
                    borderTopRightRadius: 2,
                    borderBottomRightRadius: 2,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { fontWeight: 500 } }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton
            aria-label="abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 0.5,
              display: { lg: 'none' },
              color: 'background.default',
            }}
          >
            <MenuIcon />
          </IconButton>
          <FitnessCenterIcon sx={{ color: '#FFC107' }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: '#FFFFFF',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {APP_NAME}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <RoleSwitcher />
        </Toolbar>
      </AppBar>

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout