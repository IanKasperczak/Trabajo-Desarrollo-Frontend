import { Link as RouterLink } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

export interface QuickActionItem {
  label: string
  icon: SvgIconComponent
  to: string
}

interface QuickActionsProps {
  items: QuickActionItem[]
}

function QuickActions({ items }: QuickActionsProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
      {items.map((item) => (
        <Button
          key={item.label}
          component={RouterLink}
          to={item.to}
          variant="outlined"
          color="primary"
          startIcon={<item.icon />}
          sx={{ color: 'text.primary' }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  )
}

export default QuickActions
