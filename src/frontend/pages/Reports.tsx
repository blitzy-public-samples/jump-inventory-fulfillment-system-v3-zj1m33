import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart } from 'react-chartjs-2';
import Button from 'src/frontend/components/common/Button';
import Select from 'src/frontend/components/common/Select';
import DatePicker from 'src/frontend/components/common/DatePicker';
import Table from 'src/frontend/components/common/Table';
import useReports from 'src/frontend/hooks/useReports';
import useAuth from 'src/frontend/hooks/useAuth';
import { formatCurrency, formatDate } from 'src/shared/utils/index';

const ReportsPageContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ReportControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const ReportContent = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [filters, setFilters] = useState({});
  const { fetchReportData, reportData, loading, error } = useReports();

  useEffect(() => {
    if (user && !user.permissions.includes('view_reports')) {
      // Redirect or show error message for unauthorized access
    }
  }, [user]);

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(event.target.value);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({ startDate, endDate });
  };

  const handleGenerateReport = () => {
    fetchReportData(reportType, dateRange, filters);
  };

  const handleExportReport = () => {
    // Implement export functionality
    console.log('Exporting report...');
  };

  const renderReportContent = () => {
    if (loading) {
      return <div>Loading report data...</div>;
    }

    if (error) {
      return <div>Error loading report: {error}</div>;
    }

    if (!reportData) {
      return <div>No report data available. Generate a report to view data.</div>;
    }

    switch (reportType) {
      case 'sales':
        return <Table data={reportData} columns={/* Define columns */} />;
      case 'inventory':
        return <Table data={reportData} columns={/* Define columns */} />;
      case 'productPerformance':
        return <Chart type="bar" data={reportData} options={/* Define options */} />;
      default:
        return <div>Select a report type to view data.</div>;
    }
  };

  return (
    <ReportsPageContainer>
      <Header>Reports</Header>
      <ReportControls>
        <Select
          options={[
            { value: 'sales', label: 'Sales Report' },
            { value: 'inventory', label: 'Inventory Report' },
            { value: 'productPerformance', label: 'Product Performance' },
          ]}
          value={reportType}
          onChange={handleReportTypeChange}
        />
        <DatePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={handleDateRangeChange}
        />
        <Button onClick={handleGenerateReport}>Generate Report</Button>
      </ReportControls>
      <ReportContent>
        {renderReportContent()}
      </ReportContent>
      <Button onClick={handleExportReport}>Export Report</Button>
    </ReportsPageContainer>
  );
};

export default Reports;