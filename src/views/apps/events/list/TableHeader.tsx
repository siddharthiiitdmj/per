// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
  source?: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, source } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={`${source == 'events' ? 'Search Event' : 'Search userId'}`}
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default TableHeader
