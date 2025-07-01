import React, { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import CircularCountdown from '@/components/shared/CircularCountdown';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleSendOtp = async () => {
        if (!email) return showErrorToast('Email is required');
        try {
            setLoading(true);
            await axios.post(`${USER_API_END_POINT}/send-otp`, {
                email,
                purpose: 'reset-password',
            });
            setOtpSent(true);
            setTimerExpired(false);
            setTimeLeft(60);
            showSuccessToast('OTP sent to your email');
        } catch (err) {
            showErrorToast(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) return showErrorToast('Enter valid 6-digit OTP');
        if (!email) return showErrorToast('Email is missing');
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, {
                email,
                otp,
                purpose: 'reset-password',
                newPassword,
            });
            showSuccessToast(res.data.message);
            navigate('/login');
        } catch (err) {
            showErrorToast(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (otpSent && !timerExpired) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setTimerExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpSent, timerExpired]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex items-center justify-center px-4">
                <form className="w-full max-w-lg mt-12 bg-white p-8 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>

                    <div className="mb-4">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={otpSent}
                        />
                    </div>

                    {otpSent && (
                        <div className="mb-4">
                            <Label>OTP</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    disabled={timerExpired || loading}
                                    className="w-32 text-center text-lg font-semibold"
                                    value={otp}
                                    //   onChange={(e) => setOtp(e.target.value)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) setOtp(value); // allow only digits
                                    }}
                                    placeholder="Enter OTP"
                                />
                                <CircularCountdown duration={120} timeLeft={timeLeft} />
                            </div>
                            {timerExpired && (                               
                                <Button type="button" onClick={handleSendOtp} className="mt-4 w-full" disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resending...
                                        </span>
                                    ) : (
                                        'Resend OTP'
                                    )}
                                </Button>

                            )}
                        </div>
                    )}

                    {otpSent && (
                        <div className="mb-4">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                disabled={timerExpired}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                    )}

                    {!otpSent ? (                      
                        <Button type="button" className="w-full mt-4" onClick={handleSendOtp} disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending OTP...
                                </span>
                            ) : (
                                'Send OTP'
                            )}
                        </Button>

                    ) : (
                        <Button type="button" className="w-full mt-4" onClick={handleVerifyOtp} disabled={loading || timerExpired}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>

                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
