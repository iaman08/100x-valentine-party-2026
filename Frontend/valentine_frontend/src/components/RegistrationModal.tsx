import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowLeft, Gift, UserPlus, Heart, Loader2, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { verifyReferralCode, registerUser, generateTicketId } from "@/lib/api";

type ModalStep = "choice" | "referral" | "register" | "pending" | "success";

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<ModalStep>("choice");
    const [referralCode, setReferralCode] = useState("");
    const [validatedReferralCode, setValidatedReferralCode] = useState<string | null>(null);
    const [referralError, setReferralError] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [userReferralCode, setUserReferralCode] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ mobile?: string; dob?: string }>({});
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        dob: "",
        mobile: "",
        email: "",
    });

    const handleClose = () => {
        setStep("choice");
        setReferralCode("");
        setValidatedReferralCode(null);
        setReferralError("");
        setSuccessMessage("");
        setUserReferralCode(null);
        setFormData({ name: "", gender: "", dob: "", mobile: "", email: "" });
        onClose();
    };

    const handleBack = () => {
        setReferralError("");
        if (step === "register" && validatedReferralCode) {
            setStep("referral");
        } else {
            setStep("choice");
            setValidatedReferralCode(null);
        }
    };

    // Validate referral code via backend API
    const validateReferralCode = async () => {
        setIsValidating(true);
        setReferralError("");

        try {
            const response = await verifyReferralCode(referralCode);

            if (response.valid) {
                // Code is valid - save it and proceed to registration form
                setValidatedReferralCode(referralCode.toUpperCase());
                setStep("register");
            } else {
                setReferralError(response.message || "Invalid referral code. Please try again.");
            }
        } catch (error) {
            console.error("Referral validation error:", error);
            setReferralError("Failed to validate code. Please try again.");
        } finally {
            setIsValidating(false);
        }
    };

    // Validate mobile number - exactly 10 digits
    const validateMobile = (mobile: string): string | undefined => {
        const digitsOnly = mobile.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            return "Mobile number must be exactly 10 digits";
        }
        return undefined;
    };

    // Validate DOB - must be at least 18 years old
    const validateDOB = (dob: string): string | undefined => {
        if (!dob) return "Date of birth is required";

        const birthDate = new Date(dob);
        const today = new Date();

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return "You must be at least 18 years old";
        }
        return undefined;
    };

    // Handle mobile input - only allow digits
    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.length <= 10) {
            setFormData({ ...formData, mobile: value });
            // Clear error when user starts typing
            if (formErrors.mobile) {
                setFormErrors({ ...formErrors, mobile: undefined });
            }
        }
    };

    // Handle DOB change
    const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, dob: e.target.value });
        // Clear error when user changes date
        if (formErrors.dob) {
            setFormErrors({ ...formErrors, dob: undefined });
        }
    };

    // Submit registration form to backend
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form fields
        const mobileError = validateMobile(formData.mobile);
        const dobError = validateDOB(formData.dob);

        if (mobileError || dobError) {
            setFormErrors({ mobile: mobileError, dob: dobError });
            return;
        }

        setFormErrors({});
        setIsSubmitting(true);
        setReferralError("");

        try {
            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                phone: formData.mobile,
                referralCode: validatedReferralCode || undefined,
            });

            if (response.error) {
                // Handle error from backend
                setReferralError(response.message || response.error);
                return;
            }

            if (response.approved) {
                // User was auto-approved (campus student or valid referral)
                // Save referral code if generated (for campus students)
                if (response.referralCode) {
                    setUserReferralCode(response.referralCode);
                }

                // Generate ticket and navigate
                const ticketData = {
                    ...formData,
                    ticketId: generateTicketId(),
                    referralCode: response.referralCode,
                };
                onClose();
                navigate("/ticket", { state: ticketData });
            } else {
                // User is pending manual approval
                setSuccessMessage(response.message || "Your registration is pending approval.");
                setStep("pending");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setReferralError("Failed to submit registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    const getDirection = (newStep: ModalStep) => {
        if (newStep === "choice") return -1;
        return 1;
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-card border-pink-soft/50 p-0 overflow-hidden">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-50 p-2 rounded-full bg-muted hover:bg-pink-light transition-colors"
                >
                    <X className="w-4 h-4 text-foreground" />
                </button>

                {/* Back button */}
                <AnimatePresence>
                    {step !== "choice" && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={handleBack}
                            className="absolute left-4 top-4 z-50 p-2 rounded-full bg-muted hover:bg-pink-light transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 text-foreground" />
                        </motion.button>
                    )}
                </AnimatePresence>

                <div className="relative min-h-[400px] p-6 pt-14">
                    <AnimatePresence mode="wait" custom={getDirection(step)}>
                        {/* Step 1: Choice */}
                        {step === "choice" && (
                            <motion.div
                                key="choice"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center"
                                    >
                                        <Heart className="w-8 h-8 text-pink-hot fill-pink-hot" />
                                    </motion.div>
                                    <h2 className="font-display text-2xl text-foreground">Get Your Ticket</h2>
                                    <p className="text-muted-foreground text-sm">How would you like to register?</p>
                                </div>

                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setStep("referral")}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-hot to-coral text-white font-semibold flex items-center justify-center gap-3 shadow-cute hover:shadow-lg transition-shadow"
                                    >
                                        <Gift className="w-5 h-5" />
                                        With Referral Code
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setStep("register")}
                                        className="w-full p-4 rounded-xl bg-card border-2 border-pink-soft hover:border-pink-hot text-foreground font-semibold flex items-center justify-center gap-3 transition-colors"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        Without Referral Code
                                    </motion.button>
                                </div>

                                <p className="text-center text-muted-foreground text-xs">
                                    💕 Have a referral code? Get exclusive perks!
                                </p>
                            </motion.div>
                        )}

                        {/* Step 2a: Referral Code Input */}
                        {step === "referral" && (
                            <motion.div
                                key="referral"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center"
                                    >
                                        <Gift className="w-8 h-8 text-pink-hot" />
                                    </motion.div>
                                    <h2 className="font-display text-2xl text-foreground">Enter Referral Code</h2>
                                    <p className="text-muted-foreground text-sm">Enter your special code below</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            value={referralCode}
                                            onChange={(e) => setReferralCode(e.target.value)}
                                            placeholder="Enter code (e.g., VALENTINE2026)"
                                            className="text-center text-lg font-semibold tracking-wider bg-muted border-pink-soft focus:border-pink-hot uppercase"
                                        />
                                        <AnimatePresence>
                                            {referralError && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-red-500 text-sm text-center"
                                                >
                                                    {referralError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={validateReferralCode}
                                        disabled={!referralCode || isValidating}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-hot to-coral text-white font-semibold flex items-center justify-center gap-2 shadow-cute hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isValidating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Validating...
                                            </>
                                        ) : (
                                            "Validate Code ✨"
                                        )}
                                    </motion.button>
                                </div>

                                <p className="text-center text-muted-foreground text-xs">
                                    Don't have a code?{" "}
                                    <button onClick={() => setStep("register")} className="text-pink-hot hover:underline">
                                        Register without one
                                    </button>
                                </p>
                            </motion.div>
                        )}

                        {/* Step 2b: Registration Form */}
                        {step === "register" && (
                            <motion.div
                                key="register"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-5"
                            >
                                <div className="text-center space-y-2">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center"
                                    >
                                        <UserPlus className="w-8 h-8 text-pink-hot" />
                                    </motion.div>
                                    <h2 className="font-display text-2xl text-foreground">Your Details</h2>
                                    <p className="text-muted-foreground text-sm">Tell us about yourself 💕</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                            required
                                            className="bg-muted border-pink-soft focus:border-pink-hot"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                            >
                                                <SelectTrigger className="bg-muted border-pink-soft focus:border-pink-hot">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dob">Date of Birth</Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={formData.dob}
                                                onChange={handleDOBChange}
                                                required
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                                                className={`bg-muted border-pink-soft focus:border-pink-hot ${formErrors.dob ? "border-red-500" : ""}`}
                                            />
                                            {formErrors.dob && (
                                                <p className="text-red-500 text-xs">{formErrors.dob}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={10}
                                            value={formData.mobile}
                                            onChange={handleMobileChange}
                                            placeholder="10 digit number"
                                            required
                                            className={`bg-muted border-pink-soft focus:border-pink-hot ${formErrors.mobile ? "border-red-500" : ""}`}
                                        />
                                        {formErrors.mobile && (
                                            <p className="text-red-500 text-xs">{formErrors.mobile}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                            required
                                            className="bg-muted border-pink-soft focus:border-pink-hot"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {referralError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-red-500 text-sm text-center"
                                            >
                                                {referralError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        disabled={isSubmitting}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-hot to-coral text-white font-semibold shadow-cute hover:shadow-lg transition-shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Registering...
                                            </>
                                        ) : (
                                            "Register Now 🎟️"
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3: Pending Approval */}
                        {step === "pending" && (
                            <motion.div
                                key="pending"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center"
                                    >
                                        <Clock className="w-8 h-8 text-yellow-600" />
                                    </motion.div>
                                    <h2 className="font-display text-2xl text-foreground">Pending Approval</h2>
                                    <p className="text-muted-foreground text-sm">{successMessage}</p>
                                </div>

                                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                                    <p className="text-sm text-center text-muted-foreground">
                                        Your registration has been submitted! 🎉
                                    </p>
                                    <p className="text-sm text-center text-muted-foreground">
                                        An admin will review your request shortly. You'll receive an email once approved.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClose}
                                    className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-hot to-coral text-white font-semibold shadow-cute hover:shadow-lg transition-shadow"
                                >
                                    Got it! 👍
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RegistrationModal;
