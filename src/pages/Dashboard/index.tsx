import { Box, Typography } from '@mui/material'

function Dashboard() {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Gimnasio Power Trainer
      </Typography>
      <Box
        sx={{
          width: 56,
          height: 4,
          bgcolor: 'primary.main',
          borderRadius: 2,
          mb: 2,
        }}
      />
      <Typography variant="body1" color="text.secondary">
        Bienvenido al sistema de gestión del gimnasio.
      </Typography>
    </Box>
  )
}

export default Dashboard