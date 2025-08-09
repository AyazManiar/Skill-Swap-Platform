import "./Login.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import visibility from "../../assets/icons/visibility.svg";
import visibilityOff from "../../assets/icons/visibilityOff.svg";
import { toastSuccess, toastError } from '../../lib/useToast';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  };
  const onSubmit = async (data) => {
    try {
      const res = await fetch(baseURL + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (responseData.userId) {
        setAuth({
          isLoggedIn: true,
          userId: responseData.userId,
          username: responseData.username,
          profilePicture: responseData.profilePicture,
          role: responseData.role || null,
          friendList: responseData.friendList || [],
        });
        navigate("/");
        toastSuccess("Login successful!");
      } else {
        toastError("Login failed: " + (responseData.message || "Unknown error"));
      }
    } catch (error) {
      toastError("Error occurred during login. Please try again later. Error: "+error);
    }
  };
  if (auth.isLoggedIn) {
    navigate("/");
  } else {
    return (
      <div className="Login">
        <div className="form-container">
          <div className="form-heading">
            <h2>Welcome Back</h2>
            <p>Sign in to your WebsiteName account to ...</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={errors.email && "errors-in-input"}
              {...register("email", emailValidation)}
            />
            <p className="error-message">{errors.email?.message}</p>
            {}
            <label htmlFor="password">Password</label>
            <div
              className={
                errors.password
                  ? "password-input errors-in-input"
                  : "password-input"
              }
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter the password"
                className={errors.password ? "errors-in-input" : ""}
                {...register("password")}
              />
              <img
                src={showPassword ? visibility : visibilityOff}
                alt={showPassword ? "Hide password" : "Show password"}
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Sign In"}
            </button>
            <p className="go-to-Signup">
              <span>Don't have an account?</span>
              <Link to="/signup">Sign up here</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
};
export default Login;
