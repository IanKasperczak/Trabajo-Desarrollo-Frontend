import { Box, Typography } from '@mui/material'

interface PageTitleProps {
  title: string
}

function PageTitle({ title }: PageTitleProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Box
        sx={{
          width: 48,
          height: 4,
          bgcolor: 'primary.main',
          borderRadius: 2,
          mt: 1,
        }}
      />
    </Box>
  )
}

export default PageTitle