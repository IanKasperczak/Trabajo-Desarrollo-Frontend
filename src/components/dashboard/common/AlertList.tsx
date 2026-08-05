import { Box, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoIcon from '@mui/icons-material/Info'
import type { AlertItem } from '../../../models/dashboard'

const severityConfig = {
  warning: { icon: WarningIcon, color: '#ED6C02' },
  error: { icon: ErrorOutlineIcon, color: '#D32F2F' },
  info: { icon: InfoIcon, color: '#0288D1' },
} as const

interface AlertListProps {
  items: AlertItem[]
}

function AlertList({ items }: AlertListProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, index) => {
        const config = severityConfig[item.severity]
        const Icon = config.icon
        return (
          <Box
            key={`${item.title}-${index}`}
            sx={{
              display: 'flex',
              gap: 1.5,
              py: 1.25,
              '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
            }}
          >
            <Icon sx={{ color: config.color, mt: 0.25, flexShrink: 0 }} fontSize="small" />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.title}
              </Typography>
              {item.description && (
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default AlertList