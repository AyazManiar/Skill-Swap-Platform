import "./Signup.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
// Icons
import visibility from "../../assets/icons/visibility.svg";
import visibilityOff from "../../assets/icons/visibilityOff.svg";
import tick from "../../assets/icons/tick.svg";
import cross from "../../assets/icons/cross.svg";
// Toast
import { toastSuccess, toastError } from '../../lib/useToast';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const Signup = () => {
	const { auth, setAuth } = useContext(AuthContext)
	const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const passwordValue = watch("password", "");
  const confirmPasswordValidation = {
    required: "Please confirm your password",
    validate: (value) =>
      value === passwordValue || "Passwords do not match",
  };

  const usernameValidation = {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Must be at least 3 characters",
    },
  };
  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "At least 8 characters",
    },
    validate: {
      upper: (v) => /[A-Z]/.test(v) || "Need an uppercase letter",
      num: (v) => /\d/.test(v) || "Need a number",
      sym: (v) => /[!@#$%^&*]/.test(v) || "Need a symbol",
    },
  };
  
  const onSubmit = async (data) => {
    try {
      const res = await fetch(baseURL + '/api/auth/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data)
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
        toastSuccess("Signup successful!");
      } else {
        toastError("Signup failed: " + (responseData.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Error occurred during signup:', error);
      toastError("Error occurred during signup. Please try again later. Error: "+error)
    }
  };


  const checks = {
    length: enteredPassword.length >= 8,
    uppercase: /[A-Z]/.test(enteredPassword),
    number: /\d/.test(enteredPassword),
    symbol: /[!@#$%^&*]/.test(enteredPassword),
  }
  const strength = Object.values(checks).filter(Boolean).length;
  const tickComponent = () => {
    return <img width="22" src={tick} />
  }
  const crossComponent = () => {
    return <img width="22" src={cross} />
  }

  if(auth.isLoggedIn){
	  navigate("/");
  } else{
  return (
    <div className="Signup">
      <div className="form-container">
        <div className="form-heading">
          <h2>Join WebsiteName</h2>
          <p>Create your account and start ...</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className={errors.username ? "errors-in-input" : ""}
            {...register("username", usernameValidation)}
          />
          <p className="error-message">{errors.username?.message}</p>

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className={errors.email ? "errors-in-input" : ""}
            {...register("email", emailValidation)}
          />
          <p className="error-message">{errors.email?.message}</p>

          {/* Password */}
          <label htmlFor="password">Password</label>
          <div className={errors.password ? 
							"password-input errors-in-input" : "password-input"}
					>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create a password"
              className={errors.password ? "errors-in-input" : ""}
              {...register("password", passwordValidation)}
              onChange={(e) => setEnteredPassword(e.target.value)}
            />
            <img
                src={showPassword ? visibility : visibilityOff}
                alt={showPassword ? "Hide password" : "Show password"}
                aria-label="Toggle password visibility"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              />
          </div>
          {/* Progress Bar */}
          <div className="password-strength-bar">
            <div className="fill" style={{ width: `${(strength / 4) * 100}%` }} />
          </div>
          {/* Password Criteria */}
          <div className="password-criteria">
            <div className={checks.length ? "criteria-met" : "criteria"}>
              {checks.length ? tickComponent() : crossComponent()} At least 8 characters
            </div>
            <div className={checks.uppercase ? "criteria-met" : "criteria"}>
              {checks.uppercase ? tickComponent() : crossComponent()} One uppercase letter
            </div>
            <div className={checks.number ? "criteria-met" : "criteria"}>
              {checks.number ? tickComponent() : crossComponent()} One number
            </div>
            <div className={checks.symbol ? "criteria-met" : "criteria"}>
              {checks.symbol ? tickComponent() : crossComponent()} One special character
            </div>
          </div>

          {/* Confirm Password */}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Re-enter your password"
            className={errors.confirmPassword ? "errors-in-input" : ""}
            {...register("confirmPassword", confirmPasswordValidation)}
          />
          <p className="error-message">{errors.confirmPassword?.message}</p>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>

          {/* Link to Login */}
          <p className="go-to-Signup">
            <span>Already have an account?</span>
            <Link to="/login">Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
  }
}

export default Signup;
