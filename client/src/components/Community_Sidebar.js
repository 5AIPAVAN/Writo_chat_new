// import React, { useEffect, useState } from 'react';
// import { IoChatbubbleEllipses } from "react-icons/io5";
// import { FaUserPlus } from "react-icons/fa";
// import { NavLink, useNavigate } from 'react-router-dom';
// import { BiLogOut } from "react-icons/bi";
// import Avatar from './Avatar';
// import { useDispatch, useSelector } from 'react-redux';
// import EditUserDetails from './EditUserDetails';
// import Divider from './Divider';
// import { FiArrowUpLeft } from "react-icons/fi";
// import SearchUser from './SearchUser';
// import { FaImage, FaVideo } from "react-icons/fa";
// import userSlice, { logout } from '../redux/userSlice';

// // Broadcast Channel IDs
// const BROADCAST_CHANNEL_IDS = {
//     JEE: '669d47f2f4913b792cc11ef0',
//     NEET: '669fae90c5fda49c52117d6b',
//     CLASS_11: '669faf3c6b1f5158c2cf2698',
//     CLASS_12: '669fafa16b1f5158c2cf269b'
// };

// const Community_Sidebar = () => {
//     const user = useSelector(state => state?.user);
//     const [allUser, setAllUser] = useState([]);
//     const socketConnection = useSelector(state => state?.user?.socketConnection);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     // Determine which broadcast channel to show based on user's student_course
//     const getBroadcastChannelId = () => {
//         switch (user.student_course) {
//             case 'JEE':
//                 return BROADCAST_CHANNEL_IDS.JEE;
//             case 'NEET':
//                 return BROADCAST_CHANNEL_IDS.NEET;
//             case 'Class_11':
//                 return BROADCAST_CHANNEL_IDS.CLASS_11;
//             case 'Class_12':
//                 return BROADCAST_CHANNEL_IDS.CLASS_12;
//             default:
//                 return null;
//         }
//     };

//     const broadcastChannelId = getBroadcastChannelId();

//     // Dynamic name based on the student_course
//     const getBroadcastChannelName = () => {
//         switch (user.student_course) {
//             case 'JEE':
//                 return 'JEE Broadcast Channel';
//             case 'NEET':
//                 return 'NEET Broadcast Channel';
//             case 'Class_11':
//                 return 'CLASS-11 Broadcast Channel';
//             case 'Class_12':
//                 return 'CLASS-12 Broadcast Channel';
//             default:
//                 return 'Broadcast Channel';
//         }
//     };

//     useEffect(() => {
//         if (socketConnection) {
//             socketConnection.emit('sidebar', user._id);

//         }
//     }, [socketConnection, user]);

//     console.log('user in sideeebarr',user);

//     const handleLogout = () => {
//         dispatch(logout());
//         navigate("/email");
//         localStorage.clear();
//     };

//     return (
//         <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
//             <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
//                 <div>
//                     <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
//                         <IoChatbubbleEllipses size={20} />
//                     </NavLink>

               
//                 </div>

//                 <div className='flex flex-col items-center'>
        
//                     <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' onClick={handleLogout}>
//                         <span className='-ml-2'>
//                             <BiLogOut size={20} />
//                         </span>
//                     </button>
//                 </div>
//             </div>

//             <div className='w-full'>
//                 <div className='h-16 flex items-center'>
//                     <h2 className='text-xl font-bold p-4 text-slate-800'>BroadCast Channel</h2>
//                 </div>
//                 <div className='bg-slate-200 p-[0.5px]'></div>

//                 <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
//                     {broadcastChannelId && (
//                         <NavLink
//                             to={`/community-chat/${broadcastChannelId}`}
//                             className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'
//                         >
//                             <div>
//                                 <Avatar
//                                     imageUrl="" // Optional: Add a default image URL for broadcast channels
//                                     name="Broadcast Channel"
//                                     width={40}
//                                     height={40}
//                                 />
//                             </div>
//                             <div>
//                                 <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>
//                                     {getBroadcastChannelName()}
//                                 </h3>
//                                 <div className='text-slate-500 text-xs flex items-center gap-1'>
//                                     {/* Optionally show some details here */}
//                                 </div>
//                             </div>
//                         </NavLink>
//                     )}
//                 </div>
//             </div>


//         </div>
//     );
// };

// export default Community_Sidebar;



import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage, FaVideo } from "react-icons/fa";
import userSlice, { logout } from '../redux/userSlice';

// Broadcast Channel IDs
const BROADCAST_CHANNEL_IDS = {
    JEE: '669d47f2f4913b792cc11ef0',
    NEET: '669fae90c5fda49c52117d6b',
    CLASS_11: '669faf3c6b1f5158c2cf2698',
    CLASS_12: '669fafa16b1f5158c2cf269b'
};

// Broadcast Channel Names
const BROADCAST_CHANNEL_NAMES = {
    JEE: 'JEE Broadcast Channel',
    NEET: 'NEET Broadcast Channel',
    CLASS_11: 'CLASS-11 Broadcast Channel',
    CLASS_12: 'CLASS-12 Broadcast Channel'
};

const Community_Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [allUser, setAllUser] = useState([]);
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get the broadcast channels the user should join based on their role
    const getBroadcastChannels = () => {
        if (user?.mentor) {
            // If the user is a mentor, return all channels
            return Object.keys(BROADCAST_CHANNEL_IDS);
        } else {
            // If the user is a student, return only the relevant channel
            switch (user?.student_course) {
                case 'JEE':
                    return ['JEE'];
                case 'NEET':
                    return ['NEET'];
                case 'CLASS_11':
                    return ['CLASS_11'];
                case 'CLASS_12':
                    return ['CLASS_12'];
                default:
                    return [];
            }
        }
    };

    const broadcastChannels = getBroadcastChannels();

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id);
        }
    }, [socketConnection, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/email");
        localStorage.clear();
    };

    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div>
                    <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbubbleEllipses size={20} />
                    </NavLink>

               
                </div>

                <div className='flex flex-col items-center'>
        
                    <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' onClick={handleLogout}>
                        <span className='-ml-2'>
                            <BiLogOut size={20} />
                        </span>
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='h-16 flex items-center'>
                    <h2 className='text-xl font-bold p-4 text-slate-800'>Broadcast Channels</h2>
                </div>
                <div className='bg-slate-200 p-[0.5px]'></div>

                <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {broadcastChannels.map(channel => (
                        <NavLink
                            key={channel}
                            to={`/community-chat/${BROADCAST_CHANNEL_IDS[channel]}`}
                            className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'
                        >
                            <div>
                                <Avatar
                                    imageUrl="" // Optional: Add a default image URL for broadcast channels
                                    name="Broadcast Channel"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div>
                                <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>
                                    {BROADCAST_CHANNEL_NAMES[channel]}
                                </h3>
                                <div className='text-slate-500 text-xs flex items-center gap-1'>
                                    {/* Optionally show some details here */}
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community_Sidebar;

