import React, { useState, useEffect, useRef } from 'react';
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    getDocs, 
    updateDoc 
} from 'firebase/firestore';

const MessagingModal = ({ 
    isOpen, 
    onClose, 
    inquiry, 
    user, 
    profileData, 
    db, 
    appId 
}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch messages for this inquiry
    useEffect(() => {
        if (!isOpen || !inquiry) {
            console.log('MessagingModal: Not fetching messages - modal closed or no inquiry');
            return;
        }

        console.log('MessagingModal: Setting up real-time listener for inquiry:', inquiry.id);
        const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiry.id}/messages`);
        
        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            console.log('MessagingModal: Received messages snapshot, size:', snapshot.size);
            const inquiryMessages = [];
            snapshot.forEach((doc) => {
                const messageData = { id: doc.id, ...doc.data() };
                console.log('MessagingModal: Message data:', messageData);
                inquiryMessages.push(messageData);
            });
            
            // Sort by timestamp
            inquiryMessages.sort((a, b) => {
                const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
                const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
                return timeA - timeB;
            });
            
            console.log('MessagingModal: Setting messages:', inquiryMessages.length, 'messages');
            setMessages(inquiryMessages);
            
            // Mark messages as read when viewing
            if (inquiryMessages.length > 0) {
                markMessagesAsRead();
            }
        }, (error) => {
            console.error('MessagingModal: Error fetching messages:', error);
        });
        
        return () => {
            console.log('MessagingModal: Cleaning up message listener');
            unsubscribe();
        };
    }, [isOpen, inquiry?.id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || loading) {
            console.log('SendMessage: Not sending - empty message or already sending');
            return;
        }
        
        console.log('SendMessage: Sending message for inquiry:', inquiry.id);
        setLoading(true);
        try {
            const messageData = {
                text: newMessage.trim(),
                senderId: user.uid,
                senderName: profileData.companyName,
                senderRole: profileData.role,
                timestamp: new Date(),
                read: false
            };
            
            console.log('SendMessage: Message data:', messageData);
            const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiry.id}/messages`);
            await addDoc(messagesRef, messageData);
            
            console.log('SendMessage: Message sent successfully');
            setNewMessage('');
        } catch (error) {
            console.error('SendMessage: Error sending message:', error);
            alert('Error sending message. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const markMessagesAsRead = async () => {
        try {
            const messagesRef = collection(db, `artifacts/${appId}/inquiries/${inquiry.id}/messages`);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] sm:h-[80vh] md:h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Message Thread</h3>
                        <p className="text-sm text-gray-600">
                            {profileData.role === 'Insurance Company' 
                                ? `${inquiry.leasingCompanyName} - ${inquiry.percentage}% Coverage`
                                : `${inquiry.insuranceCompanyName || 'Insurance Company'} - ${inquiry.percentage}% Coverage`
                            }
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Messages Area */}
                <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                        message.senderId === user.uid
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                                        <span>{message.senderName}</span>
                                        <span>
                                            {message.timestamp?.toDate?.()?.toLocaleTimeString() || 
                                             new Date(message.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}
                </div>
                
                {/* Message Input */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingModal;
