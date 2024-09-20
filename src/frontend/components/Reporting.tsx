import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { DateRangePicker } from '@material-ui/lab';
import { fetchReportData } from 'src/frontend/store/actions/reportActions';
import { LoadingSpinner } from 'src/frontend/components/common/LoadingSpinner';
import { ErrorMessage } from 'src/frontend/components/common/ErrorMessage';
import { ReportData } from 'src/shared/types/report';
import { formatCurrency, formatDate } from 'src/frontend/utils/formatters';

const Reporting: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [reportType, setReportType] = useState<string>('salesOverview');
  
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: any) => state.report);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      dispatch(fetchReportData(dateRange[0], dateRange[1]));
    }
  }, [dispatch, dateRange]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const handleReportTypeChange = (type: string) => {
    setReportType(type);
  };

  const renderReport = () => {
    switch (reportType) {
      case 'salesOverview':
        return renderSalesOverview(data);
      case 'inventoryStatus':
        return renderInventoryStatus(data);
      case 'orderFulfillmentPerformance':
        return renderOrderFulfillmentPerformance(data);
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Reporting</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={() => handleReportTypeChange('salesOverview')}>Sales Overview</Button>
        <Button onClick={() => handleReportTypeChange('inventoryStatus')}>Inventory Status</Button>
        <Button onClick={() => handleReportTypeChange('orderFulfillmentPerformance')}>Order Fulfillment Performance</Button>
      </Grid>
      <Grid item xs={12}>
        {renderReport()}
      </Grid>
    </Grid>
  );
};

const renderSalesOverview = (reportData: ReportData) => {
  return (
    <Paper>
      <Typography variant="h5">Sales Overview</Typography>
      <LineChart width={600} height={300} data={reportData.salesData}>
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="totalSales" stroke="#8884d8" name="Total Sales" />
        <Line yAxisId="right" type="monotone" dataKey="numberOfOrders" stroke="#82ca9d" name="Number of Orders" />
      </LineChart>
    </Paper>
  );
};

const renderInventoryStatus = (reportData: ReportData) => {
  return (
    <Paper>
      <Typography variant="h5">Inventory Status</Typography>
      <BarChart width={600} height={300} data={reportData.inventoryData}>
        <XAxis dataKey="productName" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="currentStock" fill="#8884d8" name="Current Stock" />
        <Bar dataKey="reorderPoint" fill="#82ca9d" name="Reorder Point" />
      </BarChart>
    </Paper>
  );
};

const renderOrderFulfillmentPerformance = (reportData: ReportData) => {
  return (
    <Paper>
      <Typography variant="h5">Order Fulfillment Performance</Typography>
      <LineChart width={600} height={300} data={reportData.fulfillmentData}>
        <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="avgFulfillmentTime" stroke="#8884d8" name="Avg. Fulfillment Time (hours)" />
        <Line yAxisId="right" type="monotone" dataKey="orderAccuracy" stroke="#82ca9d" name="Order Accuracy (%)" />
      </LineChart>
    </Paper>
  );
};

export default Reporting;

// Human tasks:
// TODO: Implement additional report types as needed
// TODO: Add export functionality for report data
// TODO: Implement caching mechanism for frequently accessed report data
// TODO: Review and optimize chart rendering performance
// TODO: Implement user preferences for default report type and date range
// TODO: Add unit tests for the Reporting component and its sub-components