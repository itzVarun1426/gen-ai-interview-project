import {useState} from 'react'
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router'; 


const Login = () => {
    const navigate = useNavigate();
    const {loading , handleLogin} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit= async (e)=>{
    e.preventDefault();
    await handleLogin({email,password});
    console.log(email,password);
    navigate("/");
  }

  if(loading){
    return (<main><h1>.....loading</h1></main>)
  }

  return (
     <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
  )
}

export default Login
