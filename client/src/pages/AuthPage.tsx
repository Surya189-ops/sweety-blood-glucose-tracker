import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      navigate('/', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand">
          <span className="brand-icon"><Heart size={22} fill="white" /></span>
          <span>Sweety</span>
        </div>

        <div className="visual-content">
          <div className="visual-pill">
            <Activity size={15} /> YOUR HEALTH, YOUR CONTROL
          </div>
          <h1>Small steps.<br />Healthier <span>tomorrows.</span></h1>
          <p>
            Make sense of your glucose journey with simple tracking,
            meaningful insights and a little more peace of mind.
          </p>

          <div className="visual-card">
            <div className="visual-card-top">
              <span>YOUR DAILY WELLNESS</span>
              <span className="live-dot">● LIVE TRACKING</span>
            </div>
            <div className="visual-illustration">
              <div className="illustration-circle">
                <Activity size={48} strokeWidth={1.5} />
              </div>
              <div>
                <strong>Every reading matters.</strong>
                <span>Keep your health journey on track.</span>
              </div>
            </div>
            <div className="visual-bottom">
              <span><ShieldCheck size={15} /> Private & secure</span>
              <span>Made with <Heart size={13} fill="currentColor" /></span>
            </div>
          </div>
        </div>

        <div className="visual-footer">
          © 2026 Sweety Health. Take care of yourself.
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="mobile-brand">
            <span className="brand-icon"><Heart size={20} fill="white" /></span>
            <span>Sweety</span>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">WELCOME TO SWEETY</span>
            <h2>{isRegister ? 'Create your account' : 'Welcome back!'}</h2>
            <p>
              {isRegister
                ? 'Start your personal glucose tracking journey.'
                : 'Sign in to continue your wellness journey.'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={!isRegister ? 'active' : ''}
              onClick={() => { setIsRegister(false); setError(''); }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={isRegister ? 'active' : ''}
              onClick={() => { setIsRegister(true); setError(''); }}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={80}
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={isRegister ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting
                ? 'Please wait...'
                : isRegister ? 'Create my account' : 'Sign in to Sweety'}
            </button>
          </form>

          <div className="auth-secure">
            <ShieldCheck size={16} />
            Your health data is private and protected.
          </div>
        </div>
      </section>
    </main>
  );
}
