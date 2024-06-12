import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MyButton, MyInput } from "@/ui";
import Axios from "@/utils/newRequest";
import { useFormik } from "formik";
import * as Yup from "yup";
import GoogleButton from "react-google-button";
import { Spacing } from "@/styles/proportions";
import env from "@/env";

const Login: React.FC = React.memo(() => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () =>
    window.open(`${env.SERVER_URL}/oauth/auth/google/callback`, "_self");

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        const { data } = await Axios.post("/auth/login", values);
        const userId = data.userId;
        if (data.error) {
          if (data.error === "user does not exist") {
            setErrors({ email: "User does not exist" });
            console.log(data);
          } else if (data.error === "incorrect password") {
            setErrors({ password: "Incorrect password" });
          }
        } else {
          localStorage.setItem("userId", userId);
          toast.success("Authentication successful");
          navigate(`/home`);
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Container>
      <Box>
        <Title>Login</Title>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <MyInput
              label="email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormGroup>
          {formik.touched.email && formik.errors.email ? (
            <FormikErrors>{formik.errors.email}</FormikErrors>
          ) : null}
          <FormGroup>
            <MyInput
              label="password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormGroup>
          {formik.touched.password && formik.errors.password ? (
            <FormikErrors>{formik.errors.password}</FormikErrors>
          ) : null}
          <MyButton
            type="submit"
            disabled={formik.isSubmitting}
            variant="contained"
            bg=""
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </MyButton>
        </Form>
        <GoogleButton onClick={handleGoogleLogin} />
        <MyButton bg="">
          <Link to="/reset-password">Forget your password ?</Link>
        </MyButton>
        <MyButton bg="">
          <Link to="/register">Don't have an account yet ?</Link>
        </MyButton>
      </Box>
    </Container>
  );
});

export default Login;

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

const Title = styled.h2`
  text-align: center;
  padding: ${Spacing.medium.margin} 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormikErrors = styled.div`
  color: red;
  padding: ${Spacing.medium.margin} 0;
`;
