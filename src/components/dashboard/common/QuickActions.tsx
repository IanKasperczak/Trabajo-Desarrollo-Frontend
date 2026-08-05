import { Box, Button } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

export interface QuickActionItem {
  label: string
  icon: SvgIconComponent
}

interface QuickActionsProps {
  items: QuickActionItem[]
}

function QuickActions({ items }: QuickActionsProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
      {items.map((item) => (
        <Button key={item.label} variant="outlined" color="primary" startIcon={<item.icon />}>
          {item.label}
        </Button>
      ))}
    </Box>
  )
}

export default QuickActions