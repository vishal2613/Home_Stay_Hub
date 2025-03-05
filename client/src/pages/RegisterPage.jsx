import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'profileImage' ? files[0] : value,
    }));
  };

  // Validate password match
  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
      formData.confirmPassword === ''
    );
  }, [formData.password, formData.confirmPassword]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerForm = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          registerForm.append(key, formData[key]);
        }
      }

      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        body: registerForm,
      });

      if (response.ok) {
        navigate('/login');
      } else {
        console.log('Registration failed with status:', response.status);
      }
    } catch (err) {
      console.log('Registration failed', err.message);
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {!passwordMatch && (
            <p style={{ color: 'red' }}>Passwords do not match!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: '80px' }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
