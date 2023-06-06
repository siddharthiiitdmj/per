import React from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CrmSalesOverview from 'src/views/dashboards/crm/CrmSalesOverview'

const index = () => {
  return (
    <>
      <ApexChartWrapper>
        <CrmSalesOverview />
      </ApexChartWrapper>
    </>
  )
}

export default index
