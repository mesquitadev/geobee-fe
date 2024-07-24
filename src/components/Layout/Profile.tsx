import { LogOut } from 'lucide-react'

const Profile = () => {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://github.com/mesquitadev.png"
        alt=""
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col truncate">
        <span className="text-sm font-semibold text-zinc-700">
          Paulo Victor
        </span>
        <span className="truncate text-sm text-zinc-500">
          victor@geobee.app
        </span>
      </div>
      <button type="button" className="ml-auto p-2 hover:bg-zinc-50 rounded-md">
        <LogOut className="h-5 w-5 text-zinc-500" />
      </button>
    </div>
  )
}

export default Profile
