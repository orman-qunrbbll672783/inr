import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import MessagingModal from './MessagingModal';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc,
    getDocs,
    addDoc,
    onSnapshot,
    updateDoc,
    query,
    where
} from 'firebase/firestore';

// --- Configuration ---
// Using the configuration you provided from your local setup.
const firebaseConfig = {
  apiKey: "AIzaSyDLbHa6RgZFDTxnkEUlXGfBiM-DSsWEAhQ",
  authDomain: "b2b-plat.firebaseapp.com",
  projectId: "b2b-plat",
  storageBucket: "b2b-plat.appspot.com",
  messagingSenderId: "288936676911",
  appId: "1:288936676911:web:52ba1c723b533d2aaac0da",
  measurementId: "G-7C0C1DWZYF"
};

const appId = 'b2b-plat'; // Use your actual Firebase project ID

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


// --- SVG Icon Components ---
const BuildingIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
);
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.61C34.566 5.844 29.63 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.229 2.196-1.996 4.76-1.996 7.309c0 2.549.767 5.113 1.996 7.309l5.34-4.148c-.461-1.333-.734-2.79-.734-4.161s.273-2.828.734-4.161L6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-5.34-4.148c-1.825 1.22-4.128 1.96-6.069 1.96c-4.42 0-8.33-2.46-10.207-6.182l-5.337 4.147C8.06 39.223 15.424 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.34 4.148C40.929 34.699 44 29.822 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
);
const ArrowLeftIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const ShieldIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

// --- UI Helper Components ---
const OnboardingWrapper = ({ children, title, step, totalSteps }) => (
    <div className="w-full max-w-lg mx-auto text-center animate-fade-in">
        <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600">STEP {step} OF {totalSteps}</p>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight mt-1">{title}</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
            {children}
        </div>
    </div>
);

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-6 left-6 flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors z-10">
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
    </button>
);

// --- Onboarding Screens ---

const RoleSelectionScreen = ({ onSelectRole }) => (
    <OnboardingWrapper title="Select Your Role" step={1} totalSteps={4}>
        <div className="space-y-4">
            <div onClick={() => onSelectRole('Leasing Company')} className="relative p-6 bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500 overflow-hidden group">
                <BuildingIcon className="w-12 h-12 mx-auto text-indigo-500 mb-3 transition-transform duration-300 group-hover:scale-110" />
                <h2 className="text-xl font-semibold text-gray-800">Leasing Company</h2>
                <p className="text-gray-500 mt-1 text-sm">Manage assets, contracts, and client relationships.</p>
            </div>
            
            <div onClick={() => onSelectRole('Insurance Company')} className="relative p-6 bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-500 overflow-hidden group">
                <ShieldIcon className="w-12 h-12 mx-auto text-emerald-500 mb-3 transition-transform duration-300 group-hover:scale-110" />
                <h2 className="text-xl font-semibold text-gray-800">Insurance Company</h2>
                <p className="text-gray-500 mt-1 text-sm">Receive and manage inquiries from leasing companies.</p>
            </div>
        </div>
    </OnboardingWrapper>
);

const CompanyNameScreen = ({ onNext, onBack, companyName, setCompanyName, selectedRole }) => {
    const isInsuranceCompany = selectedRole === 'Insurance Company';
    const popularInsuranceCompanies = [
        'Atəşgah Sığorta',
        'Paşa Sığorta', 
        'Qala Sığorta',
        'Meqa Sığorta'
    ];

    return (
        <>
            <BackButton onClick={onBack} />
            <OnboardingWrapper title="Company Name" step={2} totalSteps={4}>
                <form onSubmit={onNext} className="space-y-6">
                    <p className="text-gray-600">
                        {isInsuranceCompany 
                            ? 'What is the name of your insurance company?' 
                            : 'What is the name of your leasing company?'
                        }
                    </p>
                    
                    {isInsuranceCompany && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-3">Popular insurance companies:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {popularInsuranceCompanies.map((company) => (
                                    <button
                                        key={company}
                                        type="button"
                                        onClick={() => setCompanyName(company)}
                                        className={`p-3 text-sm rounded-lg border transition-all duration-200 ${
                                            companyName === company
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                        }`}
                                    >
                                        {company}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-200"></div>
                                <span className="px-3 text-xs text-gray-400">OR</span>
                                <div className="flex-1 border-t border-gray-200"></div>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="companyName" className="sr-only">Company Name</label>
                        <input 
                            id="companyName" 
                            type="text" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg text-center"
                            placeholder={isInsuranceCompany ? 'e.g., Your Insurance Company' : 'e.g., Acme Leasing Inc.'}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!companyName} 
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
                            isInsuranceCompany
                                ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400'
                        }`}
                    >
                        Continue
                    </button>
                </form>
            </OnboardingWrapper>
        </>
    );
};

const VoenScreen = ({ onNext, onBack, voen, setVoen }) => {
    const [error, setError] = useState('');

    const handleVoenChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        if (value.length <= 10) {
            setVoen(value);
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (voen.length === 10) {
            onNext();
        } else {
            setError('VÖEN must be exactly 10 digits.');
        }
    };

    return (
        <>
            <BackButton onClick={onBack} />
            <OnboardingWrapper title="VÖEN Number" step={3} totalSteps={4}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-600">Please enter your company's 10-digit VÖEN.</p>
                    <div>
                        <label htmlFor="voen" className="sr-only">VÖEN</label>
                        <input 
                            id="voen" 
                            type="text" 
                            value={voen}
                            onChange={handleVoenChange}
                            required
                            pattern="\d{10}"
                            title="VÖEN must be 10 digits"
                            className={`mt-1 block w-full px-4 py-3 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-lg text-center ${error ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="1234567890"
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <button type="submit" disabled={voen.length !== 10} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        Continue
                    </button>
                </form>
            </OnboardingWrapper>
        </>
    );
};

const SignUpScreen = ({ onBack, onSignUp, loading }) => (
    <>
        <BackButton onClick={onBack} />
        <OnboardingWrapper title="Create Your Account" step={4} totalSteps={4}>
            <div className="space-y-6">
                <p className="text-gray-600">You're almost there! Create your account to save your information and access the dashboard.</p>
                <button onClick={onSignUp} disabled={loading} className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200">
                    {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div> : <><GoogleIcon /> Sign Up with Google</>}
                </button>
            </div>
        </OnboardingWrapper>
    </>
);


// --- Main App Screens ---

const UserIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const DocumentIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
);

const UploadIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const DashboardScreen = ({ user, profileData }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontImagePreview, setFrontImagePreview] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('pending'); // pending, uploading, completed, insurance_selection
    const [dragActive, setDragActive] = useState({ front: false, back: false });
    const [insuranceCompanies, setInsuranceCompanies] = useState([]);
    const [selectedInsurers, setSelectedInsurers] = useState({});
    const [loadingInsurers, setLoadingInsurers] = useState(false);
    
    // Messaging state for leasing companies
    const [showMessaging, setShowMessaging] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [sentInquiries, setSentInquiries] = useState([]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };



    const handleImageUpload = async (file, type) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                
                // No validation - accept any image
                if (type === 'front') {
                    setFrontImage(file);
                    setFrontImagePreview(imageData);
                } else {
                    setBackImage(file);
                    setBackImagePreview(imageData);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file (JPG, PNG, etc.)');
        }
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        setDragActive({ front: false, back: false });
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0], type);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e, type) => {
        e.preventDefault();
        setDragActive(prev => ({ ...prev, [type]: true }));
    };

    const handleDragLeave = (type) => {
        setDragActive(prev => ({ ...prev, [type]: false }));
    };

    const handleFileSelect = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, type);
        }
    };

    const handleSubmit = async () => {
        if (!frontImage || !backImage) {
            alert('Please upload both front and back images of your Technical Registration Passport.');
            return;
        }

        setUploadStatus('uploading');
        
        // Simulate upload process
        setTimeout(() => {
            setUploadStatus('completed');
        }, 2000);
    };

    const fetchInsuranceCompanies = async () => {
        setLoadingInsurers(true);
        try {
            console.log('Fetching insurance companies from path:', `artifacts/${appId}/users`);
            
            // Query Firestore for all users with role 'Insurance Company'
            const usersRef = collection(db, `artifacts/${appId}/users`);
            const snapshot = await getDocs(usersRef);
            
            console.log('Found', snapshot.size, 'users in total');
            
            const companies = [];
            for (const userDoc of snapshot.docs) {
                console.log('Checking user:', userDoc.id);
                
                const profileRef = doc(db, `artifacts/${appId}/users/${userDoc.id}/profile`, 'userProfile');
                const profileSnap = await getDoc(profileRef);
                
                if (profileSnap.exists()) {
                    const profileData = profileSnap.data();
                    console.log('Profile data for', userDoc.id, ':', profileData);
                    
                    if (profileData.role === 'Insurance Company') {
                        console.log('Found insurance company:', profileData.companyName);
                        companies.push({
                            id: userDoc.id,
                            ...profileData
                        });
                    }
                } else {
                    console.log('No profile found for user:', userDoc.id);
                }
            }
            
            console.log('Total insurance companies found:', companies.length);
            setInsuranceCompanies(companies);
            
            if (companies.length === 0) {
                console.log('No insurance companies found. Make sure at least one user has role "Insurance Company"');
            }
        } catch (error) {
            console.error('Error fetching insurance companies:', error);
            alert(`Error loading insurance companies: ${error.message}`);
        } finally {
            setLoadingInsurers(false);
        }
    };

    const handleExploreInsurance = () => {
        setUploadStatus('insurance_selection');
        fetchInsuranceCompanies();
    };
    
    // Fetch sent inquiries for messaging
    const fetchSentInquiries = async () => {
        try {
            const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
            const unsubscribe = onSnapshot(inquiriesRef, (snapshot) => {
                const userInquiries = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.leasingCompanyId === user.uid) {
                        userInquiries.push({ id: doc.id, ...data });
                    }
                });
                setSentInquiries(userInquiries);
            });
            return unsubscribe;
        } catch (error) {
            console.error('Error fetching sent inquiries:', error);
        }
    };
    
    const openMessaging = (inquiry) => {
        setSelectedInquiry(inquiry);
        setShowMessaging(true);
    };
    
    const closeMessaging = () => {
        setShowMessaging(false);
        setSelectedInquiry(null);
    };
    
    // Fetch sent inquiries when component mounts
    useEffect(() => {
        if (user?.uid) {
            const unsubscribe = fetchSentInquiries();
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [user?.uid]);

    const handlePercentageChange = (companyId, percentage) => {
        const numPercentage = parseInt(percentage) || 0;
        setSelectedInsurers(prev => ({
            ...prev,
            [companyId]: numPercentage
        }));
    };

    const getTotalPercentage = () => {
        return Object.values(selectedInsurers).reduce((sum, percent) => sum + percent, 0);
    };

    const handleSendInquiries = async () => {
        const totalPercentage = getTotalPercentage();
        if (totalPercentage !== 100) {
            alert(`Total percentage must equal 100%. Current total: ${totalPercentage}%`);
            return;
        }

        const selectedCompanies = Object.entries(selectedInsurers)
            .filter(([_, percentage]) => percentage > 0)
            .map(([companyId, percentage]) => ({ companyId, percentage }));

        if (selectedCompanies.length === 0) {
            alert('Please select at least one insurance company.');
            return;
        }

        try {
            console.log('Sending inquiries to', selectedCompanies.length, 'companies');
            
            // Create inquiry for each selected insurance company
            for (const { companyId, percentage } of selectedCompanies) {
                const inquiryData = {
                    leasingCompanyId: user.uid,
                    leasingCompanyName: profileData.companyName,
                    insuranceCompanyId: companyId,
                    percentage: percentage,
                    clientName: user.displayName || 'Client',
                    vehicleInfo: 'Vehicle from Technical Registration Passport',
                    requestDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    message: `Insurance inquiry for ${percentage}% coverage. Please provide your quote for our client's vehicle insurance.`,
                    frontImageUrl: frontImagePreview,
                    backImageUrl: backImagePreview,
                    createdAt: new Date()
                };

                console.log('Sending inquiry to company:', companyId, 'with data:', inquiryData);
                
                // Save inquiry to Firestore
                const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
                const docRef = await addDoc(inquiriesRef, inquiryData);
                
                console.log('Inquiry saved with ID:', docRef.id);
            }

            alert('Inquiries sent successfully to selected insurance companies!');
            // Reset to completed state
            setUploadStatus('completed');
            setSelectedInsurers({});
        } catch (error) {
            console.error('Error sending inquiries:', error);
            alert('Error sending inquiries. Please try again.');
        }
    };

    const removeImage = (type) => {
        if (type === 'front') {
            setFrontImage(null);
            setFrontImagePreview(null);
        } else {
            setBackImage(null);
            setBackImagePreview(null);
        }
    };

    if (uploadStatus === 'completed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-sm mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckIcon className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Documents Verified!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Your Technical Registration Passport has been verified successfully. You can now explore insurance options from registered companies.
                        </p>
                        <button 
                            onClick={handleExploreInsurance}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Explore Insurance Options
                        </button>
                        {sentInquiries.length > 0 && (
                            <div className="mt-12">
                                <h4 className="text-xl font-bold text-gray-900 mb-6">Your Insurance Inquiries</h4>
                                <div className="space-y-4">
                                    {sentInquiries.map((inquiry) => (
                                        <div key={inquiry.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="font-semibold text-gray-900">
                                                        {inquiry.insuranceCompanyName || 'Insurance Company'}
                                                    </h5>
                                                    <p className="text-sm text-gray-600">
                                                        {inquiry.percentage}% Coverage - Status: <span className={`font-medium ${
                                                            inquiry.status === 'pending' ? 'text-yellow-600' :
                                                            inquiry.status === 'responded' ? 'text-green-600' :
                                                            inquiry.status === 'rejected' ? 'text-red-600' : 'text-gray-600'
                                                        }`}>{inquiry.status}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Sent: {inquiry.timestamp?.toDate?.()?.toLocaleDateString() || new Date(inquiry.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openMessaging(inquiry)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <span>Message</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (uploadStatus === 'insurance_selection') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">IP</span>
                                </div>
                                <h1 className="text-lg font-bold text-gray-900">Select Insurance Companies</h1>
                            </div>
                            <button 
                                onClick={() => setUploadStatus('completed')}
                                className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Insurance Companies</h2>
                            <p className="text-gray-600">
                                Select insurance companies and allocate percentages. Total must equal 100%.
                            </p>
                        </div>

                        {loadingInsurers ? (
                            <div className="text-center py-12">
                                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading insurance companies...</p>
                            </div>
                        ) : insuranceCompanies.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-gray-400 text-2xl">🏢</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insurance Companies Found</h3>
                                <p className="text-gray-600 mb-6">
                                    No insurance companies are currently registered on the platform.
                                </p>
                                <button 
                                    onClick={() => setUploadStatus('completed')}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                >
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Total Percentage Display */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">Total Percentage:</span>
                                        <span className={`text-xl font-bold ${
                                            getTotalPercentage() === 100 ? 'text-green-600' : 
                                            getTotalPercentage() > 100 ? 'text-red-600' : 'text-orange-600'
                                        }`}>
                                            {getTotalPercentage()}%
                                        </span>
                                    </div>
                                    {getTotalPercentage() !== 100 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {getTotalPercentage() < 100 ? 
                                                `Need ${100 - getTotalPercentage()}% more` : 
                                                `Reduce by ${getTotalPercentage() - 100}%`
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Insurance Companies List */}
                                <div className="space-y-4 mb-8">
                                    {insuranceCompanies.map((company) => (
                                        <div key={company.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">
                                                            {company.companyName?.charAt(0) || 'I'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{company.companyName}</h3>
                                                        <p className="text-sm text-gray-500">Insurance Company</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        placeholder="%"
                                                        value={selectedInsurers[company.id] || ''}
                                                        onChange={(e) => handlePercentageChange(company.id, e.target.value)}
                                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <span className="text-gray-500 font-medium">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={() => setUploadStatus('completed')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSendInquiries}
                                        disabled={getTotalPercentage() !== 100 || Object.keys(selectedInsurers).length === 0}
                                        className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                                            getTotalPercentage() === 100 && Object.keys(selectedInsurers).length > 0
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Send Inquiries
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Modern Mobile Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">IP</span>
                            </div>
                            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Insurance Platform</h1>
                        </div>
                        
                        {/* Profile Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
                            >
                                <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-500">{profileData.companyName}</p>
                                </div>
                            </button>
                            
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{user.displayName || user.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">{profileData.role}</p>
                                        <p className="text-xs text-gray-400">{profileData.companyName}</p>
                                    </div>
                                    <button 
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-1 mt-1"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Document Verification
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Upload your Technical Registration Passport to access our insurance marketplace
                    </p>
                </div>

                {/* Document Upload Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <DocumentIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Vehicle Registration Certificate</h3>
                        <p className="text-gray-600">Please upload clear photos of both sides</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Front Side Upload */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                                    1
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Front Side</h4>
                                    <p className="text-sm text-gray-600">Blue registration card</p>
                                </div>
                            </div>
                            <div 
                                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
                                    dragActive.front 
                                        ? 'border-blue-400 bg-blue-50 scale-105' 
                                        : frontImage 
                                            ? 'border-emerald-400 bg-emerald-50' 
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={() => handleDragLeave('front')}
                                onDrop={(e) => handleDrop(e, 'front')}
                            >
                                {frontImagePreview ? (
                                    <div className="space-y-4">
                                        <img 
                                            src={frontImagePreview} 
                                            alt="Front side preview" 
                                            className="max-w-full h-40 sm:h-48 object-contain mx-auto rounded-xl shadow-lg"
                                        />
                                        <div className="flex items-center justify-center space-x-2 text-emerald-600">
                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-semibold">Front side uploaded</span>
                                        </div>
                                        <button
                                            onClick={() => removeImage('front')}
                                            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                                            <UploadIcon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium mb-2">Drop your image here</p>
                                            <p className="text-sm text-gray-500 mb-6">or tap to browse</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, 'front')}
                                                className="hidden"
                                                id="front-upload"
                                            />
                                            <label 
                                                htmlFor="front-upload"
                                                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                Choose File
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Side Upload */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                                    2
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Back Side</h4>
                                    <p className="text-sm text-gray-600">Certificate document</p>
                                </div>
                            </div>
                            <div 
                                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
                                    dragActive.back 
                                        ? 'border-blue-400 bg-blue-50 scale-105' 
                                        : backImage 
                                            ? 'border-emerald-400 bg-emerald-50' 
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={() => handleDragLeave('back')}
                                onDrop={(e) => handleDrop(e, 'back')}
                            >
                                {backImagePreview ? (
                                    <div className="space-y-4">
                                        <img 
                                            src={backImagePreview} 
                                            alt="Back side preview" 
                                            className="max-w-full h-40 sm:h-48 object-contain mx-auto rounded-xl shadow-lg"
                                        />
                                        <div className="flex items-center justify-center space-x-2 text-emerald-600">
                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-semibold">Back side uploaded</span>
                                        </div>
                                        <button
                                            onClick={() => removeImage('back')}
                                            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                                            <UploadIcon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium mb-2">Drop your image here</p>
                                            <p className="text-sm text-gray-500 mb-6">or tap to browse</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, 'back')}
                                                className="hidden"
                                                id="back-upload"
                                            />
                                            <label 
                                                htmlFor="back-upload"
                                                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                Choose File
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-8 sm:mt-12">
                        <button
                            onClick={handleSubmit}
                            disabled={!frontImage || !backImage || uploadStatus === 'uploading'}
                            className={`w-full max-w-sm mx-auto py-4 px-8 rounded-2xl font-bold text-white transition-all duration-300 ${
                                !frontImage || !backImage || uploadStatus === 'uploading'
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                            }`}
                        >
                            {uploadStatus === 'uploading' ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                'Verify Documents'
                            )}
                        </button>
                        
                        {(!frontImage || !backImage) && (
                            <p className="text-sm text-gray-500 mt-4">
                                Upload both sides to continue
                            </p>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 sm:mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-4 text-center">Need Help?</h4>
                        <div className="grid sm:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-2">
                                <h5 className="font-semibold text-blue-800">Front Side (Blue Card):</h5>
                                <ul className="text-blue-700 space-y-1">
                                    <li>• Blue background with logo</li>
                                    <li>• Vehicle registration details</li>
                                    <li>• Owner information</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h5 className="font-semibold text-blue-800">Back Side (Certificate):</h5>
                                <ul className="text-blue-700 space-y-1">
                                    <li>• Light colored background</li>
                                    <li>• Official seals and stamps</li>
                                    <li>• Signatures and details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Messaging Modal */}
            <MessagingModal
                isOpen={showMessaging}
                onClose={closeMessaging}
                inquiry={selectedInquiry}
                user={user}
                profileData={profileData}
                db={db}
                appId={appId}
            />
        </div>
    );
};

// Insurance Company Dashboard
const InsuranceCompanyDashboard = ({ user, profileData, handleSignOut }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries', 'responded', 'archived'
    const [inquiries, setInquiries] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(true);
    
    // Messaging state
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showMessaging, setShowMessaging] = useState(false);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [unreadCounts, setUnreadCounts] = useState({});

    // Fetch inquiries for this insurance company with real-time updates
    useEffect(() => {
        console.log('Insurance Company Dashboard: Setting up real-time listener for user:', user.uid);
        console.log('Listening to path:', `artifacts/${appId}/inquiries`);
        
        const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(inquiriesRef, (snapshot) => {
            console.log('Real-time update: Found', snapshot.size, 'total inquiries in database');
            
            const companyInquiries = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log('Checking inquiry:', doc.id, 'data:', data);
                console.log('insuranceCompanyId:', data.insuranceCompanyId, 'vs user.uid:', user.uid);
                
                if (data.insuranceCompanyId === user.uid) {
                    console.log('Match found! Adding inquiry to list');
                    companyInquiries.push({
                        id: doc.id,
                        ...data
                    });
                }
            });
            
            // Sort by creation date (newest first)
            companyInquiries.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
                const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
                return dateB - dateA;
            });
            
            console.log('Final result: Found', companyInquiries.length, 'inquiries for this insurance company');
            setInquiries(companyInquiries);
            setLoadingInquiries(false);
        }, (error) => {
            console.error('Error in real-time listener:', error);
            setLoadingInquiries(false);
        });

        // Cleanup listener on unmount
        return () => {
            console.log('Cleaning up real-time listener');
            unsubscribe();
        };
    }, [user.uid]);

    const handleRespond = async (inquiry) => {
        try {
            const inquiryRef = doc(db, `artifacts/${appId}/inquiries`, inquiry.id);
            await updateDoc(inquiryRef, {
                status: 'responded',
                respondedAt: new Date()
            });

            // Create notification for leasing company
            const notificationRef = collection(db, `artifacts/${appId}/users/${inquiry.leasingCompanyId}/notifications`);
            await addDoc(notificationRef, {
                message: `Your inquiry to ${inquiry.insuranceCompanyName} has been responded to. They are preparing a detailed quote.`,
                inquiryId: inquiry.id,
                timestamp: new Date(),
                read: false
            });

            console.log('Inquiry status updated and notification sent.');
            alert('Your response has been sent. The leasing company will be notified.');
        } catch (error) {
            console.error('Error responding to inquiry:', error);
            alert('Error updating inquiry status. Please try again.');
        }
    };

    const handleReject = async (inquiry) => {
        try {
            const inquiryRef = doc(db, `artifacts/${appId}/inquiries`, inquiry.id);
            await updateDoc(inquiryRef, {
                status: 'rejected',
                rejectedAt: new Date()
            });

            // Create notification for leasing company
            const notificationRef = collection(db, `artifacts/${appId}/users/${inquiry.leasingCompanyId}/notifications`);
            await addDoc(notificationRef, {
                message: `Your inquiry to ${inquiry.insuranceCompanyName} has been rejected.`,
                inquiryId: inquiry.id,
                timestamp: new Date(),
                read: false
            });

            console.log('Inquiry status updated to rejected and notification sent.');
        } catch (error) {
            console.error('Error rejecting inquiry:', error);
            alert('Error updating inquiry status. Please try again.');
        }
    };

    // Messaging functions
    const fetchMessages = (inquiryId) => {
        const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`);
        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const inquiryMessages = [];
            snapshot.forEach((doc) => {
                inquiryMessages.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Sort by timestamp
            inquiryMessages.sort((a, b) => {
                const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
                const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
                return timeA - timeB;
            });
            
            setMessages(prev => ({ ...prev, [inquiryId]: inquiryMessages }));
            
            // Mark messages as read when viewing
            if (showMessaging && selectedInquiry?.id === inquiryId) {
                markMessagesAsRead(inquiryId);
            }
        });
        
        return unsubscribe;
    };
    
    const sendMessage = async (inquiryId, messageText) => {
        if (!messageText.trim()) return;
        
        try {
            const messageData = {
                text: messageText.trim(),
                senderId: user.uid,
                senderName: profileData.companyName,
                senderRole: 'Insurance Company',
                timestamp: new Date(),
                read: false
            };
            
            const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`);
            await addDoc(messagesRef, messageData);
            
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message. Please try again.');
        }
    };
    
    const markMessagesAsRead = async (inquiryId) => {
        try {
            const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`);
            const snapshot = await getDocs(messagesRef);
            
            const batch = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.read && data.senderId !== user.uid) {
                    batch.push(updateDoc(doc.ref, { read: true }));
                }
            });
            
            await Promise.all(batch);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };
    
    const openMessaging = (inquiry) => {
        setSelectedInquiry(inquiry);
        setShowMessaging(true);
        
        // Fetch messages for this inquiry
        const unsubscribe = fetchMessages(inquiry.id);
        
        // Store unsubscribe function for cleanup
        return unsubscribe;
    };
    
    const closeMessaging = () => {
        setShowMessaging(false);
        setSelectedInquiry(null);
        setNewMessage('');
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        if (activeTab === 'inquiries') return inquiry.status === 'pending';
        if (activeTab === 'responded') return inquiry.status === 'responded' || inquiry.status === 'rejected';
        if (activeTab === 'archived') return inquiry.status === 'archived';
        return true;
    });


    


    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">IP</span>
                            </div>
                            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Insurance Platform</h1>
                        </div>
                        
                        {/* Profile Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
                            >
                                <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-500">{profileData.companyName}</p>
                                </div>
                            </button>
                            
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{user.displayName || user.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">{profileData.role}</p>
                                        <p className="text-xs text-gray-400">{profileData.companyName}</p>
                                    </div>
                                    <button 
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-1 mt-1"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Welcome Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Welcome, {profileData.companyName}
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Manage inquiries from leasing companies
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                                <p className="text-3xl font-bold text-emerald-600">{inquiries.filter(i => i.status === 'pending').length}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Responded</p>
                                <p className="text-3xl font-bold text-blue-600">{inquiries.filter(i => i.status === 'responded').length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                                <p className="text-3xl font-bold text-gray-700">{inquiries.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inquiries Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('inquiries')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'inquiries'
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            New Inquiries ({inquiries.filter(i => i.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('responded')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'responded'
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Responded ({inquiries.filter(i => i.status === 'responded').length})
                        </button>
                    </div>

                    {/* Inquiries List */}
                    <div className="space-y-4">
                        {loadingInquiries ? (
                            <div className="text-center py-12">
                                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading inquiries...</p>
                            </div>
                        ) : filteredInquiries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                                <p className="text-gray-500">New inquiries from leasing companies will appear here.</p>
                            </div>
                        ) : (
                            filteredInquiries.map((inquiry) => (
                                <div key={inquiry.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{inquiry.leasingCompanyName}</h3>
                                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">{inquiry.percentage}%</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    inquiry.status === 'pending' 
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : inquiry.status === 'responded'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {inquiry.status === 'pending' ? 'New' : inquiry.status === 'responded' ? 'Responded' : 'Archived'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                                <div>
                                                    <span className="font-medium">Client:</span> {inquiry.clientName}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Vehicle:</span> {inquiry.vehicleInfo}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Date:</span> {inquiry.requestDate}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                {inquiry.message}
                                            </p>

                                            {/* Vehicle Registration Photos */}
                                            <div className="mt-4">
                                                <h4 className="font-medium text-gray-800 mb-2">Vehicle Registration Photos:</h4>
                                                <div className="flex space-x-4">
                                                    {inquiry.frontImageURL && (
                                                        <a href={inquiry.frontImageURL} target="_blank" rel="noopener noreferrer">
                                                            <img src={inquiry.frontImageURL} alt="Front Side" className="w-32 h-20 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
                                                        </a>
                                                    )}
                                                    {inquiry.backImageURL && (
                                                        <a href={inquiry.backImageURL} target="_blank" rel="noopener noreferrer">
                                                            <img src={inquiry.backImageURL} alt="Back Side" className="w-32 h-20 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                        {inquiry.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleRespond(inquiry)}
                                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 px-4 rounded-xl font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                >
                                                    Respond to Inquiry
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(inquiry)}
                                                    className="flex-1 bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => openMessaging(inquiry)}
                                            className="relative px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>Message</span>
                                            {unreadCounts[inquiry.id] > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {unreadCounts[inquiry.id]}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
        
        <MessagingModal
            isOpen={showMessaging}
            onClose={closeMessaging}
            inquiry={selectedInquiry}
            user={user}
            profileData={profileData}
            db={db}
            appId={appId}
        />
        </>
    );
};

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
);

// --- Main App Component ---

export default function App() {
    // User and profile state
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    
    // Onboarding flow state
    const [onboardingStep, setOnboardingStep] = useState('role'); // 'role', 'companyName', 'voen', 'signup'
    const [onboardingData, setOnboardingData] = useState({
        role: '',
        companyName: '',
        voen: ''
    });

    // General state
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Check auth state and profile on load
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Check if user has a complete profile in Firestore
                const userProfilePath = `/artifacts/${appId}/users/${currentUser.uid}/profile`;
                const userProfileDocRef = doc(db, userProfilePath, 'userProfile');
                const docSnap = await getDoc(userProfileDocRef);
                
                if (docSnap.exists() && docSnap.data().role) {
                    setProfileData(docSnap.data());
                } else {
                    // User is logged in but profile is incomplete, restart onboarding
                    setProfileData(null); 
                    setOnboardingStep('role');
                }
            } else {
                // No user logged in
                setUser(null);
                setProfileData(null);
                setOnboardingStep('role');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSetOnboardingData = (data) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setAuthError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Save all collected data to Firestore
            const finalProfileData = {
                ...onboardingData,
                email: user.email,
                uid: user.uid,
            };
            const userProfilePath = `/artifacts/${appId}/users/${user.uid}/profile`;
            const userProfileDocRef = doc(db, userProfilePath, 'userProfile');
            await setDoc(userProfileDocRef, finalProfileData);

            // Set local state to trigger dashboard render
            setUser(user);
            setProfileData(finalProfileData);

        } catch (error) {
            setAuthError(error.message);
            console.error("Google Sign-Up Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setProfileData(null);
            setOnboardingStep('role');
            setOnboardingData({ role: '', companyName: '', voen: '' });
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        
        // If user is logged in and has a profile, show appropriate dashboard
        if (user && profileData) {
            if (profileData.role === 'Insurance Company') {
                return <InsuranceCompanyDashboard user={user} profileData={profileData} handleSignOut={handleSignOut} />;
            } else {
                return <DashboardScreen user={user} profileData={profileData} />;
            }
        }

        // Otherwise, show the onboarding flow
        switch (onboardingStep) {
            case 'role':
                return <RoleSelectionScreen onSelectRole={(role) => {
                    handleSetOnboardingData({ role });
                    setOnboardingStep('companyName');
                }} />;
            case 'companyName':
                return <CompanyNameScreen 
                    companyName={onboardingData.companyName}
                    setCompanyName={(name) => handleSetOnboardingData({ companyName: name })}
                    selectedRole={onboardingData.role}
                    onNext={(e) => { 
                        e.preventDefault(); 
                        // Skip VOEN step for Insurance Companies
                        if (onboardingData.role === 'Insurance Company') {
                            setOnboardingStep('signup');
                        } else {
                            setOnboardingStep('voen');
                        }
                    }}
                    onBack={() => setOnboardingStep('role')}
                />;
            case 'voen':
                return <VoenScreen 
                    voen={onboardingData.voen}
                    setVoen={(voen) => handleSetOnboardingData({ voen })}
                    onNext={() => setOnboardingStep('signup')}
                    onBack={() => setOnboardingStep('companyName')}
                />;
            case 'signup':
                return <SignUpScreen 
                    onBack={() => {
                        // Go back to appropriate step based on role
                        if (onboardingData.role === 'Insurance Company') {
                            setOnboardingStep('companyName');
                        } else {
                            setOnboardingStep('voen');
                        }
                    }}
                    onSignUp={handleGoogleSignUp}
                    loading={loading}
                />;
            default:
                return <RoleSelectionScreen onSelectRole={(role) => {
                    handleSetOnboardingData({ role });
                    setOnboardingStep('companyName');
                }} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
            {authError && <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md z-50"><p>{authError}</p></div>}
            {renderContent()}
        </div>
    );
}
