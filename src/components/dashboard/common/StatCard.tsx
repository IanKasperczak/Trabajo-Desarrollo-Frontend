import { Box, Card, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface StatCardProps {
  icon: SvgIconComponent
  label: string
  value: string
  hint?: string
}

function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        p: 2,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: 'rgba(255, 193, 7, 0.16)',
          color: 'primary.dark',
          flexShrink: 0,
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Box>
    </Card>
  )
}

export default StatCard