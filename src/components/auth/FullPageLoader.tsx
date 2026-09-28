import { Box, CircularProgress } from '@mui/material'

function FullPageLoader() {
  return (
    <Box
      role="status"
      aria-label="Cargando"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
    >
      <CircularProgress />
    </Box>
  )
}

export default FullPageLoader
