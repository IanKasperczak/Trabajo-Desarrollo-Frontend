import { Box, Typography } from '@mui/material'
import type { GroupedBarDatum } from '../../../models/dashboard'

interface GroupedBarsChartProps {
  data: GroupedBarDatum[]
  height?: number
}

function GroupedBarsChart({ data, height = 140 }: GroupedBarsChartProps) {
  const max = Math.max(
    ...data.flatMap((d) => d.values.map((v) => v.value)),
    1,
  )

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
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
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {d.values.map((v) => (
                <Box
                  key={v.name}
                  sx={{
                    width: 12,
                    height: `${(v.value / max) * height}px`,
                    bgcolor: v.color,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 2,
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 10, color: 'text.secondary' }}
            >
              {d.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mt: 1,
          flexWrap: 'wrap',
        }}
      >
        {data[0]?.values.map((v) => (
          <Box
            key={v.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Box
              sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: v.color }}
            />
            <Typography variant="caption" color="text.secondary">
              {v.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default GroupedBarsChart