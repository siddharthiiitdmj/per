// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Types
import { DeviceType } from 'src/types/apps/deviceTypes'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PreviewCard from 'src/views/apps/info/user/preview/PreviewCard'

const DeviceInfoPreview = () => {
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | DeviceType>(null)

  useEffect(() => {
    axios
      .get('/api/users/single', { params: { id } })
      .then(res => {
        setData(res.data)
        setError(false)
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [id])

  useEffect(() => {
    console.log('data: ', data)
  }, [data])

  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={12} md={12} xs={12}>
            <PreviewCard data={data} />
          </Grid>
        </Grid>
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>User with the id: {id} does not exist.</Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceInfoPreview
