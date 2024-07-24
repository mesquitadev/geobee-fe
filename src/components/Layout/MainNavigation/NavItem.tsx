import { ChevronDown } from 'lucide-react'
import { ElementType } from 'react'
import { Link } from 'react-router-dom'
interface NavItemProps {
  title: string
  to: string
  icon: ElementType
}
const NavItem = ({ title, to, icon: Icon }: NavItemProps) => {
  return (
    <nav className="space-y-0.5">
      <Link
        to={to}
        className="group flex items-center gap-3 rounded px-3 py-2 outline-none hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-zinc-800"
      >
        <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500" />
        <span className="font-medium text-zinc-700 group-hover:text-violet-500 dark:text-zinc-100 dark:group-hover:text-violet-300">
          {title}
        </span>
        <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 group-hover:text-violet-400" />
      </Link>
    </nav>
  )
}

export default NavItem
