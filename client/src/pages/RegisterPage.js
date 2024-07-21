// import React, { useState } from 'react'
// import { IoClose } from "react-icons/io5";
// import { Link, useNavigate } from 'react-router-dom';
// import uploadFile from '../helpers/uploadFile';
// import axios from 'axios'
// import toast from 'react-hot-toast';

// const RegisterPage = () => {
//   const [data,setData] = useState({
//     name : "",
//     email : "",
//     password : "",
//     profile_pic : ""
//   })
//   const [uploadPhoto,setUploadPhoto] = useState("")
//   const navigate = useNavigate()

//   const handleOnChange = (e)=>{
//     const { name, value} = e.target

//     setData((preve)=>{
//       return{
//           ...preve,
//           [name] : value
//       }
//     })
//   }

//   const handleUploadPhoto = async(e)=>{
//     const file = e.target.files[0]

//     const uploadPhoto = await uploadFile(file)

//     setUploadPhoto(file)

//     setData((preve)=>{
//       return{
//         ...preve,
//         profile_pic : uploadPhoto?.url
//       }
//     })
//   }
//   const handleClearUploadPhoto = (e)=>{
//     e.stopPropagation()
//     e.preventDefault()
//     setUploadPhoto(null)
//   }

//   const handleSubmit = async(e)=>{
//     e.preventDefault()
//     e.stopPropagation()

//     const URL = `${process.env.REACT_APP_BACKEND_URL}/api/student_register`

//     try {
//         const response = await axios.post(URL,data)
//         console.log("response",response)

//         toast.success(response.data.message)

//         if(response.data.success){
//             setData({
//               name : "",
//               email : "",
//               password : "",
//               profile_pic : ""
//             })

//             navigate('/email')

//         }
//     } catch (error) {
//         toast.error(error?.response?.data?.message)
//     }
//     console.log('data',data)
//   }


//   return (
//     <div className='mt-5'>
//         <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
//           <h3>Welcome to Chat app!</h3>

//           <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
//               <div className='flex flex-col gap-1'>
//                 <label htmlFor='name'>Name :</label>
//                 <input
//                   type='text'
//                   id='name'
//                   name='name'
//                   placeholder='enter your name' 
//                   className='bg-slate-100 px-2 py-1 focus:outline-primary'
//                   value={data.name}
//                   onChange={handleOnChange}
//                   required
//                 />
//               </div>

//               <div className='flex flex-col gap-1'>
//                 <label htmlFor='email'>Email :</label>
//                 <input
//                   type='email'
//                   id='email'
//                   name='email'
//                   placeholder='enter your email' 
//                   className='bg-slate-100 px-2 py-1 focus:outline-primary'
//                   value={data.email}
//                   onChange={handleOnChange}
//                   required
//                 />
//               </div>

//               <div className='flex flex-col gap-1'>
//                 <label htmlFor='password'>Password :</label>
//                 <input
//                   type='password'
//                   id='password'
//                   name='password'
//                   placeholder='enter your password' 
//                   className='bg-slate-100 px-2 py-1 focus:outline-primary'
//                   value={data.password}
//                   onChange={handleOnChange}
//                   required
//                 />
//               </div>

//               <div className='flex flex-col gap-1'>
//                 <label htmlFor='profile_pic'>Photo :

//                   <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
//                       <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
//                         {
//                           uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
//                         }
//                       </p>
//                       {
//                         uploadPhoto?.name && (
//                           <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
//                             <IoClose/>
//                           </button>
//                         )
//                       }
                      
//                   </div>
                
//                 </label>
                
//                 <input
//                   type='file'
//                   id='profile_pic'
//                   name='profile_pic'
//                   className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
//                   onChange={handleUploadPhoto}
//                 />
//               </div>


//               <button
//                className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
//               >
//                 Register
//               </button>

//           </form>

//           <p className='my-3 text-center'>Already have account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
//         </div>
//     </div>
//   )
// }

// export default RegisterPage










// import React, { useState } from 'react'
// import { IoClose } from "react-icons/io5";
// import { Link, useNavigate } from 'react-router-dom';
// import uploadFile from '../helpers/uploadFile';
// import axios from 'axios'
// import toast from 'react-hot-toast';

// const RegisterPage = () => {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     profile_pic: "",
//     student_course: "",
//     mentor_subject: "",
//   });
//   const [uploadPhoto, setUploadPhoto] = useState(null);
//   const [isMentor, setIsMentor] = useState(false);
//   const navigate = useNavigate();

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;

//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUploadPhoto = async (e) => {
//     const file = e.target.files[0];

//     const uploadedPhoto = await uploadFile(file);

//     setUploadPhoto(file);

//     setData((prev) => ({
//       ...prev,
//       profile_pic: uploadedPhoto?.url,
//     }));
//   };

//   const handleClearUploadPhoto = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setUploadPhoto(null);
//     setData((prev) => ({
//       ...prev,
//       profile_pic: "",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const URL = isMentor
//       ? `${process.env.REACT_APP_BACKEND_URL}/api/mentor_register`
//       : `${process.env.REACT_APP_BACKEND_URL}/api/student_register`;

//     try {
//       const response = await axios.post(URL, data);
//       console.log("response", response);

//       toast.success(response.data.message);

//       if (response.data.success) {
//         setData({
//           name: "",
//           email: "",
//           password: "",
//           profile_pic: "",
//           student_course: "",
//           mentor_subject: "",
//         });

//         navigate('/email');
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//     console.log('data', data);
//   };

//   return (
//     <div className='mt-5'>
//       <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
//         <h3>Welcome to Chat app!</h3>

//         <div className='flex justify-center my-3'>
//           <button
//             className={`px-4 py-1 rounded-l ${!isMentor ? 'bg-primary text-white' : 'bg-gray-200'}`}
//             onClick={() => setIsMentor(false)}
//           >
//             Student
//           </button>
//           <button
//             className={`px-4 py-1 rounded-r ${isMentor ? 'bg-primary text-white' : 'bg-gray-200'}`}
//             onClick={() => setIsMentor(true)}
//           >
//             Mentor
//           </button>
//         </div>

//         <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
//           <div className='flex flex-col gap-1'>
//             <label htmlFor='name'>Name :</label>
//             <input
//               type='text'
//               id='name'
//               name='name'
//               placeholder='Enter your name'
//               className='bg-slate-100 px-2 py-1 focus:outline-primary'
//               value={data.name}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className='flex flex-col gap-1'>
//             <label htmlFor='email'>Email :</label>
//             <input
//               type='email'
//               id='email'
//               name='email'
//               placeholder='Enter your email'
//               className='bg-slate-100 px-2 py-1 focus:outline-primary'
//               value={data.email}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className='flex flex-col gap-1'>
//             <label htmlFor='password'>Password :</label>
//             <input
//               type='password'
//               id='password'
//               name='password'
//               placeholder='Enter your password'
//               className='bg-slate-100 px-2 py-1 focus:outline-primary'
//               value={data.password}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className='flex flex-col gap-1'>
//             <label htmlFor='profile_pic'>Photo :</label>

//             <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
//               <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
//                 {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
//               </p>
//               {uploadPhoto?.name && (
//                 <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
//                   <IoClose />
//                 </button>
//               )}
//             </div>

//             <input
//               type='file'
//               id='profile_pic'
//               name='profile_pic'
//               className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
//               onChange={handleUploadPhoto}
//             />
//           </div>

//           {isMentor ? (
//             <div className='flex flex-col gap-1'>
//               <label htmlFor='mentor_subject'>Subject :</label>
//               <select
//                 id='mentor_subject'
//                 name='mentor_subject'
//                 className='bg-slate-100 px-2 py-1 focus:outline-primary'
//                 value={data.mentor_subject}
//                 onChange={handleOnChange}
//                 required
//               >
//                 <option value="">Select your subject</option>
//                 <option value="MATHS">Mathematics</option>
//                 <option value="PHYSICS">Physics</option>
//                 <option value="CHEMISTRY">Chemistry</option>
      
//               </select>
//             </div>
//           ) : (
//             <div className='flex flex-col gap-1'>
//               <label htmlFor='student_course'>Course :</label>
//               <select
//                 id='student_course'
//                 name='student_course'
//                 className='bg-slate-100 px-2 py-1 focus:outline-primary'
//                 value={data.student_course}
//                 onChange={handleOnChange}
//                 required
//               >
//                 <option value="">Select your course</option>
//                 <option value="JEE">JEE</option>
//                 <option value="NEET">NEET</option>
//                 <option value="Class 11">Class 11</option>
//                 <option value="Class 12">Class 12</option>
//               </select>
//             </div>
//           )}

//           <button
//             className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
//           >
//             Register
//           </button>
//         </form>

//         <p className='my-3 text-center'>Already have an account? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;




import React, { useState, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
    student_course: "",
    mentor_subject: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedPhoto = await uploadFile(file);
    setUploadPhoto(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadedPhoto?.url,
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: "",
    }));
    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = isMentor
      ? `${process.env.REACT_APP_BACKEND_URL}/api/mentor_register`
      : `${process.env.REACT_APP_BACKEND_URL}/api/student_register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response", response);

      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
          student_course: "",
          mentor_subject: "",
        });

        navigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    console.log('data', data);
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome to Chat app!</h3>

        <div className='flex justify-center my-3'>
          <button
            className={`px-4 py-1 rounded-l ${!isMentor ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setIsMentor(false)}
          >
            Student
          </button>
          <button
            className={`px-4 py-1 rounded-r ${isMentor ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setIsMentor(true)}
          >
            Mentor
          </button>
        </div>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name :</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic'>Photo :</label>

            <div
              className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'
              onClick={handleFileClick} // Trigger the file input click
            >
              <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
              </p>
              {uploadPhoto?.name && (
                <button
                  type='button'
                  className='text-lg ml-2 hover:text-red-600'
                  onClick={handleClearUploadPhoto}
                >
                  <IoClose />
                </button>
              )}
            </div>

            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
              onChange={handleUploadPhoto}
              ref={fileInputRef} // Attach the ref to the file input
            />
          </div>

          {isMentor ? (
            <div className='flex flex-col gap-1'>
              <label htmlFor='mentor_subject'>Subject :</label>
              <select
                id='mentor_subject'
                name='mentor_subject'
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                value={data.mentor_subject}
                onChange={handleOnChange}
                required
              >
                <option value="">Select your subject</option>
                <option value="MATHS">Mathematics</option>
                <option value="PHYSICS">Physics</option>
                <option value="CHEMISTRY">Chemistry</option>
              </select>
            </div>
          ) : (
            <div className='flex flex-col gap-1'>
              <label htmlFor='student_course'>Course :</label>
              <select
                id='student_course'
                name='student_course'
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                value={data.student_course}
                onChange={handleOnChange}
                required
              >
                <option value="">Select your course</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
          )}

          <button
            type='submit'
            className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Register
          </button>
        </form>

        <p className='my-3 text-center'>Already have an account? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;
