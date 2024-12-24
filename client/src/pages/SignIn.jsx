
import { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function SignIn() {
  const [formdata, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
      });
      const data = await res.json();
      console.log(data);
      if (data.sucess === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='email' 
        className='border p-3 rounded-lg' id="email" onChange={handleChange}/>
        <input type="text" placeholder='password' 
        className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:placeholder-opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 justify-center mt-7'>
        <p>Don't have an account?</p>      
        <Link to={"/sign-up"}>
          <span className='text-blue-700 hover:underline'>Sign Up</span>
        </Link>
      </div> 
      {error && <p className='text-red-600 mt-7'>{error}</p>}
    </div>
  )
}
