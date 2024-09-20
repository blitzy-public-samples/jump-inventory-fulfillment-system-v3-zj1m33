import React from 'react';
import styled from 'styled-components';
import Icon from 'src/frontend/components/common/Icon';

interface SummaryWidgetProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: number;
}

const WidgetContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  margin-left: 20px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  color: #6c757d;
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
`;

const ChangeIndicator = styled.div<{ isPositive: boolean }>`
  font-size: 12px;
  margin-top: 5px;
  color: ${props => props.isPositive ? '#28a745' : '#dc3545'};
`;

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({
  title,
  value,
  icon,
  color,
  change
}) => {
  return (
    <WidgetContainer>
      <IconContainer color={color}>
        <Icon name={icon} color="#ffffff" />
      </IconContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Value>{value}</Value>
        {change !== undefined && (
          <ChangeIndicator isPositive={change >= 0}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </ChangeIndicator>
        )}
      </ContentContainer>
    </WidgetContainer>
  );
};

export default SummaryWidget;