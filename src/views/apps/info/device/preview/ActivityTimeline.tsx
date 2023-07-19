// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

import { fetchData } from 'src/store/apps/deviceSpecificEvents'

import { AppDispatch, RootState } from 'src/store'
import { useEffect, useState } from 'react'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

interface Props {
  data: any
}

const ActivityTimeline = ({ data }: Props) => {
  // Hooks
  const [id] = useState<string>(data)
  const [OS] = useState<string>('')
  const [value] = useState<string>('')
  const [timeline, setTimeline] = useState<any>([])

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.deviceSpecificEvents)

  useEffect(() => {
    dispatch(
      fetchData({
        id,
        OS,
        q: value
      })
    )
  }, [dispatch, OS, value, id])

  useEffect(() => {
    const myData = getTrimmedTimeline(store.activityTimeline)
    setTimeline(myData)
    console.log('activityTimeline: ', timeline)
  }, [store])

  const getTrimmedTimeline = (originalArray: any) => {
    const topFourEntries = originalArray.slice(0, 4)
    const lastEntry = originalArray.slice(-1)
    const newArray = topFourEntries.concat(lastEntry)

    return newArray
  }

  type ValidColor = 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'grey'

  const dotColors: ValidColor[] = ['error', 'primary', 'info', 'warning', 'grey', 'secondary', 'success']

  return (
    <Card>
      <CardHeader
        title='Activity Timeline'
        sx={{ '& .MuiCardHeader-avatar': { mr: 2.5 } }}
        avatar={<Icon icon='mdi:chart-timeline-variant' />}
        titleTypographyProps={{ sx: { color: 'text.primary' } }}
      />
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          {timeline &&
            timeline.map((item: any, i: any) => {
              return (
                <TimelineItem key={i}>
                  <TimelineSeparator>
                    <TimelineDot color={dotColors[i % 7]} />
                    {i !== timeline.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2.75)} !important` }}>
                    <Box
                      sx={{
                        mb: 2.5,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 600 }}>{item.titles[0]}</Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {item.date}
                      </Typography>
                    </Box>
                    <Typography variant='body2' sx={{ mb: 2 }}>
                      {item.subTitles[0]}
                    </Typography>
                    {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src='/images/avatars/1.png' sx={{ mr: 2.5, width: 24, height: 24 }} />
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      John Doe
                    </Typography>
                  </Box> */}
                  </TimelineContent>
                </TimelineItem>
              )
            })}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline
