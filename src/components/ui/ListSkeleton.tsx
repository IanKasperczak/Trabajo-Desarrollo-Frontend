import { Box, Card, Grid, Skeleton } from '@mui/material'

interface GridSizes {
  xs?: number
  sm?: number
  md?: number
  lg?: number
}

interface ListSkeletonProps {
  count?: number
  sizes?: GridSizes
}

function ListSkeleton({ count = 8, sizes }: ListSkeletonProps) {
  const grid = sizes ?? { xs: 12, sm: 6, md: 4, lg: 3 }

  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item key={index} {...grid}>
          <Card variant="outlined" sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
            <Box sx={{ mt: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={90} height={24} />
              <Skeleton variant="rounded" width={70} height={24} />
            </Box>
            <Skeleton variant="text" width="40%" sx={{ mt: 1.5 }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ListSkeleton