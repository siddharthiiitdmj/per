// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

interface arrType {
  value: string
  property: string
}

const renderList = (arr: arrType[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' }
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
            <Typography
              sx={{
                flex: '1 1 33%',
                fontWeight: 600,
                color: 'text.secondary'
              }}
            >
              {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
            </Typography>
            <Typography
              sx={{
                flex: '2 2 66%',
                color: 'text.secondary'
              }}
            >
              {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
            </Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

function convertData(data: { [key: string]: string }): { property: string; value: string }[] {
  return Object.entries(data).map(([property, value]) => ({ property, value }))
}

interface Props {
  data: any
}

const AboutOverivew = ({ data }: Props) => {
  const arr = convertData(data)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                Details
              </Typography>
              {renderList(arr)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverivew
