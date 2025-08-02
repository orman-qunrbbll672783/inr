import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
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
    orderBy,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';

// --- Firebase Configuration ---
// IMPORTANT: Replace with your actual Firebase configuration.
const firebaseConfig = {
    apiKey: "AIzaSyDLbHa6RgZFDTxnkEUlXGfBiM-DSsWEAhQ",
    authDomain: "b2b-plat.firebaseapp.com",
    projectId: "b2b-plat",
    storageBucket: "b2b-plat.appspot.com",
    messagingSenderId: "288936676911",
    appId: "1:288936676911:web:52ba1c723b533d2aaac0da",
    measurementId: "G-7C0C1DWZYF"
  };

const appId = 'b2b-plat'; // Your Firebase project ID

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Icon & Logo Components ---
const SigormanLogo = ({ className }) => (
    <svg className={className} viewBox="0 0 162 154" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M101.25 154C101.25 139.753 90.148 128.531 76.05 128.531H40.5V154H0V0H76.05C122.589 0 162 38.2031 162 85.0312C162 122.148 135.248 154 101.25 154ZM40.5 97.5H72.9C79.9453 97.5 85.5938 91.7812 85.5938 84.6562C85.5938 77.5312 79.9453 71.8125 72.9 71.8125H40.5V97.5Z" fill="#1D2B4F"/>
        <path d="M85.5938 84.6562C85.5938 91.7812 79.9453 97.5 72.9 97.5H40.5V38.25H72.9C79.9453 38.25 85.5938 43.9688 85.5938 51.0938C85.5938 58.2188 79.9453 63.9375 72.9 63.9375H60.75V71.8125H72.9C79.9453 71.8125 85.5938 77.5312 85.5938 84.6562Z" fill="#2EBA78"/>
    </svg>
);
const UserIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const BuildingIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>);
const GoogleIcon = () => (<svg className="w-6 h-6 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.61C34.566 5.844 29.63 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.229 2.196-1.996 4.76-1.996 7.309c0 2.549.767 5.113 1.996 7.309l5.34-4.148c-.461-1.333-.734-2.79-.734-4.161s.273-2.828.734-4.161L6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-5.34-4.148c-1.825 1.22-4.128 1.96-6.069 1.96c-4.42 0-8.33-2.46-10.207-6.182l-5.337 4.147C8.06 39.223 15.424 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.34 4.148C40.929 34.699 44 29.822 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>);
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const ShieldIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
const UploadIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const BellIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);
const PlusCircleIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const HistoryIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const LoadingSpinner = () => (<div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1D2B4F]"></div></div>);

// --- UI Helper Components ---
const OnboardingWrapper = ({ children, title, step, totalSteps }) => (<div className="w-full max-w-lg mx-auto text-center animate-fade-in"><div className="mb-8"><p className="text-sm font-semibold text-[#1D2B4F]">STEP {step} OF {totalSteps}</p><h1 className="text-4xl font-bold text-gray-800 tracking-tight mt-1">{title}</h1></div><div className="bg-white p-8 rounded-xl shadow-md">{children}</div></div>);
const BackButton = ({ onClick }) => (<button onClick={onClick} className="absolute top-6 left-6 flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors z-10"><ArrowLeftIcon className="w-5 h-5" /><span className="text-sm font-medium">Back</span></button>);
const AlertBanner = ({ message, type, onDismiss }) => {
    if (!message) return null;
    const baseClasses = "fixed top-24 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-md z-50 flex items-center";
    const typeClasses = { error: "bg-red-100 border border-red-400 text-red-700", success: "bg-green-100 border border-green-400 text-green-700", info: "bg-blue-100 border border-blue-400 text-blue-700" };
    return (<div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}><p className="flex-grow">{message}</p><button onClick={onDismiss} className="ml-4 text-lg font-bold">&times;</button></div>);
};
const ImagePreviewModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="relative p-4">
                <button onClick={onClose} className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg">&times;</button>
                <img src={imageUrl} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
            </div>
        </div>
    );
};
const NotificationsPanel = ({ notifications, onClear }) => (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border p-4 z-20 animate-fade-in-down">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Notifications</h4>
            {notifications.filter(n => !n.read).length > 0 && <button onClick={onClear} className="text-sm text-blue-600 hover:underline">Mark all as read</button>}
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? notifications.map(n => (
                <div key={n.id} className={`p-2 rounded-lg ${!n.read ? 'bg-blue-50' : ''}`}>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp?.seconds * 1000).toLocaleString()}</p>
                </div>
            )) : <p className="text-sm text-gray-500">No new notifications.</p>}
        </div>
    </div>
);

// --- Onboarding Screens ---
const RoleSelectionScreen = ({ onSelectRole }) => ( <OnboardingWrapper title="Select Your Role" step={1} totalSteps={4}><div className="space-y-4"><div onClick={() => onSelectRole('Leasing Company')} className="relative p-6 bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#1D2B4F] overflow-hidden group"><BuildingIcon className="w-12 h-12 mx-auto text-[#1D2B4F] mb-3 transition-transform duration-300 group-hover:scale-110" /><h2 className="text-xl font-semibold text-gray-800">Leasing Company</h2><p className="text-gray-500 mt-1 text-sm">Manage assets, contracts, and client relationships.</p></div><div onClick={() => onSelectRole('Insurance Company')} className="relative p-6 bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#2EBA78] overflow-hidden group"><ShieldIcon className="w-12 h-12 mx-auto text-[#2EBA78] mb-3 transition-transform duration-300 group-hover:scale-110" /><h2 className="text-xl font-semibold text-gray-800">Insurance Company</h2><p className="text-gray-500 mt-1 text-sm">Receive and manage inquiries from leasing companies.</p></div></div></OnboardingWrapper>);
const CompanyNameScreen = ({ onNext, onBack, companyName, setCompanyName, selectedRole }) => {
    const isInsuranceCompany = selectedRole === 'Insurance Company';
    const popularInsuranceCompanies = ['Atəşgah Sığorta', 'Paşa Sığorta', 'Qala Sığorta', 'Meqa Sığorta'];
    return (<><BackButton onClick={onBack} /><OnboardingWrapper title="Company Name" step={2} totalSteps={isInsuranceCompany ? 3 : 4}><form onSubmit={onNext} className="space-y-6"><p className="text-gray-600">{isInsuranceCompany ? 'What is the name of your insurance company?' : 'What is the name of your leasing company?'}</p>{isInsuranceCompany && (<div className="mb-4"><p className="text-sm text-gray-500 mb-3">Popular insurance companies:</p><div className="grid grid-cols-2 gap-2">{popularInsuranceCompanies.map((company) => (<button key={company} type="button" onClick={() => setCompanyName(company)} className={`p-3 text-sm rounded-lg border transition-all duration-200 ${companyName === company ? 'border-[#2EBA78] bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'}`}>{company}</button>))}</div><div className="flex items-center my-4"><div className="flex-1 border-t border-gray-200"></div><span className="px-3 text-xs text-gray-400">OR</span><div className="flex-1 border-t border-gray-200"></div></div></div>)}<div><label htmlFor="companyName" className="sr-only">Company Name</label><input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2B4F] focus:border-[#1D2B4F] sm:text-lg text-center" placeholder={isInsuranceCompany ? 'e.g., Your Insurance Company' : 'e.g., Acme Leasing Inc.'} /></div><button type="submit" disabled={!companyName} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${isInsuranceCompany ? 'bg-[#2EBA78] hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400' : 'bg-[#1D2B4F] hover:bg-blue-900 focus:ring-blue-800 disabled:bg-blue-400'}`}>Continue</button></form></OnboardingWrapper></>);
};
const VoenScreen = ({ onNext, onBack, voen, setVoen }) => {
    const [error, setError] = useState('');
    const handleVoenChange = (e) => { const value = e.target.value.replace(/\D/g, ''); if (value.length <= 10) { setVoen(value); setError(''); } };
    const handleSubmit = (e) => { e.preventDefault(); if (voen.length === 10) { onNext(); } else { setError('VÖEN must be exactly 10 digits.'); } };
    return (<><BackButton onClick={onBack} /><OnboardingWrapper title="VÖEN Number" step={3} totalSteps={4}><form onSubmit={handleSubmit} className="space-y-4"><p className="text-gray-600">Please enter your company's 10-digit VÖEN.</p><div><label htmlFor="voen" className="sr-only">VÖEN</label><input id="voen" type="text" value={voen} onChange={handleVoenChange} required pattern="\d{10}" title="VÖEN must be 10 digits" className={`mt-1 block w-full px-4 py-3 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D2B4F] sm:text-lg text-center ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="1234567890" />{error && <p className="text-red-500 text-sm mt-2">{error}</p>}</div><button type="submit" disabled={voen.length !== 10} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D2B4F] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed">Continue</button></form></OnboardingWrapper></>);
};
const SignUpScreen = ({ onBack, onSignUp, loading, isInsuranceCompany }) => (<><BackButton onClick={onBack} /><OnboardingWrapper title="Create Your Account" step={isInsuranceCompany ? 3 : 4} totalSteps={isInsuranceCompany ? 3 : 4}><div className="space-y-6"><p className="text-gray-600">You're almost there! Create your account to save your information and access the dashboard.</p><button onClick={onSignUp} disabled={loading} className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200">{loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div> : <><GoogleIcon /> Sign Up with Google</>}</button></div></OnboardingWrapper></>);

// --- Messaging Modal Component ---
const MessagingModal = ({ isOpen, onClose, inquiry, user, profileData, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    if (!isOpen) return null;
    const handleSendMessage = (e) => { e.preventDefault(); if (!newMessage.trim() || !inquiry?.id) return; onSendMessage(inquiry.id, newMessage, inquiry.leasingCompanyId === user.uid ? inquiry.insuranceCompanyId : inquiry.leasingCompanyId); setNewMessage(''); };
    const otherPartyName = inquiry?.leasingCompanyName === profileData?.companyName ? inquiry.insuranceCompanyName : inquiry.leasingCompanyName;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in"><div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col"><header className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-gray-800">Conversation with {otherPartyName}</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button></header><main className="flex-1 p-4 overflow-y-auto bg-gray-50"><div className="space-y-4">{messages.map((msg) => (<div key={msg.id} className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}><div className={`max-w-md p-3 rounded-xl ${msg.senderId === user.uid ? 'bg-[#1D2B4F] text-white' : 'bg-gray-200 text-gray-800'}`}><p className="text-sm">{msg.text}</p><p className={`text-xs mt-1 ${msg.senderId === user.uid ? 'text-blue-100' : 'text-gray-500'}`}>{msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div>))}{messages.length === 0 && <p className="text-center text-gray-500">No messages yet.</p>}<div ref={messagesEndRef} /></div></main><footer className="p-4 border-t"><form onSubmit={handleSendMessage} className="flex items-center space-x-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2EBA78]" /><button type="submit" className="px-6 py-2 bg-[#2EBA78] text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-green-300" disabled={!newMessage.trim()}>Send</button></form></footer></div></div>);
};

// --- Leasing Company Dashboard ---
const DashboardScreen = ({ user, profileData, setAlert, notifications, onClearNotifications }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontImagePreview, setFrontImagePreview] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('pending');
    const [dragActive, setDragActive] = useState({ front: false, back: false });
    const [insuranceCompanies, setInsuranceCompanies] = useState([]);
    const [selectedInsurers, setSelectedInsurers] = useState({});
    const [loadingInsurers, setLoadingInsurers] = useState(false);
    const [showMessaging, setShowMessaging] = useState(false);
    const [sentInquiries, setSentInquiries] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [messages, setMessages] = useState({});
    const [messageUnsubscribe, setMessageUnsubscribe] = useState(null);
    const [activeView, setActiveView] = useState('new_inquiry');
    const prevInquiriesRef = useRef([]);

    useEffect(() => {
        if (!user?.uid) return;
        setLoadingHistory(true);
        const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
        const q = query(inquiriesRef, where("leasingCompanyId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => { 
            const newInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            newInquiries.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
            
            newInquiries.forEach(newInq => {
                const oldInq = prevInquiriesRef.current.find(old => old.id === newInq.id);
                if (oldInq && oldInq.status === 'pending' && newInq.status === 'responded') {
                    setAlert({ show: true, message: `Your inquiry to ${newInq.insuranceCompanyName} has been responded to. They are preparing a detailed quote.`, type: 'info' });
                }
            });

            setSentInquiries(newInquiries);
            prevInquiriesRef.current = newInquiries;
            setLoadingHistory(false);
        }, (error) => {
            console.error("Error fetching inquiries:", error);
            setAlert({ show: true, message: "Could not load inquiry history.", type: 'error' });
            setLoadingHistory(false);
        });
        return () => unsubscribe();
    }, [user?.uid, setAlert]);
    
    const handleSignOut = () => signOut(auth).catch(error => console.error("Sign out error:", error));
    const handleImageUpload = (file, type) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'front') { setFrontImage(file); setFrontImagePreview(e.target.result); } 
                else { setBackImage(file); setBackImagePreview(e.target.result); }
            };
            reader.readAsDataURL(file);
        } else { setAlert({ show: true, message: 'Please upload a valid image file (JPG, PNG, etc.)', type: 'error' }); }
    };
    const handleDrop = (e, type) => { e.preventDefault(); setDragActive({ front: false, back: false }); if (e.dataTransfer.files.length > 0) handleImageUpload(e.dataTransfer.files[0], type); };
    const handleDragEnter = (e, type) => { e.preventDefault(); setDragActive(prev => ({ ...prev, [type]: true })); };
    const handleDragLeave = (type) => setDragActive(prev => ({ ...prev, [type]: false }));
    const handleFileSelect = (e, type) => { if (e.target.files[0]) handleImageUpload(e.target.files[0], type); };
    const handleSubmit = () => {
        if (!frontImage || !backImage) { setAlert({ show: true, message: 'Please upload both front and back images.', type: 'error' }); return; }
        setUploadStatus('insurance_selection');
        fetchInsuranceCompanies();
    };
    const fetchInsuranceCompanies = async () => {
        setLoadingInsurers(true);
        try {
            const usersRef = collection(db, `artifacts/${appId}/users`);
            const q = query(usersRef, where("profile.role", "==", "Insurance Company"));
            const snapshot = await getDocs(q);
            setInsuranceCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data().profile })));
        } catch (error) { console.error('Error fetching insurance companies:', error); setAlert({ show: true, message: 'Could not fetch insurance companies.', type: 'error' });
        } finally { setLoadingInsurers(false); }
    };
    const handlePercentageChange = (companyId, percentage) => setSelectedInsurers(prev => ({ ...prev, [companyId]: parseInt(percentage) || 0 }));
    const getTotalPercentage = () => Object.values(selectedInsurers).reduce((sum, percent) => sum + percent, 0);
    const handleSendInquiries = async () => {
        const totalPercentage = getTotalPercentage();
        if (totalPercentage !== 100) { setAlert({ show: true, message: `Total percentage must be 100%. Current is ${totalPercentage}%.`, type: 'error' }); return; }
        const selectedCompanies = Object.entries(selectedInsurers).filter(([_, p]) => p > 0).map(([id, p]) => ({ id, p }));
        if (selectedCompanies.length === 0) { setAlert({ show: true, message: 'Please select at least one company.', type: 'error' }); return; }
        
        setUploadStatus('sending');
        try {
            for (const { id, p } of selectedCompanies) {
                const companyDetails = insuranceCompanies.find(c => c.uid === id);
                const inquiryData = {
                    leasingCompanyId: user.uid,
                    leasingCompanyName: profileData.companyName,
                    leasingCompanyVoen: profileData.voen,
                    insuranceCompanyId: id,
                    insuranceCompanyName: companyDetails?.companyName || 'N/A',
                    percentage: p,
                    clientName: user.displayName || 'Client',
                    vehicleInfo: 'Vehicle Info',
                    requestDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    message: `Inquiry for ${p}% coverage.`,
                    frontImageUrl: frontImagePreview,
                    backImageUrl: backImagePreview,
                    createdAt: serverTimestamp()
                };
                await addDoc(collection(db, `artifacts/${appId}/inquiries`), inquiryData);
            }
            setAlert({ show: true, message: 'Inquiries sent successfully!', type: 'success' });
            setUploadStatus('completed');
            setSelectedInsurers({});
        } catch (error) { console.error('Error sending inquiries:', error); setAlert({ show: true, message: 'Error sending inquiries.', type: 'error' }); setUploadStatus('insurance_selection'); }
    };
    const createNotification = async (recipientId, message) => {
        const notificationsRef = collection(db, `artifacts/${appId}/users/${recipientId}/notifications`);
        await addDoc(notificationsRef, { message, senderName: profileData.companyName, timestamp: serverTimestamp(), read: false });
    };
    const sendMessage = async (inquiryId, messageText, recipientId) => {
        if (!messageText.trim()) return;
        const messageData = { text: messageText.trim(), senderId: user.uid, senderName: profileData.companyName, senderRole: 'Leasing Company', timestamp: serverTimestamp(), read: false };
        await addDoc(collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`), messageData);
        await createNotification(recipientId, `${profileData.companyName} sent: "${messageText}"`);
    };
    const openMessaging = (inquiry) => {
        if (messageUnsubscribe) messageUnsubscribe();
        setSelectedInquiry(inquiry);
        setShowMessaging(true);
        const unsubscribeFunc = onSnapshot(query(collection(db, `artifacts/${appId}/inquiries/${inquiry.id}/messages`), orderBy("timestamp", "asc")), (snapshot) => {
            setMessages(prev => ({ ...prev, [inquiry.id]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) }));
        });
        setMessageUnsubscribe(() => unsubscribeFunc);
    };
    const closeMessaging = () => { if (messageUnsubscribe) messageUnsubscribe(); setShowMessaging(false); setSelectedInquiry(null); setMessageUnsubscribe(null); };
    const getStatusChip = (status) => {
        switch(status) {
            case 'pending': return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>;
            case 'responded': return <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Waiting for Price</span>;
            case 'rejected': return <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">Rejected</span>;
            default: return <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize">{status}</span>;
        }
    }

    const renderMainContent = () => {
        if (activeView === 'history') {
            return (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Sent Inquiries History</h2>
                    <div className="space-y-4">
                        {loadingHistory ? <LoadingSpinner /> : sentInquiries.length > 0 ? sentInquiries.map(inquiry => (
                             <div key={inquiry.id} className="bg-white rounded-xl p-4 border border-gray-200/80 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
                                <div className="flex-grow">
                                    <p className="font-semibold">{inquiry.insuranceCompanyName}</p>
                                    <p className="text-sm text-gray-600">Status: {getStatusChip(inquiry.status)}</p>
                                </div>
                                <button onClick={() => openMessaging(inquiry)} className="px-4 py-2 bg-[#2EBA78] text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto">Messages</button>
                            </div>
                        )) : <div className="text-center py-10 bg-gray-50 rounded-lg"><p className="text-gray-500">No inquiries sent yet.</p></div>}
                    </div>
                </div>
            );
        }

        switch (uploadStatus) {
            case 'pending': return (<div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80"><h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Insurance Inquiry</h2><p className="text-gray-600 mb-6">Upload photos of the vehicle registration document (front and back).</p><div className="grid md:grid-cols-2 gap-6">{['front', 'back'].map((type) => (<div key={type}><label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{type} Side</label><div onDrop={(e) => handleDrop(e, type)} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => handleDragEnter(e, type)} onDragLeave={() => handleDragLeave(type)} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragActive[type] ? 'border-[#1D2B4F]' : 'border-gray-300'} border-dashed rounded-md transition-colors`}><div className="space-y-1 text-center">{ (type === 'front' ? frontImagePreview : backImagePreview) ? (<img src={type === 'front' ? frontImagePreview : backImagePreview} alt={`${type} preview`} className="mx-auto h-32 w-auto rounded-lg object-contain" />) : (<><UploadIcon className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm text-gray-600"><label htmlFor={`${type}-file-upload`} className="relative cursor-pointer bg-white rounded-md font-medium text-[#1D2B4F] hover:text-blue-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"><span>Upload a file</span><input id={`${type}-file-upload`} name={`${type}-file-upload`} type="file" className="sr-only" onChange={(e) => handleFileSelect(e, type)} accept="image/*" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p></>)}</div></div></div>))}</div><div className="mt-8 flex justify-end"><button onClick={handleSubmit} disabled={!frontImage || !backImage} className="px-8 py-3 bg-[#1D2B4F] text-white font-semibold rounded-lg shadow-md hover:bg-blue-900 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">Next: Select Insurers</button></div></div>);
            case 'insurance_selection': return (<div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80"><h2 className="text-2xl font-bold text-gray-800 mb-2">Select Insurance Companies</h2><p className="text-gray-600 mb-6">Distribute 100% of the coverage among the selected companies.</p>{loadingInsurers ? <LoadingSpinner /> : (<div className="space-y-4">{insuranceCompanies.map(company => (<div key={company.uid} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"><span className="font-medium text-gray-800">{company.companyName}</span><div className="flex items-center space-x-2"><input type="number" min="0" max="100" value={selectedInsurers[company.uid] || ''} onChange={(e) => handlePercentageChange(company.uid, e.target.value)} className="w-24 text-right px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1D2B4F]" /><span className="text-gray-600">%</span></div></div>))}</div>)}<div className="mt-8 flex justify-between items-center"><div className="font-semibold text-lg">Total: <span className={getTotalPercentage() === 100 ? 'text-green-600' : 'text-red-600'}>{getTotalPercentage()}%</span></div><button onClick={handleSendInquiries} disabled={getTotalPercentage() !== 100} className="px-8 py-3 bg-[#2EBA78] text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed">Send Inquiries</button></div></div>);
            case 'sending': return <div className="text-center p-12 bg-white rounded-2xl shadow-lg"><h2 className="text-2xl font-bold text-gray-800">Sending Inquiries...</h2><LoadingSpinner /></div>;
            case 'completed': return (<div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200/80"><h2 className="text-2xl font-bold text-green-600 mb-4">Inquiries Sent!</h2><p className="text-gray-600 mb-6">You can track the status of your inquiries in the History tab.</p><button onClick={() => { setUploadStatus('pending'); setActiveView('history'); }} className="px-6 py-2 bg-[#1D2B4F] text-white font-semibold rounded-lg shadow-md hover:bg-blue-900 transition-colors">View History</button></div>);
            default: return null;
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-20 sm:pb-0">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3"><SigormanLogo className="w-8 h-8" /><h1 className="text-lg font-bold text-[#1D2B4F] hidden sm:block">Sığorman</h1></div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button onClick={() => { setShowNotifications(p => !p); if (!showNotifications) { onClearNotifications(); } }} className="relative text-gray-600 hover:text-gray-800"><BellIcon className="w-6 h-6" />{notifications.filter(n => !n.read).length > 0 && (<span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>)}</button>
                                {showNotifications && <NotificationsPanel notifications={notifications} onClear={onClearNotifications} />}
                            </div>
                            <div className="relative">
                                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2EBA78]"><div className="w-9 h-9 bg-[#1D2B4F] rounded-xl flex items-center justify-center shadow-md"><UserIcon className="w-5 h-5 text-white" /></div><div className="text-left hidden sm:block"><p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p><p className="text-xs text-gray-500">{profileData.companyName}</p></div></button>
                                {showProfileMenu && (<div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 py-2 z-20 animate-fade-in-down"><div className="px-4 py-3 border-b border-gray-100"><p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || user.email}</p><p className="text-xs text-gray-500 mt-1">{profileData.role}</p></div><div className="p-1"><button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg">Sign Out</button></div></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">{renderMainContent()}</main>
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg flex justify-around z-40">
                <button onClick={() => setActiveView('new_inquiry')} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 ${activeView === 'new_inquiry' ? 'text-[#1D2B4F]' : 'text-gray-500'}`}><PlusCircleIcon className="w-6 h-6 mb-1" /><span className="text-xs">New Inquiry</span></button>
                <button onClick={() => setActiveView('history')} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 ${activeView === 'history' ? 'text-[#1D2B4F]' : 'text-gray-500'}`}><HistoryIcon className="w-6 h-6 mb-1" /><span className="text-xs">History</span></button>
            </nav>
            <MessagingModal isOpen={showMessaging} onClose={closeMessaging} inquiry={selectedInquiry} user={user} profileData={profileData} messages={messages[selectedInquiry?.id] || []} onSendMessage={sendMessage} />
        </div>
    );
};

// --- Insurance Company Dashboard ---
const InsuranceCompanyDashboard = ({ user, profileData, setAlert, notifications, onClearNotifications }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('inquiries');
    const [inquiries, setInquiries] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showMessaging, setShowMessaging] = useState(false);
    const [messages, setMessages] = useState({});
    const [messageUnsubscribe, setMessageUnsubscribe] = useState(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    useEffect(() => {
        const inquiriesRef = collection(db, `artifacts/${appId}/inquiries`);
        const q = query(inquiriesRef, where("insuranceCompanyId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const companyInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            companyInquiries.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
            setInquiries(companyInquiries);
            setLoadingInquiries(false);
        }, (error) => { console.error('Error in inquiries listener:', error); setLoadingInquiries(false); });
        return () => unsubscribe();
    }, [user.uid]);

    const handleSignOut = () => signOut(auth).catch(error => console.error("Sign out error:", error));
    const handleRespond = async (inquiry) => {
        await updateDoc(doc(db, `artifacts/${appId}/inquiries`, inquiry.id), { status: 'responded' });
        const initialMessage = "Thank you for your inquiry. Please wait until we provide you with the price.";
        await sendMessage(inquiry.id, initialMessage, inquiry.leasingCompanyId);
        openMessaging({...inquiry, status: 'responded'});
    };
    const handleReject = async (inquiry) => updateDoc(doc(db, `artifacts/${appId}/inquiries`, inquiry.id), { status: 'rejected' });
    const createNotification = async (recipientId, message) => {
        const notificationsRef = collection(db, `artifacts/${appId}/users/${recipientId}/notifications`);
        await addDoc(notificationsRef, { message, senderName: profileData.companyName, timestamp: serverTimestamp(), read: false });
    };
    const sendMessage = async (inquiryId, messageText, recipientId) => {
        if (!messageText.trim()) return;
        const messageData = { text: messageText.trim(), senderId: user.uid, senderName: profileData.companyName, senderRole: 'Insurance Company', timestamp: serverTimestamp(), read: false };
        await addDoc(collection(db, `artifacts/${appId}/inquiries/${inquiryId}/messages`), messageData);
        await createNotification(recipientId, `${profileData.companyName} sent: "${messageText}"`);
    };
    const openMessaging = (inquiry) => {
        if (messageUnsubscribe) messageUnsubscribe();
        setSelectedInquiry(inquiry);
        setShowMessaging(true);
        const unsubscribeFunc = onSnapshot(query(collection(db, `artifacts/${appId}/inquiries/${inquiry.id}/messages`), orderBy("timestamp", "asc")), (snapshot) => {
            setMessages(prev => ({ ...prev, [inquiry.id]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) }));
        });
        setMessageUnsubscribe(() => unsubscribeFunc);
    };
    const closeMessaging = () => { if (messageUnsubscribe) messageUnsubscribe(); setShowMessaging(false); setSelectedInquiry(null); setMessageUnsubscribe(null); };

    const filteredInquiries = inquiries.filter(inquiry => {
        if (activeTab === 'inquiries') return inquiry.status === 'pending';
        if (activeTab === 'responded') return inquiry.status === 'responded' || inquiry.status === 'rejected';
        return false;
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <ImagePreviewModal imageUrl={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3"><SigormanLogo className="w-8 h-8" /><h1 className="text-lg font-bold text-[#1D2B4F] hidden sm:block">Sığorman</h1></div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button onClick={() => { setShowNotifications(p => !p); if (!showNotifications) { onClearNotifications(); } }} className="relative text-gray-600 hover:text-gray-800"><BellIcon className="w-6 h-6" />{notifications.filter(n => !n.read).length > 0 && (<span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>)}</button>
                                {showNotifications && <NotificationsPanel notifications={notifications} onClear={onClearNotifications} />}
                            </div>
                            <div className="relative">
                                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2EBA78]"><div className="w-9 h-9 bg-[#1D2B4F] rounded-xl flex items-center justify-center shadow-md"><UserIcon className="w-5 h-5 text-white" /></div><div className="text-left hidden sm:block"><p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p><p className="text-xs text-gray-500">{profileData.companyName}</p></div></button>
                                {showProfileMenu && (<div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 py-2 z-20 animate-fade-in-down"><div className="px-4 py-3 border-b border-gray-100"><p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || user.email}</p><p className="text-xs text-gray-500 mt-1">{profileData.role}</p></div><div className="p-1"><button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg">Sign Out</button></div></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
                    <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl"><button onClick={() => setActiveTab('inquiries')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'inquiries' ? 'bg-white text-[#2EBA78] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>New Inquiries ({inquiries.filter(i => i.status === 'pending').length})</button><button onClick={() => setActiveTab('responded')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'responded' ? 'bg-white text-[#2EBA78] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Responded ({inquiries.filter(i => i.status !== 'pending').length})</button></div>
                    <div className="space-y-4">
                        {loadingInquiries ? <LoadingSpinner /> : filteredInquiries.length === 0 ? (<div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries in this tab</h3></div>) : (filteredInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2"><h3 className="text-lg font-semibold text-gray-900">{inquiry.leasingCompanyName}</h3><span className={`px-3 py-1 rounded-full text-xs font-medium ${inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{inquiry.status}</span></div>
                                    <p className="text-sm text-gray-600 mb-4">VÖEN: {inquiry.leasingCompanyVoen || 'N/A'}</p>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-4">{inquiry.message}</p>
                                    <h4 className="font-medium text-gray-800 mb-2">Vehicle Registration Photos:</h4>
                                    <div className="flex space-x-4 mb-6"><img src={inquiry.frontImageUrl} alt="Front" className="w-32 h-20 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setPreviewImageUrl(inquiry.frontImageUrl)} /><img src={inquiry.backImageUrl} alt="Back" className="w-32 h-20 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setPreviewImageUrl(inquiry.backImageUrl)} /></div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 pt-4 border-t border-gray-200 gap-3">
                                    <div className="flex items-center space-x-3">
                                        {inquiry.status === 'pending' && (<><button onClick={() => handleRespond(inquiry)} className="bg-[#2EBA78] text-white py-2 px-4 rounded-xl font-medium hover:bg-green-600 transition-all">Respond</button><button onClick={() => handleReject(inquiry)} className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-xl font-medium hover:bg-gray-100 transition-all">Reject</button></>)}
                                    </div>
                                    <button onClick={() => openMessaging(inquiry)} className="px-4 py-2 bg-[#1D2B4F] text-white rounded-xl hover:bg-blue-900 transition-colors w-full sm:w-auto">Messages</button>
                                </div>
                            </div>
                        )))}
                    </div>
                </div>
            </main>
            <MessagingModal isOpen={showMessaging} onClose={closeMessaging} inquiry={selectedInquiry} user={user} profileData={profileData} messages={messages[selectedInquiry?.id] || []} onSendMessage={sendMessage} />
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [onboardingStep, setOnboardingStep] = useState('role');
    const [onboardingData, setOnboardingData] = useState({ role: '', companyName: '', voen: '' });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userProfileDocRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}`);
                const docSnap = await getDoc(userProfileDocRef);
                if (docSnap.exists() && docSnap.data().profile?.role) {
                    setUser(currentUser);
                    setProfileData(docSnap.data().profile);
                } else { setUser(currentUser); setProfileData(null); setOnboardingStep('role'); }
            } else { setUser(null); setProfileData(null); setOnboardingStep('role'); }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user?.uid) return;
        const notificationsRef = collection(db, `artifacts/${appId}/users/${user.uid}/notifications`);
        const q = query(notificationsRef, orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(newNotifications);
        });
        return () => unsubscribe();
    }, [user?.uid]);

    useEffect(() => { if (alert.show) { const timer = setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 5000); return () => clearTimeout(timer); } }, [alert]);

    const handleSetOnboardingData = (data) => setOnboardingData(prev => ({ ...prev, ...data }));
    const handleGoogleSignUp = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedInUser = result.user;
            const finalProfileData = { ...onboardingData, email: loggedInUser.email, uid: loggedInUser.uid, displayName: loggedInUser.displayName };
            await setDoc(doc(db, `artifacts/${appId}/users`, loggedInUser.uid), { profile: finalProfileData });
            setUser(loggedInUser);
            setProfileData(finalProfileData);
        } catch (error) { console.error("Google Sign-Up Error:", error); setAlert({ show: true, message: error.message, type: 'error' });
        } finally { setLoading(false); }
    };

    const handleClearNotifications = async () => {
        if (!user?.uid) return;
        const batch = writeBatch(db);
        const notificationsRef = collection(db, `artifacts/${appId}/users/${user.uid}/notifications`);
        notifications.forEach(notif => {
            if (!notif.read) {
                const docRef = doc(notificationsRef, notif.id);
                batch.update(docRef, { read: true });
            }
        });
        await batch.commit().catch(err => console.error("Error marking notifications as read", err));
    };

    const renderContent = () => {
        const isInDashboard = user && profileData;
        if (loading) {
            return (
                <div className="flex flex-col justify-center items-center p-4 h-screen w-full">
                    <LoadingSpinner />
                </div>
            );
        }
        if (isInDashboard) {
            if (profileData.role === 'Insurance Company') {
                return <InsuranceCompanyDashboard user={user} profileData={profileData} setAlert={setAlert} notifications={notifications} onClearNotifications={handleClearNotifications} />;
            } else {
                return <DashboardScreen user={user} profileData={profileData} setAlert={setAlert} notifications={notifications} onClearNotifications={handleClearNotifications} />;
            }
        }
        // Onboarding Flow
        return (
             <div className="flex flex-col justify-center items-center p-4 w-full h-screen">
                {(() => {
                    switch (onboardingStep) {
                        case 'role': return <RoleSelectionScreen onSelectRole={(role) => { handleSetOnboardingData({ role }); setOnboardingStep('companyName'); }} />;
                        case 'companyName': return <CompanyNameScreen companyName={onboardingData.companyName} setCompanyName={(name) => handleSetOnboardingData({ companyName: name })} selectedRole={onboardingData.role} onNext={(e) => { e.preventDefault(); setOnboardingStep(onboardingData.role === 'Insurance Company' ? 'signup' : 'voen'); }} onBack={() => setOnboardingStep('role')} />;
                        case 'voen': return <VoenScreen voen={onboardingData.voen} setVoen={(voen) => handleSetOnboardingData({ voen })} onNext={() => setOnboardingStep('signup')} onBack={() => setOnboardingStep('companyName')} />;
                        case 'signup': return <SignUpScreen onBack={() => setOnboardingStep(onboardingData.role === 'Insurance Company' ? 'companyName' : 'voen')} onSignUp={handleGoogleSignUp} loading={loading} isInsuranceCompany={onboardingData.role === 'Insurance Company'} />;
                        default: return <RoleSelectionScreen onSelectRole={(role) => { handleSetOnboardingData({ role }); setOnboardingStep('companyName'); }} />;
                    }
                })()}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <AlertBanner message={alert.message} type={alert.type} onDismiss={() => setAlert({ ...alert, show: false })} />
            {renderContent()}
            <style>{`@keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-in-out; } @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }`}</style>
        </div>
    );
}
