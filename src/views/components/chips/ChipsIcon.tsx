// ** MUI Imports
import Chip from '@mui/material/Chip'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'

const ChipsIcon = ({ riskValue }: { riskValue: number }) => {
  return (
    <div className='demo-space-x'>
      <Chip label={`Current Risk Threshold: ${riskValue}`} color='warning' variant='outlined' icon={<GppMaybeIcon />} />
    </div>
  )
}

export default ChipsIcon
