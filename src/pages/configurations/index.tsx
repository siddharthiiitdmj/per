import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

const Input = styled(MuiInput)`
  width: 42px;
`;

const Fields = ['isAppSpoofed'];

export default function Configurations() {
  const [values, setValues] = useState(
    Fields.reduce((acc, field) => {
      acc[field] = 30; // Default value for each field
      return acc;
    }, {})
  );

  const handleSliderChange = (field) => (event, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: newValue,
    }));
  };

  const handleInputChange = (field) => (event) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value);
    setValues((prevValues) => ({
      ...prevValues,
      [field]: newValue,
    }));
  };

  const handleBlur = (field) => () => {
    const numericValue = typeof values[field] === 'number' ? values[field] : parseInt(values[field] as string, 10);
    if (numericValue < 0) {
      setValues((prevValues) => ({
        ...prevValues,
        [field]: 0,
      }));
    } else if (numericValue > 100) {
      setValues((prevValues) => ({
        ...prevValues,
        [field]: 100,
      }));
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      {Fields.map((field) => (
        <React.Fragment key={field}>
          <Typography id={`${field}-slider`} gutterBottom>
            {field}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={values[field]}
                onChange={handleSliderChange(field)}
                aria-labelledby={`${field}-slider`}
              />
            </Grid>
            <Grid item>
              <Input
                value={values[field]}
                size="small"
                onChange={handleInputChange(field)}
                onBlur={handleBlur(field)}
                inputProps={{
                  step: 10,
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': `${field}-slider`,
                }}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
    </Box>
  );
}
