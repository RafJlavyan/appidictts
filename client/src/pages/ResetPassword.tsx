import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Axios from "@/utils/newRequest";
import { toast } from "react-hot-toast";
import { MyButton, MyInput } from "@/ui";
import { Spacing } from "@/styles/proportions";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/auth/reset-password", {
        email,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setEmail("");
        toast.success("Message sent, check your email");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Box>
        <Form onSubmit={resetPassword}>
          <FormGroup>
            <MyInput
              label="email"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <MyButton type="submit" variant="contained" bg="">
            Submit
          </MyButton>
        </Form>
        <MyButton bg="">
          <Link to="/register">if you don't have an account! Register</Link>
        </MyButton>
      </Box>
    </Container>
  );
};

export default ResetPassword;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    margin: ${Spacing.small.margin} 0;
  }
`;

const Box = styled.div`
  width: 350px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: ${Spacing.medium.padding};
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;
