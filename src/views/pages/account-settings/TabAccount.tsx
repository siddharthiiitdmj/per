// ** React Imports
import api from 'src/helper/api'
import { ChangeEvent, ElementType, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Third Party Imports

// ** Icon Imports
import { getSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Data {
  state: string
  address: string
  country: string
  lastName: string
  language: string
  firstName: string
  organisation: string
  phoneNumber: number | string
  zipcode: number | string
}

const initialData: Data = {
  state: '',
  phoneNumber: '',
  address: '',
  zipcode: '',
  lastName: '',
  firstName: '',
  language: '',
  country: '',
  organisation: ''
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: 4,
  marginRight: theme.spacing(5)
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  // ** State
  const [inputValue, setInputValue] = useState<string>('')
  const [formData, setFormData] = useState<Data>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('')

  const storedUserData = localStorage.getItem('userData') as string
  const userData = JSON.parse(storedUserData)
  const email = userData?.email

  // ** Hooks
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({ defaultValues: { checkbox: false } })

  // const handleSecondDialogClose = () => setSecondDialogOpen(false)

  // const onSubmit = () => setOpen(true)

  const onFormSubmit = async () => {
    await getSession().then(session => {
      const email = session?.user.email
      api
        .post('/updateprofile', {
          email,
          ...formData
        })
        .then(() => {
          toast.success('Profile Updated Successfully')
          setFormData(initialData)
          window.location.reload()
        })
        .catch(error => {
          toast.error(`${error.response.data.error}`)
        })
    })
  }

  // const handleConfirmation = (value: string) => {
  //   handleClose()
  //   setUserInput(value)
  //   setSecondDialogOpen(true)
  // }

  useEffect(() => {
    const getUserProfile = async () => {
      await getSession().then(async session => {
        const email = session?.user.email
        try {
          const response = await api.get('/getuserprofile', {
            params: {
              email: email
            }
          })
          setFormData(response.data)
          console.log('Response:', response.data)
        } catch (error) {
          console.error('Error:', error)
        }
      })
    }
    getUserProfile()
  }, [initialData])

  useEffect(() => {
    if (imgSrc !== '') {
      const postData = async () => {
        try {
          const response = await api.post('/users/me', {
            email,
            imgSrc
          })
          console.log('Response:', response.data)
        } catch (error) {
          console.error('Error:', error)
        }
      }

      postData()
    }
  }, [imgSrc])
  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <form>
            <CardContent sx={{ pb: theme => `${theme.spacing(10)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc ? imgSrc : '/images/avatars/1.png'} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept='image/png, image/jpeg'
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='caption' sx={{ mt: 4, display: 'block', color: 'text.disabled' }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
              </Box>
            </CardContent>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={e => handleFormChange('firstName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={e => handleFormChange('lastName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Organization'
                    placeholder=''
                    value={formData.organisation}
                    onChange={e => handleFormChange('organisation', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Phone Number'
                    value={formData.phoneNumber}
                    placeholder=''
                    onChange={e => handleFormChange('phoneNumber', e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Address'
                    placeholder='Address'
                    value={formData.address}
                    onChange={e => handleFormChange('address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='State'
                    placeholder='California'
                    value={formData.state}
                    onChange={e => handleFormChange('state', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Zip Code'
                    placeholder='231465'
                    value={formData.zipcode}
                    onChange={e => handleFormChange('zipcode', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Country'
                    placeholder='US'
                    value={formData.country}
                    onChange={e => handleFormChange('country', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Language'
                    placeholder='English'
                    value={formData.language}
                    onChange={e => handleFormChange('language', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button variant='contained' sx={{ mr: 4 }} onClick={onFormSubmit}>
                    Save Changes
                  </Button>
                  <Button type='reset' variant='outlined' color='secondary' onClick={() => setFormData(initialData)}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TabAccount
