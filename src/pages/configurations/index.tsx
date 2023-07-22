import React, { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import Input from '@mui/material/Input'
import { Card, CardContent, Grid, Typography, Button, Box, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'

// const Fields: string[] = [
//   'isVPNSpoofed',
//   'isVirtualOS',
//   'isEmulator',
//   'isAppSpoofed',
//   'isAppPatched',
//   'isAppCloned',
// ];

const StyledInput = styled(Input)`
  width: 42px;
`

export default function Configurations() {
  const [configurations, setConfigurations] = useState<
    { id: number; field: string; value: number; isSwitchedOn: boolean }[]
  >([])
  const [hasUpdates, setHasUpdates] = useState(false)
  const [open, setOpen] = useState(false)
  const [newField, setNewField] = useState('')
  const [defaultValue, setDefaultValue] = useState(30)
  const [fieldToDelete, setFieldToDelete] = useState<{
    id: number
    field: string
    value: number
    isSwitchedOn: boolean
  } | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios.get('/api/configurations').then(response => {
      setConfigurations(response.data)
    })
  }, [])

  const handleOpenDialog = () => {
    setOpen(true)
  }
  const handleCloseDialog = () => {
    setOpen(false)
  }
  const handleNewFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewField(event.target.value)
  }
  const handleDefaultValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDefaultValue(Number(event.target.value))
  }

  const handleDeleteConfirm = (config: { id: number; field: string; value: number; isSwitchedOn: boolean }) => {
    // Set the field to be deleted
    setFieldToDelete(config)

    // Open the confirmation dialog
    setOpenDeleteDialog(true)
  }

  // Function to handle field deletion
  const handleFieldDeletion = () => {
    if (fieldToDelete) {
      // Send a request to delete the field using the new API endpoint
      axios
        .delete(`/api/configurations/${fieldToDelete.id}`)
        .then(response => {
          console.log(response.data)

          // Fetch updated configurations after deleting the field
          axios.get('/api/configurations').then(response => {
            setConfigurations(response.data)
            handleCloseDeleteDialog()
          })
        })
        .catch(error => {
          console.error('Error deleting field:', error)
        })
    }
  }

  // Function to close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setFieldToDelete(null)
  }

  const handleSaveNewField = () => {
    // Save the new field to the database with isSwitchedOn as true
    axios.post('/api/configurations', { field: newField, value: defaultValue, isSwitchedOn: true }).then(response => {
      console.log(response.data)

      // Fetch updated configurations after saving the new field
      axios.get('/api/configurations').then(response => {
        setConfigurations(response.data)
        handleCloseDialog()
      })
    })
  }

  const handleSliderChange = (field: string, id: number) => (event: Event, newValue: number | number[]) => {
    // Find the corresponding configuration and update its value
    const updatedConfigurations = configurations.map(config =>
      config.field === field && config.id === id ? { ...config, value: newValue as number } : config
    )
    setConfigurations(updatedConfigurations)
    setHasUpdates(true) // Value updated, set hasUpdates to true
  }

  const handleInputChange = (field: string, id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value)

    // Find the corresponding configuration and update its value
    const updatedConfigurations = configurations.map(config =>
      config.field === field && config.id === id ? { ...config, value: newValue || 0 } : config
    )
    setConfigurations(updatedConfigurations)
    setHasUpdates(true) // Value updated, set hasUpdates to true
  }

  const handleBlur = (field: string, id: number) => () => {
    // Find the corresponding configuration and handle out-of-bounds values
    const numericValue = configurations.find(config => config.field === field && config.id === id)?.value
    if (typeof numericValue === 'number' && !isNaN(numericValue)) {
      if (numericValue < 0) {
        handleSliderChange(field, id)({} as Event, 0)
      } else if (numericValue > 100) {
        handleSliderChange(field, id)({} as Event, 100)
      }
    }
  }

  const handleSwitchChange = (field: string, id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    // Find the corresponding configuration and update its switch status
    const updatedConfigurations = configurations.map(config =>
      config.field === field && config.id === id ? { ...config, isSwitchedOn: event.target.checked } : config
    )
    setConfigurations(updatedConfigurations)
    setHasUpdates(true) // Value updated, set hasUpdates to true
  }

  const handleSave = () => {
    // Save the updated configurations and threshold to the API
    axios
      .put('/api/configurations', configurations)
      .then(response => {
        console.log(response.data)
        setHasUpdates(false)
      })
      .catch(error => {
        console.error('Error updating configurations:', error)
      })
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 6 }}>
                <Typography variant='h6'>Configurations</Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                  Adjust the severity of malicious indicators
                </Typography>
              </Box>
              <Box>
                {configurations.filter(config => config.field !== 'Threshold').map(config => (
                  <Grid key={config.id} container spacing={2} alignItems='center'>
                      <Grid item xs={12} md={12}>
                        <React.Fragment>
                          <Typography id={`${config.field}-slider`} gutterBottom>
                            {config.field}
                          </Typography>
                          <Grid container spacing={2} alignItems='center'>
                            <Grid item xs>
                              <Slider
                                value={config.value}
                                onChange={handleSliderChange(config.field, config.id)}
                                aria-labelledby={`${config.field}-slider`}
                                disabled={!config.isSwitchedOn}
                              />
                            </Grid>
                            <Grid item>
                              <StyledInput
                                value={config.value}
                                size='small'
                                onChange={handleInputChange(config.field, config.id)}
                                onBlur={handleBlur(config.field, config.id)}
                                inputProps={{
                                  step: 10,
                                  min: 0,
                                  max: 100,
                                  type: 'number',
                                  'aria-labelledby': `${config.field}-slider`
                                }}
                                disabled={!config.isSwitchedOn}
                              />
                            </Grid>
                            <Grid item>
                              <Switch
                                checked={config.isSwitchedOn}
                                onChange={handleSwitchChange(config.field, config.id)}
                              />
                            </Grid>
                            <IconButton color='error' aria-label='delete' onClick={() => handleDeleteConfirm(config)}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </React.Fragment>
                      </Grid>

                  </Grid>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 6 }}>
                <Typography variant='h6'>Threshold</Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                  Adjust the threshold Value
                </Typography>
              </Box>
              <Box>
                {configurations.filter(config => config.field === 'Threshold').map(config => (
                  <Grid key={config.id} container spacing={2} alignItems='center'>
                      <Grid item xs={12} md={12}>

                          <Typography id={`${config.field}-slider`} gutterBottom>
                            {config.field}
                          </Typography>
                          <Grid container spacing={2} alignItems='center'>
                            <Grid item xs>
                              <Slider
                                value={config.value}
                                onChange={handleSliderChange(config.field, config.id)}
                                aria-labelledby={`${config.field}-slider`}
                                disabled={!config.isSwitchedOn}
                              />
                            </Grid>
                            <Grid item>
                              <StyledInput
                                value={config.value}
                                size='small'
                                onChange={handleInputChange(config.field, config.id)}
                                onBlur={handleBlur(config.field, config.id)}
                                inputProps={{
                                  step: 10,
                                  min: 0,
                                  max: 100,
                                  type: 'number',
                                  'aria-labelledby': `${config.field}-slider`
                                }}
                                disabled={!config.isSwitchedOn}
                              />
                            </Grid>
                          </Grid>

                      </Grid>

                  </Grid>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
        {hasUpdates && (
          <Button onClick={handleSave} variant='contained' color='primary' sx={{ m: 5 }}>
            Save
          </Button>
        )}
        <Button onClick={handleOpenDialog} variant='contained' color='primary' sx={{ m: 5 }}>
          Add Configuration
        </Button>
      </Box>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add New Slider</DialogTitle>
        <DialogContent>
          <TextField label='Field Name' value={newField} onChange={handleNewFieldChange} fullWidth margin='normal' />
          <TextField
            label='Default Value'
            type='number'
            value={defaultValue}
            onChange={handleDefaultValueChange}
            fullWidth
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSaveNewField} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Configuration Field</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to delete this configuration field?</Typography>
          {fieldToDelete && (
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              Field: {fieldToDelete.field}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleFieldDeletion} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
