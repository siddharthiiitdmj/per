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
              {typeof item.value === 'string' ? item.value.charAt(0).toUpperCase() + item.value.slice(1) : item.value}
            </Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

function convertData(data: { [key: string]: string | null }): { property: string; value: string }[] {
  const allowedProperties = ['id', 'altUserId', 'name', 'email', 'role', 'createdAt', 'updatedAt', 'location']

  return Object.entries(data)
    .filter(([property]) => allowedProperties.includes(property))
    .map(([property, value]) => ({
      property,
      value: value === null ? '' : value
    }))
}

interface Props {
  data: any
}

const AboutOverview = ({ data }: Props) => {
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

export default AboutOverview
