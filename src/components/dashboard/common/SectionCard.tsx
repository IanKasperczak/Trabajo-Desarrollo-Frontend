import { Box, Card, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material'

interface SectionCardProps {
  title: string
  action?: ReactNode
  children: ReactNode
  sx?: SxProps<Theme>
}

function SectionCard({ title, action, children, sx }: SectionCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', bgcolor: 'background.paper', ...sx }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {action}
        </Box>
        <Box
          sx={{
            width: 32,
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: 2,
            mt: 0.75,
          }}
        />
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Card>
  )
}

export default SectionCard