import { Box, Button, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

function ErrorState({
  message = 'Ocurrió un error al cargar los datos.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: 6,
        px: 2,
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
      <Typography variant="body1" color="text.primary">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Box>
  )
}

export default ErrorState