import { useState } from "react";
import {
  Car,
  User,
  Mail,
  Phone,
  Lock,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
const ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
];

/**
 * Reusable text input for the registration form.
 * Kept UI-only and controlled — the parent owns all state,
 * which makes it trivial to lift into a shared component library later.
 */
function FormField({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = true,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={name === "mobile" ? 10 : undefined}
          className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 shadow-sm outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

const INITIAL_FORM = {
  email: "",
  password: "",
  role: "",
};

function Login() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (!form.role) {
      newErrors.role = "Please select a role.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // const validateForm = () => {
  //   const newErrors = {};
  //   // Email
  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
  //     newErrors.email = "Enter a valid email address.";
  //   }
  //   // Password
  //   if (!Object.values(passwordRules).every(Boolean)) {
  //     newErrors.password = "Password doesn't meet all the required criteria.";
  //   }
  //   // Role
  //   if (!form.role) {
  //     newErrors.role = "Please select a role.";
  //   }
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;

  // if (!form.password.trim()) {
  //     newErrors.password = "Password is required.";
  // }
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let inputValue = value;
    if (name === "mobile") {
      inputValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Stubbed for now — swap this out for an Axios call to the Flask
  // /api/auth/register endpoint once the backend is ready. Keeping the
  // submit handler separate from the form UI means no JSX changes
  // will be needed when that wiring happens.
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   if (!validateForm()) {
  //     setSubmitting(false);
  //     return;
  //   }

  //   console.log("Successfully Logged in", form);
  //   setSubmitting(false);
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setSubmitting(true);

    const response = await api.post("/api/auth/login", {
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("token", response.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert("Login Successful");

    console.log(response.data);

  } catch (err) {

    alert(
      err.response?.data?.error ||
      "Login Failed"
    );

  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-5">
      {/*Branding panel */}
      <div className="lg:col-span-2 flex flex-col justify-between bg-[#F5F5F5] px-8 py-10 md:px-12 md:py-14">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
              <Car className="h-5.5 w-5.5 text-orange-500" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-slate-500">
              TRANSITOPS
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-bold text-slate-900 md:text-5xl">
            TransitOps
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Smart Transport Operations Platform
          </p>
        </div>

        <div className="my-10 md:my-0">
          {/* <p className="text-base leading-relaxed text-slate-700">
            Create your TransitOps account and start managing your transport
            operations efficiently.
          </p> */}

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-slate-500">
            Available roles
          </p>
          <ul className="mt-3 space-y-2.5">
            {ROLES.map((role) => (
              <li
                key={role}
                className="flex items-center gap-2.5 text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-sm">{role}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-400">TRANSITOPS &copy; 2026</p>
      </div>

      {/*Login form*/}
      <div className="lg:col-span-3 flex items-center justify-center bg-slate-950 px-6 py-12 md:px-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your credentials to Continue
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField
              label="Email Address"
              icon={Mail}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              error={errors.email}
            />
            <FormField
              label="Password"
              icon={Lock}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              error={errors.password}
            />
            {/* Role dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-300"
              >
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-4 pr-10 text-sm text-white shadow-sm outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                )}
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>


            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an Account?{" "}
            <Link
              to="/register"
              className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
