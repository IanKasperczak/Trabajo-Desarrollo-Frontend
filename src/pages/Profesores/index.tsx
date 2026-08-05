import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ProfesorList from '../../components/profesor/ProfesorList'
import { mockProfesores } from '../../mocks/mockProfesores'

function Profesores() {
  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            Profesores
          </Typography>
          <Box
            sx={{
              width: 56,
              height: 4,
              bgcolor: 'primary.main',
              borderRadius: 2,
              mt: 0.5,
            }}
          />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            size="small"
            placeholder="Buscar profesor..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo Profesor
          </Button>
        </Stack>
      </Stack>

      <ProfesorList profesores={mockProfesores} />
    </Box>
  )
}

export default Profesores