import React from "react";
import styled from "styled-components";

const NoDataToShows: React.FC = () => {
  return (
    <Container>
      <Title>No Data to Show</Title>
      <Message>You've no completed transactions yet</Message>
    </Container>
  );
};

export default NoDataToShows;

const Container = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
`;