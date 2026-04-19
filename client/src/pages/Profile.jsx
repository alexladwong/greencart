import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, axios, navigate, setUser } = useAppContext();
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [showPasswordSection, setShowPasswordSection] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState(user?.profileImage || '');
    const [formData, setFormData] = React.useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profileImage: user?.profileImage || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Update form and preview when user data changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                profileImage: user.profileImage || ''
            }));
            setImagePreview(user.profileImage || '');
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                setFormData({
                    ...formData,
                    profileImage: base64String
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        console.log('Sending profile update:', {
            userId: user._id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            hasProfileImage: !!formData.profileImage,
            profileImageLength: formData.profileImage?.length
        });
        
        setIsLoading(true);
        
        try {
            const { data } = await axios.post('/api/user/update', {
                userId: user._id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                profileImage: formData.profileImage
            });

            console.log('Profile update response:', data);

            if (data.success) {
                setUser(data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/user/update', {
                userId: user._id,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (data.success) {
                setShowPasswordSection(false);
                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                toast.success('Password updated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            profileImage: user?.profileImage || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setImagePreview(user?.profileImage || '');
        setIsEditing(false);
        setShowPasswordSection(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please login to view your profile</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    {!isEditing && !showPasswordSection && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-primary hover:bg-primary-dull text-white px-6 py-2 rounded-lg transition-all"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Profile Image Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Profile Image</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dull transition-all">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </label>
                            )}
                        </div>
                        {isEditing && (
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Upload a new profile image</p>
                                <p className="text-xs text-gray-400">Max size: 5MB. Formats: JPG, PNG, GIF</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Account Information</h2>
                    
                    {isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number <span className="text-gray-400 font-normal">(for future SMS notifications)</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1234567890"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-primary-dull text-white px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <p className="text-lg text-gray-800">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                <p className="text-lg text-gray-800">{user.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                <p className="text-lg text-gray-800">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Change Password</h2>
                    
                    {showPasswordSection ? (
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-primary-dull text-white px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowPasswordSection(true)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-all"
                        >
                            Change Password
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
