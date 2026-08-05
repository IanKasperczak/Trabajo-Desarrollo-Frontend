import { Box, Typography } from '@mui/material'
import type { BarDatum } from '../../../models/dashboard'

interface RankingListProps {
  items: BarDatum[]
  color?: string
  suffix?: string
}

function RankingList({ items, color = '#FFC107', suffix = '' }: RankingListProps) {
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {items.map((item) => (
        <Box key={item.label}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.value}
              {suffix}
            </Typography>
          </Box>
          <Box
            sx={{ height: 8, borderRadius: 4, bgcolor: 'background.default' }}
          >
            <Box
              sx={{
                width: `${(item.value / max) * 100}%`,
                height: '100%',
                borderRadius: 4,
                bgcolor: color,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default RankingList