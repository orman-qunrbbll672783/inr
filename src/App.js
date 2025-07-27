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
    where,
    orderBy
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
    const [uploadStatus, setUploadStatus] = useState('pending');
    const [dragActive, setDragActive] = useState({ front: false, back: false });
    const [insuranceCompanies, setInsuranceCompanies] = useState([]);
    const [selectedInsurers, setSelectedInsurers] = useState({});
    const [loadingInsurers, setLoadingInsurers] = useState(false);
    
    // --- MESSAGING & NOTIFICATION STATE ---
    const [showMessaging, setShowMessaging] = useState(false);
    const [sentInquiries, setSentInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [messages, setMessages] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [messageUnsubscribe, setMessageUnsubscribe] = useState(null);

    // --- UTILITY FUNCTIONS ---
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const removeImage = (type) => {
        if (type === 'front') {
            setFrontImage(null);
            setFrontImagePreview(null);
        } else if (type === 'back') {
            setBackImage(null);
            setBackImagePreview(null);
        }
    };

    // --- DATA FETCHING EFFECTS ---
    // Effect to fetch sent inquiries
    useEffect(() => {
        if (!user?.uid) return;
        const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
        const q = query(inquiriesRef, where("leasingCompanyId", "==", user.uid), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSentInquiries(userInquiries);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Effect to fetch notifications
    useEffect(() => {
        if (!user?.uid) return;
        const notificationsRef = collection(db, `artifacts/${appId}/users/${user.uid}/notifications`);
        const q = query(notificationsRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(userNotifications);
        });

        return () => unsubscribe();
    }, [user?.uid]);


    // --- MESSAGING FUNCTIONS ---
    const fetchMessages = (inquiryId) => {
        const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const inquiryMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(prev => ({ ...prev, [inquiryId]: inquiryMessages }));
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
                senderRole: 'Leasing Company',
                timestamp: new Date(),
                read: false
            };
            const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`);
            await addDoc(messagesRef, messageData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const openMessaging = (inquiry) => {
        if (messageUnsubscribe) messageUnsubscribe();
        setSelectedInquiry(inquiry);
        setShowMessaging(true);
        const unsubscribeFunc = fetchMessages(inquiry.id);
        setMessageUnsubscribe(() => unsubscribeFunc);
    };

    const closeMessaging = () => {
        if (messageUnsubscribe) messageUnsubscribe();
        setShowMessaging(false);
        setSelectedInquiry(null);
        setMessageUnsubscribe(null);
    };
    
    // Other functions like handleImageUpload, handleSendInquiries, etc. remain the same...

    // (Keep all your other functions like handleImageUpload, handleDrop, handleSubmit, etc. here)
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
    const handleDrop = (e, type) => { e.preventDefault(); setDragActive({ front: false, back: false }); const files = e.dataTransfer.files; if (files.length > 0) { handleImageUpload(files[0], type); } };
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDragEnter = (e, type) => { e.preventDefault(); setDragActive(prev => ({ ...prev, [type]: true })); };
    const handleDragLeave = (type) => { setDragActive(prev => ({ ...prev, [type]: false })); };
    const handleFileSelect = (e, type) => { const file = e.target.files[0]; if (file) { handleImageUpload(file, type); } };
    const handleSubmit = async () => { if (!frontImage || !backImage) { alert('Please upload both front and back images.'); return; } setUploadStatus('uploading'); setTimeout(() => { setUploadStatus('completed'); }, 2000); };
    const fetchInsuranceCompanies = async () => { setLoadingInsurers(true); try { const usersRef = collection(db, `artifacts/${appId}/users`); const q = query(usersRef, where("role", "==", "Insurance Company")); const snapshot = await getDocs(q); const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setInsuranceCompanies(companies); } catch (error) { console.error('Error fetching insurance companies:', error); } finally { setLoadingInsurers(false); } };
    const handleExploreInsurance = () => { setUploadStatus('insurance_selection'); fetchInsuranceCompanies(); };
    const handlePercentageChange = (companyId, percentage) => { const numPercentage = parseInt(percentage) || 0; setSelectedInsurers(prev => ({ ...prev, [companyId]: numPercentage })); };
    const getTotalPercentage = () => { return Object.values(selectedInsurers).reduce((sum, percent) => sum + percent, 0); };
    const handleSendInquiries = async () => { const totalPercentage = getTotalPercentage(); if (totalPercentage !== 100) { alert(`Total percentage must be 100%.`); return; } const selectedCompanies = Object.entries(selectedInsurers).filter(([_, percentage]) => percentage > 0).map(([companyId, percentage]) => ({ companyId, percentage })); if (selectedCompanies.length === 0) { alert('Please select at least one company.'); return; } try { for (const { companyId, percentage } of selectedCompanies) { const companyDetails = insuranceCompanies.find(c => c.id === companyId); const inquiryData = { leasingCompanyId: user.uid, leasingCompanyName: profileData.companyName, insuranceCompanyId: companyId, insuranceCompanyName: companyDetails?.companyName || 'N/A', percentage, clientName: user.displayName || 'Client', vehicleInfo: 'Vehicle Info', requestDate: new Date().toISOString().split('T')[0], status: 'pending', message: `Inquiry for ${percentage}% coverage.`, frontImageUrl: frontImagePreview, backImageUrl: backImagePreview, createdAt: new Date() }; const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`); await addDoc(inquiriesRef, inquiryData); } alert('Inquiries sent successfully!'); setUploadStatus('completed'); setSelectedInsurers({}); } catch (error) { console.error('Error sending inquiries:', error); } };


    // The UI part (return statement)
    if (uploadStatus === 'completed') {
        return (
            // ... your existing JSX for the 'completed' screen ...
            // I will only show the changes needed for the list and modal
             <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Sent Inquiries</h3>
                {sentInquiries.length > 0 ? (
                    <div className="space-y-4">
                        {sentInquiries.map(inquiry => (
                            <div key={inquiry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200/80">
                                {/* ... content of the inquiry card ... */}
                                <div className="flex justify-end mt-4">
                                     <button
                                         onClick={() => openMessaging(inquiry)}
                                         // ... button styles ...
                                     >
                                         Messages
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No inquiries sent yet.</p>
                )}
                
                {/* Ensure the modal gets the needed props */}
                <MessagingModal
                    isOpen={showMessaging}
                    onClose={closeMessaging}
                    inquiry={selectedInquiry}
                    user={user}
                    profileData={profileData}
                    messages={messages[selectedInquiry?.id] || []}
                    onSendMessage={sendMessage}
                    db={db}
                    appId={appId}
                />
            </div>
        );
    }
    
    // ... rest of your component's return statements for other statuses
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* ... Left side logo ... */}
                        
                        {/* --- RIGHT SIDE ICONS (Notification & Profile) --- */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <div className="relative">
                                <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border p-4 z-20">
                                        <h4 className="font-bold mb-2">Notifications</h4>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? notifications.map(n => (
                                                <div key={n.id} className={`p-2 rounded-lg ${!n.read ? 'bg-blue-50' : ''}`}>
                                                    <p className="text-sm">{n.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp.seconds * 1000).toLocaleString()}</p>
                                                </div>
                                            )) : <p className="text-sm text-gray-500">No new notifications.</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Menu */}
                            <div className="relative">
                                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center">
                                    {/* ... profile icon ... */}
                                </button>
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white/95 ...">
                                        {/* ... profile details ... */}
                                        <button onClick={handleSignOut} className="w-full text-left ...">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* ... rest of the main content ... */}
            <main> ... </main>

            {/* Make sure the modal gets all the props it needs here too */}
             <MessagingModal
                isOpen={showMessaging}
                onClose={closeMessaging}
                inquiry={selectedInquiry}
                user={user}
                profileData={profileData}
                messages={messages[selectedInquiry?.id] || []}
                onSendMessage={sendMessage}
                db={db}
                appId={appId}
            />
        </div>
    );
};

// Insurance Company Dashboard
const InsuranceCompanyDashboard = ({ user, profileData, handleSignOut }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [activeTab, setActiveTab] = useState('inquiries');
    const [inquiries, setInquiries] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(true);
    
    // --- MESSAGING STATE ---
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showMessaging, setShowMessaging] = useState(false);
    const [messages, setMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});
    const [messageUnsubscribe, setMessageUnsubscribe] = useState(null);

    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
        const q = query(inquiriesRef, where("insuranceCompanyId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const companyInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            companyInquiries.sort((a, b) => (b.createdAt.toDate() || 0) - (a.createdAt.toDate() || 0));
            setInquiries(companyInquiries);
            setLoadingInquiries(false);
        }, (error) => {
            console.error('Error in inquiries listener:', error);
            setLoadingInquiries(false);
        });

        return () => unsubscribe();
    }, [user.uid]);

    // ... handleRespond and handleReject functions remain the same ...
    const handleRespond = async (inquiry) => { /* ... your existing code ... */ };
    const handleReject = async (inquiry) => { /* ... your existing code ... */ };


    // --- MESSAGING FUNCTIONS (CLEANED UP) ---
    const fetchMessages = (inquiryId) => {
        const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const inquiryMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(prev => ({ ...prev, [inquiryId]: inquiryMessages }));
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
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const openMessaging = (inquiry) => {
        if (messageUnsubscribe) messageUnsubscribe();
        setSelectedInquiry(inquiry);
        setShowMessaging(true);
        const unsubscribeFunc = fetchMessages(inquiry.id);
        setMessageUnsubscribe(() => unsubscribeFunc);
    };

    const closeMessaging = () => {
        if (messageUnsubscribe) messageUnsubscribe();
        setShowMessaging(false);
        setSelectedInquiry(null);
        setMessageUnsubscribe(null);
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        if (activeTab === 'inquiries') return inquiry.status === 'pending';
        if (activeTab === 'responded') return inquiry.status === 'responded' || inquiry.status === 'rejected';
        return false;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* ... Header and Profile Menu JSX ... */}
            
            <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
                 {/* ... Tabs and Inquiries List JSX ... */}
                 {/* This is the same as your existing code, just ensure the modal gets the right props */}
            </main>

            <MessagingModal
                isOpen={showMessaging}
                onClose={closeMessaging}
                inquiry={selectedInquiry}
                user={user}
                profileData={profileData}
                messages={messages[selectedInquiry?.id] || []}
                onSendMessage={sendMessage}
                db={db}
                appId={appId}
            />
        </div>
    );
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
                <div key={inquiry.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                    {/* Main Content */}
                    <div className="flex-grow">
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
                                <div><span className="font-medium">Client:</span> {inquiry.clientName}</div>
                                <div><span className="font-medium">Vehicle:</span> {inquiry.vehicleInfo}</div>
                                <div><span className="font-medium">Date:</span> {inquiry.requestDate}</div>
                            </div>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-4">{inquiry.message}</p>
                            
                            {/* Vehicle Registration Photos (Displayed ONCE) */}
                            <h4 className="font-medium text-gray-800 mb-2">Vehicle Registration Photos:</h4>
                            <div className="flex space-x-4">
                                {inquiry.frontImageUrl && (
                                    <a href={inquiry.frontImageUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={inquiry.frontImageUrl} alt="Front Side" className="w-32 h-20 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
                                    </a>
                                )}
                                {inquiry.backImageUrl && (
                                    <a href={inquiry.backImageUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={inquiry.backImageUrl} alt="Back Side" className="w-32 h-20 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Unified Footer Actions --- */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                        {/* Left Side: Conditional Buttons */}
                        <div className="flex space-x-3">
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
                        </div>

                        {/* Right Side: Messages Button */}
                        <button
                            onClick={() => openMessaging(inquiry)}
                            className="relative px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <span>Messages</span>
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
;

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
