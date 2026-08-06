import { Box, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import type { SvgIconComponent } from '@mui/icons-material'

interface EmptyStateProps {
  message?: string
  icon?: SvgIconComponent
}

function EmptyState({
  message = 'No hay datos para mostrar.',
  icon: Icon = InboxIcon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: 8,
        px: 2,
      }}
    >
      <Icon sx={{ fontSize: 48, color: 'primary.dark' }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default EmptyState