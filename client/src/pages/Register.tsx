import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Axios from "@/utils/newRequest";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MyButton, MyInput } from "@/ui";
import { Spacing } from "@/styles/proportions";

interface FormValues {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [usernamePassFields, setUsernameEmailFields] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<string | null>(null);

  const validationSchema = Yup.object({
    username: Yup.string().min(3).max(18).required(),
    email: Yup.string().email().required(),
    password: Yup.string()
      .min(8)
      .max(16)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 8 and 16 characters long"
      )
      .required(),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await Axios.post("/auth/register", values);
        const userId = data.userId;
        if (data.error === "email already exists") {
          formik.setErrors({ email: data.error });
        } else {
          // Registration successful
          toast.success("Register Successfuly");
          localStorage.setItem("userId", userId);
          navigate("/home");
          window.location.reload();
        }
      } catch (error) {
        // Handle error
        console.log(error);
      }
    },
  });

  const handleCheckEmail = async () => {
    try {
      const response = await Axios.post("/auth/check-email", {
        email: formik.values.email,
      });
      if (response.data === "email already exists") {
        formik.setErrors({ email: response.data });
      } else {
        setEmailAvailable(response.data);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e); // Update formik state with new email value
    setEmailAvailable(null); // Reset email availability when email is edited
  };

  return (
    <Container>
      <Box>
        <Title>Register</Title>
        <Form onSubmit={formik.handleSubmit}>
          {usernamePassFields ? (
            <>
              <FormGroup>
                <MyInput
                  label="username"
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormGroup>
              <FormGroup>
                <MyInput
                  label="password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <FormikErrors>{formik.errors.password}</FormikErrors>
                ) : null}
              </FormGroup>
              <MyButton type="submit" variant="contained" bg="">
                {formik.isSubmitting ? "Registering ..." : "Register"}
              </MyButton>
            </>
          ) : (
            <>
              <FormGroup>
                <MyInput
                  label="email"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={handleEmailChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <FormikErrors>{formik.errors.email}</FormikErrors>
                ) : null}
                {emailAvailable && (
                  <EmailAvailable>{emailAvailable}</EmailAvailable>
                )}
              </FormGroup>
              {emailAvailable === "Email Available" && !formik.errors.email ? (
                <MyButton
                  onClick={() => setUsernameEmailFields(true)}
                  variant="contained"
                  bg=""
                >
                  Submit
                </MyButton>
              ) : (
                <MyButton onClick={handleCheckEmail} variant="contained" bg="">
                  Check
                </MyButton>
              )}
            </>
          )}
        </Form>
        <MyButton bg="">
          <Link to="/login">Already have an account ?</Link>
        </MyButton>
      </Box>
    </Container>
  );
};

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

const Title = styled.h3`
  margin-top: 0;
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

const EmailAvailable = styled.div`
  color: green;
  padding: ${Spacing.medium.margin} 0;
`;

export default Register;
