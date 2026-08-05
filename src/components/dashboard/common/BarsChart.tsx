import { Box, Typography } from '@mui/material'
import type { BarDatum } from '../../../models/dashboard'

interface BarsChartProps {
  data: BarDatum[]
  color?: string
  height?: number
  labelStep?: number
}

function BarsChart({
  data,
  color = '#FFC107',
  height = 150,
  labelStep = 1,
}: BarsChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0.5,
        height: height + 20,
      }}
    >
      {data.map((d, index) => (
        <Box
          key={`${d.label}-${index}`}
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: `${(d.value / max) * height}px`,
              bgcolor: color,
              borderRadius: '4px 4px 0 0',
              minHeight: 2,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {index % labelStep === 0 ? d.label : ''}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default BarsChart