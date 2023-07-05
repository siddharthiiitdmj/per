// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Configs

// ** Types
import AboutOverivew from './AboutOverivew'
import ActivityTimeline from './ActivityTimeline'
import DeviceEvents from './DeviceEvents'
import DeviceUsersList from './UsersList'

interface Props {
  data: any
}

const PreviewCard = ({ data }: Props) => {
  if (data.data[0]) {
    return (
      <>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container>
              <Grid item sm={6} xs={12}>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant='h6'>{`# ${data.data[0].id}`}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} xs={12}>
            <Grid sx={{ mb: 7 }}>
              <AboutOverivew data={data.data[0]} />
            </Grid>
            <ActivityTimeline />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Grid item xs={12} sx={{ mb: 7 }}>
              <DeviceEvents data={data.data[0].id} />
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  } else {
    return null
  }
}

export default PreviewCard
