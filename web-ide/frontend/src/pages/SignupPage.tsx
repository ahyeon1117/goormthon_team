import rocketIcon from '../assets/rocket-icon.svg'
import { Link } from 'react-router-dom'

const SignupPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4 relative'>
      <div className="absolute w-full max-w-5xl min-h-[60vh] rounded-lg border border-white rotate-3 z-0" />

      <div className='relative flex flex-col md:flex-row w-full max-w-5xl min-h-[60vh] h-full rounded-lg overflow-hidden'>

        {/* Left Section */}
        <div className='md:w-1/2 bg-card-left text-white p-12 flex flex-col justify-center'>
          <h1 className='text-7xl font-bold leading-tight'>ROCKET</h1>
          <div className='flex items-center gap-4 mb-4'>
          <h1 className='text-7xl font-bold leading-tight mb-4'>IDE</h1>
          <img src={rocketIcon} alt="rocket icon" className="h-16 w-16 rotate-[30deg]" />
        </div>

          <p className='text-sm font-noto'>“우리는 지금 당장 실현 가능한 기술로 의미 있는 변화를 만들어냅니다.” “그리고 이 작은 시작은 앞으로의 더 큰 확장 가능성을 품고 있습니다.”</p>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 bg-card-right text-white p-12 flex flex-col justify-center space-y-10">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full bg-transparent border-b border-white outline-none text-white "
            />
          </div>
          <div>
            <label className="block mb-1">Email (ID)</label>
            <input
              type="email"
              className="w-full bg-transparent border-b border-white outline-none text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-white outline-none text-white"
            />
          </div>
          <div>
            <Link to='/signup' className="inline-block bg-btn-primary hover:bg-primary-hover font-semibold text-white px-6 py-2 rounded-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage;