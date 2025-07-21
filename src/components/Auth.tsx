"use client";


import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useNavigate } from "react-router-dom";
import { AuthService } from '../features/auth/AuthService';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await AuthService.signIn(email, password);
      alert('Logged in successfully!');
      navigate('/'); // Redirect to home or another page after login
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await AuthService.signUp(email, password);
      alert('Signed up successfully! Check your email for verification.');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const SubmitButton = ({ children }: { children: React.ReactNode }) => {
    const { pending } = useFormStatus();
    return (
      <button className="button block" type="submit" disabled={pending} onClick={children === 'Sign In' ? handleLogin : handleSignUp}>
        {pending ? 'Loading...' : children}
      </button>
    );
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase Auth</h1>
        <p className="description">Sign in or sign up via email and password</p>
        <form>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <SubmitButton>Sign In</SubmitButton>
            <SubmitButton>Sign Up</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
